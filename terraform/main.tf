terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0" # Specify a recent version
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

locals {
  name_suffix   = "xyz-frontend"
  bucket_name   = "${local.name_suffix}-web-app"
  tags = {
    Terraform   = "true"
    Project     = "NextjsStaticApp"
    Environment = "production"
  }
}

# 1. S3 Bucket for storing the static Next.js export
resource "aws_s3_bucket" "site_bucket" {
  bucket = local.bucket_name
  tags   = local.tags
}

resource "aws_s3_bucket_ownership_controls" "site_bucket_ownership" {
  bucket = aws_s3_bucket.site_bucket.id
  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_public_access_block" "site_bucket_public_access_block" {
  bucket                  = aws_s3_bucket.site_bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# 2. CloudFront Origin Access Control (OAC) - Modern replacement for OAI
resource "aws_cloudfront_origin_access_control" "default" {
  name                              = "oac-${local.bucket_name}"
  description                       = "OAC for S3 bucket ${local.bucket_name}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# 3. S3 Bucket Policy allowing CloudFront OAC to read objects
data "aws_iam_policy_document" "s3_bucket_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.site_bucket.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.s3_distribution.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "site_bucket_policy" {
  bucket = aws_s3_bucket.site_bucket.id
  policy = data.aws_iam_policy_document.s3_bucket_policy.json
  depends_on = [
    aws_s3_bucket_ownership_controls.site_bucket_ownership,
    aws_s3_bucket_public_access_block.site_bucket_public_access_block,
  ]
}

# 4. CloudFront Function for URL Rewriting
resource "aws_cloudfront_function" "rewrite_nextjs_paths" {
  name    = "nextjs-path-rewrite-${local.name_suffix}"
  runtime = "cloudfront-js-1.0"
  comment = "Rewrites Next.js static paths like /about to /about.html"
  publish = true # Must be published to be associated with a distribution
  code    = <<-EOT
    function handler(event) {
        var request = event.request;
        var uri = request.uri;

        // Check if the URI contains a file extension (e.g., .css, .js, .png)
        // If it does, it's likely a static asset and shouldn't be rewritten.
        if (uri.includes('.')) {
            return request;
        }

        // If the URI is "/", serve index.html
        if (uri === '/') {
            request.uri += 'index.html';
        }
        // If the URI ends with a trailing slash, append index.html
        else if (uri.endsWith('/')) {
            request.uri += 'index.html';
        }
        // If the URI has no extension and is not '/', append .html
        else {
            request.uri += '.html';
        }

        return request;
    }
  EOT
}

# 5. CloudFront Distribution
resource "aws_cloudfront_distribution" "s3_distribution" {
  origin {
    domain_name              = aws_s3_bucket.site_bucket.bucket_regional_domain_name
    origin_id                = "S3-${local.bucket_name}"
    origin_access_control_id = aws_cloudfront_origin_access_control.default.id
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront distribution for ${local.bucket_name}"
  default_root_object = "index.html" # Still good practice for the root URL

  # for custom domain, uncomment and configure aliases and viewer_certificate
  # aliases = ["www.yourdomain.com", "yourdomain.com"] # TODO: Replace with your domain


  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-${local.bucket_name}"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600 # 1 hour
    max_ttl                = 86400 # 24 hours
    compress               = true # Enable compression for better performance

    # Attach the CloudFront Function here
    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.rewrite_nextjs_paths.arn
    }
  }

  # The custom_error_response blocks are still useful as a fallback,
  # but the CloudFront Function will handle most cases for direct access.
  custom_error_response {
    error_caching_min_ttl = 0
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
  }

  custom_error_response {
    error_caching_min_ttl = 0
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = local.tags
}


# 6. Outputs
output "s3_bucket_name" {
  description = "The name of the S3 bucket."
  value       = aws_s3_bucket.site_bucket.bucket
}

output "s3_bucket_regional_domain_name" {
  description = "The regional domain name of the S3 bucket."
  value       = aws_s3_bucket.site_bucket.bucket_regional_domain_name
}

output "cloudfront_distribution_id" {
  description = "The ID of the CloudFront distribution."
  value       = aws_cloudfront_distribution.s3_distribution.id
}

output "cloudfront_distribution_domain_name" {
  description = "The domain name of the CloudFront distribution."
  value       = aws_cloudfront_distribution.s3_distribution.domain_name
}

output "website_url" {
  description = "The URL of the deployed Next.js application."
  value       = "https://${aws_cloudfront_distribution.s3_distribution.domain_name}"
}