'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, XCircle, Loader2, Radio } from 'lucide-react';

export default function ViberSetupPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'idle' | 'success' | 'error';
    message: string;
    details?: any;
  }>({ type: 'idle', message: '' });

  const [webhookInfo, setWebhookInfo] = useState<{
    url: string;
    isConfigured: boolean;
    eventTypes: string[];
  } | null>(null);

  const checkWebhookStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/viber/setup-webhook', {
        method: 'GET',
      });

      const data = await response.json();

      if (data.success) {
        setWebhookInfo(data.webhook);
        setStatus({
          type: 'success',
          message: 'Webhook status loaded',
          details: data.webhook,
        });
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Failed to get webhook status',
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  const setupWebhook = async () => {
    setLoading(true);
    setStatus({ type: 'idle', message: '' });

    try {
      const response = await fetch('/api/viber/setup-webhook', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setStatus({
          type: 'success',
          message: 'Webhook configured successfully! ✅',
          details: data.webhook,
        });
        setWebhookInfo(data.webhook);
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Failed to setup webhook',
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className="h-6 w-6" />
            Viber Channel Integration Setup
          </CardTitle>
          <CardDescription>
            Configure webhook to enable posting blog posts to your Viber channel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Current Status</h3>
            {webhookInfo ? (
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  {webhookInfo.isConfigured ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="font-medium">
                    {webhookInfo.isConfigured ? 'Configured' : 'Not Configured'}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">URL:</span> {webhookInfo.url}
                  </div>
                  {webhookInfo.eventTypes.length > 0 && (
                    <div>
                      <span className="font-medium">Events:</span>{' '}
                      {webhookInfo.eventTypes.join(', ')}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Click &quot;Check Status&quot; to see current webhook configuration
              </p>
            )}
          </div>

          {/* Status Messages */}
          {status.message && (
            <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
              <AlertDescription>
                <div className="space-y-2">
                  <p>{status.message}</p>
                  {status.details && (
                    <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded mt-2 overflow-auto">
                      {JSON.stringify(status.details, null, 2)}
                    </pre>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={checkWebhookStatus} disabled={loading} variant="outline">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Check Status'
              )}
            </Button>

            <Button
              onClick={setupWebhook}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting up...
                </>
              ) : (
                'Setup Webhook'
              )}
            </Button>
          </div>

          {/* Instructions */}
          <div className="border-t pt-6 space-y-3">
            <h3 className="text-lg font-semibold">Setup Instructions</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
              <li>Click &quot;Check Status&quot; to see current webhook configuration</li>
              <li>
                If not configured, click &quot;Setup Webhook&quot; to configure it (one-time setup)
              </li>
              <li>
                After successful setup, test by publishing a new blog post from{' '}
                <a href="/admin/blog" className="text-blue-600 underline">
                  /admin/blog
                </a>
              </li>
              <li>Check your Viber channel to see the published post</li>
            </ol>
          </div>

          {/* Troubleshooting */}
          <div className="border-t pt-6 space-y-3">
            <h3 className="text-lg font-semibold">Troubleshooting</h3>
            <div className="text-sm text-muted-foreground space-y-2">
              <p>
                <strong>Error: &quot;Unauthorized&quot;</strong> - You must be logged in as an admin
              </p>
              <p>
                <strong>Error: &quot;Viber service not configured&quot;</strong> - Check that
                VIBER_AUTH_TOKEN is set in .env.local
              </p>
              <p>
                <strong>Error: &quot;Webhook URL must use HTTPS&quot;</strong> - Make sure
                NEXT_PUBLIC_BASE_URL starts with https://
              </p>
              <p>
                <strong>Still having issues?</strong> - Check Vercel logs for detailed error
                messages
              </p>
            </div>
          </div>

          {/* Environment Info */}
          <div className="border-t pt-6 space-y-3">
            <h3 className="text-lg font-semibold">Environment Info</h3>
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg text-sm font-mono">
              <div>
                <span className="text-muted-foreground">Base URL:</span>{' '}
                {process.env.NEXT_PUBLIC_BASE_URL || 'Not set'}
              </div>
              <div>
                <span className="text-muted-foreground">Webhook URL:</span>{' '}
                {process.env.NEXT_PUBLIC_BASE_URL || 'https://vrachka.eu'}
                /api/viber/webhook
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
