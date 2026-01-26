# Telegram Bot Integration Guide

## Overview

The Ministry of Economy and Industry website can integrate with Telegram to allow citizens to interact with the AI chatbot via Telegram messenger. This provides an additional communication channel that's widely used in Syria.

## Features (FR-53)

- ✅ **Two-way messaging**: Citizens can chat with the ministry bot on Telegram
- ✅ **AI-powered responses**: Messages processed by the same AI service as web chat
- ✅ **Bot commands**: /start, /help, /track, /contact
- ✅ **Inline keyboards**: Interactive buttons for better UX
- ✅ **Notifications**: Send complaint status updates via Telegram
- ✅ **Session management**: Maintains conversation context
- ✅ **Rich formatting**: HTML formatting, emojis, links

## Why Telegram?

### Advantages:
- **Popular in Syria**: Widely used messaging app
- **Free**: No costs for sending messages
- **Easy setup**: Simple bot creation process
- **Rich features**: Buttons, formatting, file sharing
- **Privacy**: End-to-end encryption available
- **API-friendly**: Well-documented, reliable API

### vs WhatsApp:
- Telegram: Free, easier setup, no business verification
- WhatsApp: More users globally, but requires business approval and costs

## Setup Instructions

### Step 1: Create Telegram Bot

1. **Open Telegram** and search for `@BotFather`
2. **Start chat** with BotFather
3. **Create new bot**:
   ```
   /newbot
   ```
4. **Name your bot**:
   ```
   MOE Syria Bot
   ```
5. **Choose username** (must end with 'bot'):
   ```
   moe_syria_bot
   ```
6. **Save credentials**: BotFather will provide:
   - Bot Token: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`
   - Bot Username: `@moe_syria_bot`
   - Bot Link: `t.me/moe_syria_bot`

**Important**: Save the bot token securely. Anyone with this token can control your bot!

### Step 2: Configure Bot Settings

Still in BotFather, configure your bot:

1. **Set description** (shown in chat header):
   ```
   /setdescription
   ```
   Then send:
   ```
   مساعد وزارة الاقتصاد والصناعة الذكي. يمكنني الإجابة على أسئلتك وتقديم المساعدة.
   ```

2. **Set about text** (shown in bot profile):
   ```
   /setabouttext
   ```
   Then send:
   ```
   البوت الرسمي لوزارة الاقتصاد والصناعة في الجمهورية العربية السورية.
   ```

3. **Set profile photo**:
   ```
   /setuserpic
   ```
   Then send ministry logo image

4. **Set commands**:
   ```
   /setcommands
   ```
   Then send:
   ```
   start - بدء المحادثة
   help - عرض المساعدة
   track - متابعة شكوى
   contact - معلومات التواصل
   ```

### Step 3: Configure Environment Variables

Add to your `.env` file:

```env
# Enable Telegram
TELEGRAM_ENABLED=true

# Bot credentials from BotFather
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_BOT_USERNAME=moe_syria_bot

# Webhook secret (create your own secure token)
TELEGRAM_WEBHOOK_SECRET=your_secure_random_token_here

# API URL (default is fine)
TELEGRAM_API_URL=https://api.telegram.org
```

**Security Note:** Never commit bot token to git!

### Step 4: Set Up Webhook

#### Option A: Using Artisan Command (Recommended)

```bash
php artisan tinker

use App\Services\TelegramService;

$telegram = new TelegramService();
$url = config('app.url') . '/api/v1/webhooks/telegram';
$telegram->setWebhook($url);
```

#### Option B: Using API Endpoint

```bash
curl -X POST https://your-domain.gov.sy/api/v1/admin/webhooks/telegram/set \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-domain.gov.sy/api/v1/webhooks/telegram"}'
```

#### Option C: Manual via Telegram API

```bash
curl "https://api.telegram.org/bot123456789:ABCdefGHIjklMNOpqrsTUVwxyz/setWebhook?url=https://your-domain.gov.sy/api/v1/webhooks/telegram"
```

### Step 5: Verify Webhook

Check webhook status:

```bash
# Via application
curl https://your-domain.gov.sy/api/v1/admin/webhooks/telegram/info \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Or directly via Telegram API
curl "https://api.telegram.org/bot123456789:ABCdefGHIjklMNOpqrsTUVwxyz/getWebhookInfo"
```

Expected response:
```json
{
  "url": "https://your-domain.gov.sy/api/v1/webhooks/telegram",
  "has_custom_certificate": false,
  "pending_update_count": 0,
  "last_error_date": 0,
  "max_connections": 40
}
```

### Step 6: Test the Bot

1. **Find your bot** on Telegram: search `@moe_syria_bot`
2. **Start chat**: Click "Start" or send `/start`
3. **Test commands**:
   ```
   /help
   /contact
   /track COMP-12345
   ```
4. **Test AI chat**: Send any question in Arabic
5. **Check logs**:
   ```bash
   tail -f storage/logs/laravel.log | grep Telegram
   ```

## Bot Commands

### User Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/start` | Start conversation, show welcome message | `/start` |
| `/help` | Show available commands and help | `/help` |
| `/track` | Track complaint by tracking number | `/track COMP-12345` |
| `/contact` | Show contact information | `/contact` |

### Admin Commands (via API)

```bash
# Get bot status
GET /api/v1/admin/webhooks/telegram/status

# Set webhook
POST /api/v1/admin/webhooks/telegram/set

# Delete webhook
DELETE /api/v1/admin/webhooks/telegram

# Get webhook info
GET /api/v1/admin/webhooks/telegram/info
```

## Usage in Code

### Sending Notifications

```php
use App\Services\TelegramService;

$telegram = new TelegramService();

// Basic text message
$telegram->sendMessage($chatId, 'Your message here');

// Message with HTML formatting
$telegram->sendMessage($chatId, '<b>Bold</b> <i>Italic</i> <code>Code</code>');

// Message with inline keyboard
$buttons = [
    [
        ['text' => 'Button 1', 'callback_data' => 'action1'],
        ['text' => 'Button 2', 'url' => 'https://example.com'],
    ],
];
$telegram->sendMessageWithKeyboard($chatId, 'Choose option:', $buttons);

// Complaint status notification
$telegram->sendComplaintStatusNotification($chatId, 'COMP-12345', 'new', 'in_progress');
```

### Getting Chat ID

When a user sends a message to your bot, you get their `chat_id` in the webhook. To send them notifications later:

1. User sends `/start` to bot
2. Webhook receives update with chat_id
3. Save chat_id to user profile
4. Use chat_id to send notifications

Example:
```php
// In webhook handler
$chatId = $update['message']['chat']['id'];

// Save to user
$user->telegram_chat_id = $chatId;
$user->save();

// Later, send notification
$telegram->sendMessage($user->telegram_chat_id, 'Notification');
```

## Message Flow

### Incoming Message Flow:

1. User sends message on Telegram
2. Telegram forwards to webhook: `POST /api/v1/webhooks/telegram`
3. `TelegramWebhookController` receives update
4. `TelegramService::processWebhook()` processes message
5. If command, handle command logic
6. If regular message, process with `ChatService` (AI)
7. Response sent back to user via Telegram API
8. Conversation saved to database with channel='telegram'

### Outgoing Notification Flow:

1. System event triggers (e.g., complaint status change)
2. `NotificationService` checks if user has `telegram_chat_id`
3. `TelegramService::sendMessage()` or `sendComplaintStatusNotification()`
4. Message sent via Telegram API
5. Telegram delivers to user
6. Delivery logged

## Advanced Features

### Inline Keyboards

Create interactive buttons:

```php
$buttons = [
    [
        // URL button
        ['text' => '🌐 Visit Website', 'url' => 'https://economy.gov.sy'],
    ],
    [
        // Callback buttons (trigger webhook)
        ['text' => '✅ Yes', 'callback_data' => 'yes'],
        ['text' => '❌ No', 'callback_data' => 'no'],
    ],
];

$telegram->sendMessageWithKeyboard($chatId, 'Question?', $buttons);
```

### HTML Formatting

Supported HTML tags:
```php
$message = "
<b>Bold text</b>
<i>Italic text</i>
<u>Underlined text</u>
<s>Strikethrough text</s>
<code>Monospace code</code>
<pre>Preformatted block</pre>
<a href='https://example.com'>Link text</a>
";

$telegram->sendMessage($chatId, $message);
```

### Emojis

Add emojis for better UX:
```php
$message = "🔔 Notification\n📋 Tracking: COMP-12345\n✅ Status: Resolved";
$telegram->sendMessage($chatId, $message);
```

Common emojis:
- ℹ️ Info
- ⚠️ Warning
- ✅ Success
- ❌ Error
- 📞 Contact
- 🔍 Search
- 📋 Document
- 🔔 Notification

## Rate Limits

Telegram rate limits:
- **30 messages per second** to different users
- **1 message per second** to same user
- **No daily limit**

The service automatically handles rate limiting. If exceeded, Telegram returns 429 error.

## Troubleshooting

### Bot Not Responding

1. **Check if bot is enabled:**
   ```bash
   php artisan tinker
   config('telegram.enabled')
   ```

2. **Verify bot token:**
   ```bash
   curl "https://api.telegram.org/bot<YOUR_TOKEN>/getMe"
   ```
   Should return bot information.

3. **Check webhook:**
   ```bash
   curl "https://api.telegram.org/bot<YOUR_TOKEN>/getWebhookInfo"
   ```
   - `url` should be set
   - `pending_update_count` should be 0
   - `last_error_date` should be 0

4. **View logs:**
   ```bash
   tail -f storage/logs/laravel.log | grep Telegram
   ```

### Webhook Not Receiving Updates

1. **Ensure webhook URL is HTTPS** (Telegram requires HTTPS)
2. **Check webhook is set correctly:**
   ```bash
   curl "https://api.telegram.org/bot<YOUR_TOKEN>/getWebhookInfo"
   ```
3. **Verify webhook secret matches:**
   - Check `TELEGRAM_WEBHOOK_SECRET` in .env
   - Telegram sends this in `X-Telegram-Bot-Api-Secret-Token` header
4. **Test webhook manually:**
   ```bash
   curl -X POST https://your-domain.gov.sy/api/v1/webhooks/telegram \
     -H "Content-Type: application/json" \
     -H "X-Telegram-Bot-Api-Secret-Token: your_secret" \
     -d '{"update_id":123,"message":{"chat":{"id":123},"text":"test"}}'
   ```

### Commands Not Working

1. **Re-register commands with BotFather:**
   ```
   /setcommands
   ```
2. **Restart Telegram app**
3. **Try with @ prefix:**
   ```
   /start@moe_syria_bot
   ```

### Messages Not Formatted

1. **Ensure parse_mode is set:**
   ```php
   $telegram->sendMessage($chatId, '<b>Text</b>', ['parse_mode' => 'HTML']);
   ```
2. **Check HTML is valid:**
   - Tags must be properly closed
   - Special characters must be escaped

## Security Considerations

1. **Bot Token Security**
   - Never commit to git
   - Store in `.env` only
   - Rotate if compromised
   - Use environment-specific tokens

2. **Webhook Security**
   - Use HTTPS only
   - Verify secret token
   - Validate all input
   - Rate limit requests

3. **User Privacy**
   - Get consent before saving chat_id
   - Allow users to stop bot (/stop)
   - Don't share chat_ids
   - Log conversations for audit

4. **Content Filtering**
   - Validate user input
   - Filter sensitive information
   - Don't send passwords/tokens via Telegram
   - Use secure links for private data

## Best Practices

1. **User Experience**
   - Use emojis for visual appeal
   - Keep messages concise
   - Use inline keyboards for navigation
   - Provide clear command help

2. **Performance**
   - Process webhooks asynchronously
   - Use queues for bulk notifications
   - Cache frequently accessed data
   - Monitor response times

3. **Reliability**
   - Implement retry logic
   - Handle Telegram API errors gracefully
   - Log all interactions
   - Monitor webhook health

4. **Compliance**
   - Follow Telegram Bot Guidelines
   - Don't spam users
   - Respect user privacy
   - Provide opt-out mechanism

## Comparison: Telegram vs WhatsApp

| Feature | Telegram | WhatsApp |
|---------|----------|----------|
| **Cost** | Free | Free (1k users), then paid |
| **Setup** | Easy (5 min) | Complex (days for approval) |
| **Verification** | None | Business verification required |
| **Rich Features** | ✅ Commands, buttons, formatting | ❌ Limited |
| **File Size** | 2 GB | 16 MB |
| **Groups** | 200,000 members | 1,024 members |
| **Bot API** | Excellent | Limited |
| **Privacy** | Good | End-to-end encrypted |
| **Popular in Syria** | High | Very High |

**Recommendation**: Start with Telegram (easier), add WhatsApp later if needed.

## Resources

- **Telegram Bot API**: https://core.telegram.org/bots/api
- **BotFather**: https://t.me/botfather
- **Bot Examples**: https://core.telegram.org/bots/samples
- **Application Logs**: `storage/logs/laravel.log`

For issues or questions, check logs first, then consult Telegram Bot API documentation.
