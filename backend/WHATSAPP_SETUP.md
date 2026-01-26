# WhatsApp Business API Integration Guide

## Overview

The Ministry of Economy and Industry website can integrate with WhatsApp Business API to allow citizens to interact with the AI chatbot via WhatsApp. This provides an additional communication channel alongside the website chat.

## Features (FR-53)

- ✅ **Two-way messaging**: Citizens can send messages to the ministry's WhatsApp number
- ✅ **AI-powered responses**: Messages are processed by the same AI service as the web chat
- ✅ **Notifications**: Send complaint status updates and other notifications via WhatsApp
- ✅ **Session management**: Maintains conversation context across messages
- ✅ **Template messages**: Pre-approved templates for official notifications
- ✅ **Message tracking**: All WhatsApp conversations are logged and tracked

## Prerequisites

### 1. WhatsApp Business API Access

**Option A: Meta Cloud API (Recommended)**
- Free for up to 1,000 unique users per month
- Hosted by Meta, no infrastructure needed
- Easiest to set up

**Option B: WhatsApp Business API (On-Premises)**
- Requires WhatsApp Business Solution Provider
- Higher costs but more control
- More complex setup

### 2. Requirements

- Facebook Business Manager account
- Verified business (Ministry)
- Phone number for WhatsApp (cannot be used on regular WhatsApp)
- Public HTTPS webhook URL (for receiving messages)

## Setup Instructions

### Step 1: Create Meta for Developers Account

1. Go to https://developers.facebook.com/
2. Log in with Facebook account (or create one)
3. Click "My Apps" → "Create App"
4. Select "Business" as app type
5. Fill in app details:
   - **App Name**: "MOE Syria Chatbot"
   - **Contact Email**: Your ministry email
   - **Business Account**: Create or select existing

### Step 2: Add WhatsApp Product

1. In your app dashboard, click "Add Product"
2. Find "WhatsApp" and click "Set Up"
3. You'll be guided through:
   - **Phone Number**: Add and verify a phone number
   - **Business Verification**: Verify your ministry (may take days)
   - **Message Templates**: Create and submit templates for approval

### Step 3: Get API Credentials

1. Go to WhatsApp → API Setup in your app
2. Note down:
   - **Phone Number ID**: Found in "From" section
   - **WhatsApp Business Account ID**: Found in URL or API Setup
   - **Temporary Access Token**: For testing (expires in 24 hours)

3. For production, create a **System User**:
   - Go to Business Settings → Users → System Users
   - Create new system user
   - Assign WhatsApp permissions
   - Generate access token (doesn't expire)

### Step 4: Configure Environment Variables

Add to your `.env` file:

```env
# Enable WhatsApp
WHATSAPP_ENABLED=true

# API Credentials from Meta
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_BUSINESS_ACCOUNT_ID=987654321098765

# Webhook Verification Token (create your own secure token)
WHATSAPP_VERIFY_TOKEN=your_secure_random_token_here

# API Configuration (usually default is fine)
WHATSAPP_API_URL=https://graph.facebook.com/v18.0
```

**Security Note:** Never commit these credentials to git. Keep them in `.env` only.

### Step 5: Configure Webhook

1. Your webhook URL will be:
   ```
   https://your-domain.gov.sy/api/v1/webhooks/whatsapp
   ```

2. In Meta for Developers:
   - Go to WhatsApp → Configuration
   - Click "Edit" under Webhook
   - Enter your webhook URL
   - Enter the verify token (must match `WHATSAPP_VERIFY_TOKEN` in .env)
   - Click "Verify and Save"

3. Subscribe to webhook fields:
   - Check "messages"
   - Click "Save"

4. Test webhook:
   - Meta will send a GET request to verify
   - If successful, you'll see "Verified" status
   - Check logs: `tail -f storage/logs/laravel.log | grep WhatsApp`

### Step 6: Create Message Templates (Important!)

WhatsApp requires pre-approved templates for outbound notifications.

#### Creating Templates:

1. Go to WhatsApp → Message Templates in Meta Business Manager
2. Click "Create Template"
3. Fill in details:
   - **Template Name**: `complaint_status_update`
   - **Category**: Utility
   - **Language**: Arabic
   - **Header**: None
   - **Body**:
     ```
     تحديث حالة الشكوى

     رقم المتابعة: {{1}}
     الحالة السابقة: {{2}}
     الحالة الجديدة: {{3}}

     يمكنك متابعة شكواك على موقع وزارة الاقتصاد والصناعة.
     ```
   - **Footer**: "وزارة الاقتصاد والصناعة"
   - **Buttons**: None

4. Submit for review (usually approved within 24 hours)

#### Required Templates:

Create these templates:

1. **complaint_status_update**
   - For complaint status notifications
   - Parameters: tracking_number, old_status, new_status

2. **otp_verification** (if using OTP via WhatsApp)
   - For sending OTP codes
   - Parameters: otp_code, expiry_minutes

3. **welcome_message**
   - Initial message when user first contacts
   - No parameters

### Step 7: Test the Integration

#### Test Sending Messages:

```bash
php artisan tinker

use App\Services\WhatsAppService;

$whatsapp = new WhatsAppService();

// Test basic message
$whatsapp->sendMessage('+963912345678', 'مرحباً! هذه رسالة تجريبية من وزارة الاقتصاد والصناعة.');

// Test notification
$whatsapp->sendComplaintStatusNotification('+963912345678', 'COMP-12345', 'new', 'in_progress');
```

#### Test Receiving Messages:

1. Save the ministry WhatsApp number
2. Send a message: "مرحبا"
3. Check logs to see if message was received:
   ```bash
   tail -f storage/logs/laravel.log | grep WhatsApp
   ```
4. You should receive an AI-generated response

### Step 8: Monitor and Maintain

#### Check Status:

```bash
curl https://your-domain.gov.sy/api/v1/admin/webhooks/whatsapp/status \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

#### View Logs:

```bash
# All WhatsApp activity
tail -f storage/logs/laravel.log | grep WhatsApp

# Webhook calls only
tail -f storage/logs/laravel.log | grep "WhatsApp webhook"
```

## Usage in Code

### Sending Notifications

The `NotificationService` automatically sends WhatsApp notifications if enabled:

```php
use App\Services\NotificationService;

$notificationService = app(NotificationService::class);

// This will send via email, SMS, AND WhatsApp (if user has phone)
$notificationService->notifyStatusChange($complaint, $oldStatus, $newStatus);
```

### Manual WhatsApp Sending

```php
use App\Services\WhatsAppService;

$whatsapp = new WhatsAppService();

// Basic text message
$whatsapp->sendMessage('+963912345678', 'Your message here');

// Template message
$whatsapp->sendTemplate('+963912345678', 'complaint_status_update', [
    'COMP-12345',  // Parameter 1: tracking number
    'جديدة',       // Parameter 2: old status
    'قيد المعالجة' // Parameter 3: new status
]);
```

## Message Flow

### Incoming Message Flow:

1. User sends WhatsApp message to ministry number
2. Meta forwards message to webhook: `POST /api/v1/webhooks/whatsapp`
3. `WhatsAppWebhookController` receives and validates message
4. `WhatsAppService::processWebhook()` extracts message details
5. `ChatService` processes message with AI
6. Response sent back to user via WhatsApp
7. Conversation saved to database with channel='whatsapp'

### Outgoing Notification Flow:

1. System event triggers (e.g., complaint status change)
2. `NotificationService` checks user preferences
3. If WhatsApp enabled and user has phone number:
   - `WhatsAppService::sendMessage()` or `sendTemplate()`
   - Message sent via Meta Graph API
4. Meta delivers message to user's WhatsApp
5. Delivery status logged

## Rate Limits

### Free Tier (Cloud API):
- 1,000 unique users per month (free)
- After 1,000: $0.005 - $0.09 per message (varies by country)
- Rate limits: 80 messages per second

### Best Practices:
- Use templates for notifications (more reliable)
- Batch notifications when possible
- Don't send marketing messages (against WhatsApp policy)
- Respect user opt-out preferences

## Troubleshooting

### Messages Not Sending

1. **Check credentials:**
   ```bash
   php artisan tinker
   config('whatsapp.phone_number_id')
   config('whatsapp.access_token')
   ```

2. **Verify WhatsApp is enabled:**
   ```bash
   config('whatsapp.enabled')
   ```

3. **Test API connection:**
   ```bash
   curl "https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID" \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
   ```

4. **Check phone number format:**
   - Must be in format: `963912345678` (no + or spaces)
   - Syrian numbers: start with 963

### Webhook Not Receiving Messages

1. **Verify webhook URL is public and HTTPS**
2. **Check webhook verification:**
   - Go to Meta Dashboard → WhatsApp → Configuration
   - Status should show "Verified"
3. **Check webhook is subscribed to 'messages' field**
4. **Review webhook logs:**
   ```bash
   tail -f storage/logs/laravel.log | grep "WhatsApp webhook"
   ```
5. **Test webhook locally with ngrok:**
   ```bash
   ngrok http 8000
   # Use ngrok URL in Meta dashboard for testing
   ```

### Template Messages Failing

1. **Ensure template is approved:**
   - Check Meta Business Manager → Message Templates
   - Status must be "Approved"
2. **Verify template name matches config:**
   - Check `config/whatsapp.php` templates array
3. **Check parameter count matches template:**
   - Template with 3 parameters needs exactly 3 values
4. **Language code must match:**
   - Use 'ar' for Arabic templates

### API Errors

Common errors and solutions:

- **Error 100**: Invalid parameter
  - Check phone number format
  - Verify template name

- **Error 131030**: Rate limit exceeded
  - Implement message queuing
  - Reduce send frequency

- **Error 131031**: Template name doesn't exist
  - Create template in Business Manager
  - Wait for approval

- **Error 135**: Access token expired
  - Generate new system user token
  - Update WHATSAPP_ACCESS_TOKEN in .env

## Security Considerations

1. **Webhook Verification**
   - Always verify incoming requests are from Meta
   - Use strong, random verify token
   - Never expose verify token publicly

2. **Access Token Security**
   - Never commit tokens to git
   - Use system user tokens (don't expire)
   - Rotate tokens periodically
   - Store in .env only

3. **User Privacy**
   - Get consent before sending WhatsApp messages
   - Allow users to opt-out
   - Don't share phone numbers
   - Comply with WhatsApp Business Policy

4. **Message Content**
   - Don't send sensitive data via WhatsApp
   - Use secure links for complaint details
   - Log all conversations for audit

## Costs

### Meta Cloud API Pricing (2024):

**Free Tier:**
- First 1,000 unique users per month: Free
- Includes all message types

**Paid Tier (after 1,000 users):**
- Syria: ~$0.02 per message
- Notification templates: Free for 24 hours after user message
- Customer service messages: Free for 24 hours after user message
- Marketing messages: Not allowed

**Calculation Example:**
- 5,000 users per month
- Average 2 messages per user
- Cost: (5,000 - 1,000) × 2 × $0.02 = $160/month

## Compliance

### WhatsApp Business Policy

Must comply with:
- No spam or promotional content
- No sensitive data (passwords, credit cards)
- Respond within 24 hours
- Provide opt-out mechanism
- Respect user privacy

### Syrian Regulations

- Get approval from telecom authority
- Store message logs for audit
- Comply with data protection laws
- Use for official government communication only

## Support and Resources

- **Meta Developers Docs**: https://developers.facebook.com/docs/whatsapp
- **WhatsApp Business API**: https://business.whatsapp.com/
- **Cloud API Docs**: https://developers.facebook.com/docs/whatsapp/cloud-api
- **Template Guidelines**: https://developers.facebook.com/docs/whatsapp/message-templates
- **Application Logs**: `storage/logs/laravel.log`

For technical issues, check application logs first, then consult Meta Developer Support.
