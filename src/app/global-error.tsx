'use client';

import { AlertCircle, Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useScopedI18n } from '@/locales/client';

type ErrorPageProps = {
  error: Error;
  reset?: () => void;
};

const ErrorPage = ({ error, reset }: ErrorPageProps) => {
  const [copied, setCopied] = useState(false);
  const t = useScopedI18n('error');

  const copyErrorToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(error.message);
      setCopied(true);
      toast(t('copySuccess'), {
        description: t('copySuccessDescription'),
      });

      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t('copyError'), {
        description: t('copyErrorDescription'),
      });
    }
  };

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="text-destructive-foreground flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <CardTitle>{t('title')}</CardTitle>
          </div>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-md p-4">
            <pre className="text-sm break-words whitespace-pre-wrap">
              {error.message || 'An unknown error occurred'}
            </pre>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="secondary" onClick={copyErrorToClipboard}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                {t('copied')}
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                {t('copyErrorTitle')}
              </>
            )}
          </Button>
          {reset && <Button onClick={reset}>{t('tryAgain')}</Button>}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ErrorPage;
