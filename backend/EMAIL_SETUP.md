# Email Service Configuration Guide

## Overview

The Ministry of Economy and Industry website has built-in email notification functionality. This guide explains how to configure email services for production use.

## Current Status

- **Email Templates**: ✅ Created and tested
- **NotificationService**: ✅ Integrated with email sending
- **Queue Support**: ✅ Emails sent via queue for better performance
- **User Preferences**: ✅ Users can enable/disable email notifications

## Supported Email Providers

### 1. SMTP (Recommended for Government)
Most reliable for government organizations. Works with any email server.

**Configuration (.env):**
```env
MAIL_MAILER=smtp
MAIL_HOST=mail.economy.gov.sy
MAIL_PORT=587
MAIL_USERNAME=noreply@economy.gov.sy
MAIL_PASSWORD=your_password_here
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@economy.gov.sy
MAIL_FROM_NAME="وزارة الاقتصاد والصناعة"
```

**Common SMTP Ports:**
- 587: TLS (recommended)
- 465: SSL
- 25: Unencrypted (not recommended)

### 2. AWS SES (Amazon Simple Email Service)
Cost-effective and scalable for high-volume sending.

**Configuration:**
```env
MAIL_MAILER=ses
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_DEFAULT_REGION=us-east-1
MAIL_FROM_ADDRESS=noreply@economy.gov.sy
MAIL_FROM_NAME="وزارة الاقتصاد والصناعة"
```

**Required Package:**
```bash
composer require aws/aws-sdk-php
```

### 3. Mailgun
Popular third-party service with good deliverability.

**Configuration:**
```env
MAIL_MAILER=mailgun
MAILGUN_DOMAIN=your-domain.mailgun.org
MAILGUN_SECRET=your_mailgun_secret
MAIL_FROM_ADDRESS=noreply@economy.gov.sy
MAIL_FROM_NAME="وزارة الاقتصاد والصناعة"
```

**Required Package:**
```bash
composer require symfony/mailgun-mailer symfony/http-client
```

### 4. Postmark
Excellent deliverability rates and detailed analytics.

**Configuration:**
```env
MAIL_MAILER=postmark
POSTMARK_TOKEN=your_postmark_token
MAIL_FROM_ADDRESS=noreply@economy.gov.sy
MAIL_FROM_NAME="وزارة الاقتصاد والصناعة"
```

**Required Package:**
```bash
composer require symfony/postmark-mailer symfony/http-client
```

## Email Notification Types

The system sends emails for the following events:

1. **Complaint Notifications**
   - New complaint submitted
   - Status change
   - Response added
   - Overdue complaint (staff only)

2. **Suggestion Notifications**
   - Status change
   - Response from ministry

3. **Security Alerts**
   - Failed login attempts
   - Account locked
   - Security events (admin only)

4. **System Notifications**
   - Welcome email (registration)
   - Password reset
   - Email verification

## User Notification Preferences

Users can control their email notifications through the `/settings/notifications` page:

```php
// Default preferences structure
[
    'email_enabled' => true,
    'email_types' => ['all'], // or specific types like ['complaint', 'suggestion']
    'sms_enabled' => false,
    'push_enabled' => true,
]
```

## Queue Configuration

Email sending is queued for better performance. Make sure to run the queue worker:

```bash
# Start queue worker
php artisan queue:work

# Or use supervisor in production (recommended)
```

**Supervisor Configuration Example:**
```ini
[program:moe-queue-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/backend/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/path/to/backend/storage/logs/worker.log
```

## Testing Email Configuration

### 1. Test using Artisan Tinker

```bash
php artisan tinker

# Send a test email
Mail::raw('Test email from MOE', function ($message) {
    $message->to('test@example.com')
            ->subject('Test Email');
});
```

### 2. Check Mail Logs

```bash
# View mail logs
tail -f storage/logs/laravel.log | grep -i mail
```

### 3. Use Mailtrap for Development

For development/staging environments, use Mailtrap:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
```

## Production Recommendations

1. **Use a Dedicated Email Service**
   - SMTP with government email server (most control)
   - AWS SES (cost-effective, scalable)
   - Postmark (best deliverability)

2. **Configure SPF, DKIM, and DMARC**
   - Add SPF record to DNS
   - Configure DKIM signing
   - Set up DMARC policy

3. **Monitor Email Delivery**
   - Set up bounce handling
   - Monitor delivery rates
   - Track spam complaints

4. **Email Queue**
   - Use Redis or database for queue driver
   - Run multiple queue workers
   - Set up supervisor for auto-restart

5. **Rate Limiting**
   - Configure sending limits per hour
   - Implement retry logic for failures
   - Use exponential backoff

## Troubleshooting

### Emails Not Sending

1. Check queue is running: `php artisan queue:work`
2. Verify mail configuration in `.env`
3. Check Laravel logs: `storage/logs/laravel.log`
4. Test SMTP connection:
   ```bash
   php artisan tinker
   Mail::raw('test', function($m) { $m->to('test@example.com')->subject('test'); });
   ```

### Emails Going to Spam

1. Configure SPF record
2. Enable DKIM signing
3. Set up DMARC policy
4. Use a reputable email service
5. Avoid spam trigger words in subject/body

### Slow Email Sending

1. Enable queue: `QUEUE_CONNECTION=database` or `redis`
2. Run queue worker: `php artisan queue:work`
3. Increase worker processes
4. Use async email service (SES, Mailgun)

## Security Considerations

1. **Never commit credentials to git**
2. **Use environment variables for all secrets**
3. **Enable TLS/SSL for SMTP connections**
4. **Implement rate limiting to prevent abuse**
5. **Validate email addresses before sending**
6. **Use a no-reply address for automated emails**

## Support

For issues or questions:
- Check Laravel mail documentation: https://laravel.com/docs/11.x/mail
- Review application logs in `storage/logs/`
- Contact system administrator
