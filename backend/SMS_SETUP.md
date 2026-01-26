# SMS and OTP Configuration Guide

## Overview

The Ministry of Economy and Industry website includes SMS functionality for:
- OTP (One-Time Password) verification
- User notifications
- Security alerts

## Current Status

- **SMS Service**: ✅ Created and ready
- **Multiple Providers**: ✅ Twilio, Nexmo, Syria SMS, Log
- **OTP Generation**: ✅ Implemented
- **Rate Limiting**: ✅ Configured
- **User Preferences**: ✅ Users can enable/disable SMS notifications

## Supported SMS Providers

### 1. Twilio (Recommended - International)
Most reliable global SMS provider with excellent documentation.

**Features:**
- 99.95% uptime
- Delivery receipts
- Two-way SMS
- Works globally

**Configuration (.env):**
```env
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_FROM_NUMBER=+1234567890
```

**Setup Steps:**
1. Create account at https://www.twilio.com
2. Verify your phone number
3. Get Account SID and Auth Token from dashboard
4. Buy a phone number or use trial number
5. Add credentials to `.env`

**Pricing:**
- Syria: ~$0.04 per SMS
- Trial account: Free credits available

### 2. Nexmo/Vonage
Good alternative to Twilio with competitive pricing.

**Configuration (.env):**
```env
SMS_PROVIDER=nexmo
NEXMO_API_KEY=your_api_key
NEXMO_API_SECRET=your_api_secret
NEXMO_FROM_NUMBER=MOE
```

**Setup Steps:**
1. Create account at https://www.vonage.com
2. Get API credentials from dashboard
3. Add credentials to `.env`

**Pricing:**
- Syria: ~$0.03 per SMS
- Free trial available

### 3. Syria SMS (Local Provider)
**Note:** This is a placeholder for a local Syrian SMS provider. Update the API URL and authentication method based on the actual provider you choose.

**Configuration (.env):**
```env
SMS_PROVIDER=syria_sms
SYRIA_SMS_API_KEY=your_api_key
SYRIA_SMS_SENDER=MOE
SYRIA_SMS_BASE_URL=https://api.yoursyriaprovider.com/send
```

**Advantages:**
- Local support
- Potentially lower costs
- Better for Syrian numbers
- Compliance with local regulations

**Integration Steps:**
1. Contact local SMS provider
2. Get API credentials
3. Update `app/Services/SmsService.php` `sendViaSyriaSMS()` method to match provider's API
4. Test thoroughly

### 4. Log (Development Only)
Logs SMS messages instead of sending them. Use for development/testing.

**Configuration:**
```env
SMS_PROVIDER=log
```

SMS messages will be logged to `storage/logs/sms.log`

## OTP (One-Time Password) Configuration

### Settings (.env)

```env
OTP_LENGTH=6                    # Number of digits (default: 6)
OTP_EXPIRY_MINUTES=10          # How long OTP is valid (default: 10 minutes)
OTP_MAX_ATTEMPTS=3             # Max verification attempts (default: 3)
```

### Usage Example

```php
use App\Services\SmsService;

$smsService = new SmsService();

// Generate OTP
$otp = SmsService::generateOtp(6); // Returns 6-digit code

// Send OTP
$smsService->sendOtp('+963912345678', $otp);

// Send general notification
$smsService->sendNotification(
    '+963912345678',
    'تحديث الشكوى',
    'تم تحديث حالة شكواك رقم COMP-12345'
);
```

## Rate Limiting

To prevent abuse, SMS sending is rate-limited:

```env
SMS_RATE_LIMIT_HOUR=10         # Max SMS per hour per user
SMS_RATE_LIMIT_DAY=50          # Max SMS per day per user
```

Implementation:
```php
// Check rate limit before sending
$key = "sms:limit:{$userId}";
if (RateLimiter::tooManyAttempts($key, 10)) {
    throw new Exception('Too many SMS sent. Please try again later.');
}

// Send SMS
$smsService->send($phoneNumber, $message);

// Increment counter
RateLimiter::hit($key, 3600); // 1 hour
```

## User Notification Preferences

Users control SMS notifications through their profile settings:

```php
// User preferences structure
[
    'email_enabled' => true,
    'sms_enabled' => true,      // Enable/disable SMS notifications
    'push_enabled' => true,
]
```

Check before sending:
```php
$user = User::find($userId);
if ($user->notification_preferences['sms_enabled'] ?? false) {
    $smsService->send($user->phone, $message);
}
```

## Testing SMS Configuration

### 1. Test via Artisan Tinker

```bash
php artisan tinker

use App\Services\SmsService;

$smsService = new SmsService();

// Test basic SMS
$smsService->send('+963912345678', 'Test message');

// Test OTP
$otp = SmsService::generateOtp();
$smsService->sendOtp('+963912345678', $otp);
```

### 2. Check Logs

```bash
# View SMS logs
tail -f storage/logs/sms.log

# Or Laravel main log
tail -f storage/logs/laravel.log | grep SMS
```

### 3. Use Test Numbers

Most providers offer test numbers that don't actually send SMS but return success:

**Twilio Test Numbers:**
- `+15005550006` - Valid number (success)
- `+15005550001` - Invalid number (error)

## Production Recommendations

### 1. Choose the Right Provider

**For Government/Official Use:**
- Use local Syrian provider for compliance
- Ensure data sovereignty
- Get proper government approval

**For International Reach:**
- Twilio or Nexmo
- Better for users outside Syria
- More reliable delivery

### 2. Security Best Practices

1. **Never log OTP codes in production**
2. **Implement rate limiting strictly**
3. **Use HTTPS for all API calls**
4. **Validate phone numbers before sending**
5. **Implement retry logic with exponential backoff**
6. **Monitor failed delivery rates**

### 3. Cost Management

1. **Set daily/monthly spending limits**
2. **Monitor usage per user**
3. **Implement SMS quotas**
4. **Use email as fallback when possible**
5. **Review and optimize message templates**

### 4. Monitoring

1. **Track delivery rates**
2. **Monitor failed sends**
3. **Set up alerts for high volume**
4. **Log all SMS for audit purposes**
5. **Review costs regularly**

## Syrian Phone Number Format

The system automatically normalizes Syrian numbers:

```
Input Formats:
- 0912345678
- 912345678
- +963912345678
- 963912345678

Normalized Output:
+963912345678
```

**Syrian Mobile Prefixes:**
- MTN Syria: 93x, 94x
- Syriatel: 95x, 96x, 98x, 99x

## Troubleshooting

### SMS Not Sending

1. **Check provider credentials:**
   ```bash
   php artisan tinker
   config('sms.providers.twilio')
   ```

2. **Verify phone number format:**
   ```bash
   php artisan tinker
   use App\Services\SmsService;
   $service = new SmsService();
   // Test normalization
   echo $service->normalizePhoneNumber('0912345678');
   ```

3. **Check provider status:**
   - Twilio: https://status.twilio.com
   - Nexmo: https://status.nexmo.com

4. **Review logs:**
   ```bash
   tail -f storage/logs/laravel.log | grep -i sms
   ```

### High Costs

1. Review and optimize message templates (shorter = cheaper)
2. Implement stricter rate limiting
3. Use email for non-critical notifications
4. Batch notifications when possible
5. Monitor and block spam/abuse

### Delivery Failures

1. **Check phone number validity**
2. **Verify user has mobile network coverage**
3. **Check if number is blocked/blacklisted**
4. **Review provider delivery reports**
5. **Try alternative provider**

## Integration with NotificationService

SMS is integrated into the NotificationService:

```php
use App\Services\NotificationService;
use App\Services\SmsService;

class NotificationService
{
    protected SmsService $smsService;

    public function __construct(SmsService $smsService)
    {
        $this->smsService = $smsService;
    }

    public function notify(User $user, string $type, string $title, string $body, array $data = [])
    {
        // Create in-app notification
        $notification = Notification::create([...]);

        // Send email if enabled
        $this->sendEmailNotification(...);

        // Send SMS if enabled
        if ($user->notification_preferences['sms_enabled'] ?? false) {
            $this->smsService->sendNotification($user->phone, $title, $body);
        }

        return $notification;
    }
}
```

## Compliance and Legal

### Syrian Regulations

1. **Get proper authorization** from Syrian telecom authority
2. **Comply with data protection** laws
3. **Allow users to opt-out** of SMS notifications
4. **Store consent records** for audit
5. **Don't send marketing SMS** without explicit consent

### GDPR (if applicable)

1. Get explicit consent for SMS
2. Allow users to withdraw consent
3. Store SMS logs securely
4. Implement data retention policies
5. Provide data export functionality

## Support and Resources

- **Twilio Docs:** https://www.twilio.com/docs/sms
- **Nexmo Docs:** https://developer.vonage.com/messaging/sms/overview
- **Laravel Notifications:** https://laravel.com/docs/11.x/notifications
- **Application Logs:** `storage/logs/`

For issues or questions, contact the system administrator.
