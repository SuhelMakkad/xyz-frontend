## Local Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Run the development server**:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deployment

1. **Build the Next.js application**:
   ```bash
   pnpm build
   ```

2. **Deploy using Terraform**:
   ```bash
   # Navigate to terraform directory
   cd terraform

   # Initialize Terraform, this is needed only once
   terraform init

   # Review the planned changes
   terraform plan

   # Apply the changes
   terraform apply
   ```

4. **Upload the static site to S3**:
   ```bash
   # Get the S3 bucket name from Terraform output
   S3_BUCKET=$(terraform output -raw s3_bucket_name)

   # Upload the contents of the out directory to S3
   aws s3 sync ../out/ s3://$S3_BUCKET/ --delete
   ```

5. **Invalidate CloudFront cache**:
   ```bash
   # Get the CloudFront distribution ID from Terraform output
   CF_DISTRIBUTION_ID=$(terraform output -raw cloudfront_distribution_id)

   # Create an invalidation
   aws cloudfront create-invalidation --distribution-id $CF_DISTRIBUTION_ID --paths "/*"
   ```

After deployment, your site will be available at the CloudFront URL shown in the Terraform output:
```bash
terraform output website_url
```

Note: Make sure you have AWS CLI configured with appropriate credentials before running the deployment commands.
