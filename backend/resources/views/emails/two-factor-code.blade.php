<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>رمز التحقق</title>
    <style>
        body {
            font-family: 'Arial', 'Tahoma', sans-serif;
            background-color: #edebe0;
            margin: 0;
            padding: 0;
            direction: rtl;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(9, 66, 57, 0.12);
        }
        .header {
            background: linear-gradient(135deg, #094239 0%, #0d5c50 50%, #094239 100%);
            color: #ffffff;
            padding: 36px 24px;
            text-align: center;
            position: relative;
        }
        .header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #b9a779, #d4af37, #b9a779);
        }
        .header h1 {
            margin: 0;
            font-size: 22px;
            font-weight: bold;
            letter-spacing: 0.5px;
        }
        .header .ministry-name {
            margin-top: 8px;
            font-size: 13px;
            opacity: 0.85;
            color: #b9a779;
        }
        .content {
            padding: 32px 24px;
        }
        .greeting {
            font-size: 16px;
            color: #161616;
            margin-bottom: 8px;
            font-weight: bold;
        }
        .message {
            font-size: 15px;
            color: #3d3a3b;
            line-height: 1.7;
            margin-bottom: 24px;
        }
        .otp-box {
            background: linear-gradient(135deg, #f8f7f3 0%, #edebe0 100%);
            border: 1px solid #b9a779;
            border-radius: 12px;
            padding: 32px;
            margin: 24px 0;
            text-align: center;
        }
        .otp-label {
            font-size: 14px;
            color: #3d3a3b;
            margin-bottom: 12px;
        }
        .gold-divider {
            width: 60px;
            height: 3px;
            background: linear-gradient(90deg, #b9a779, #d4af37);
            margin: 12px auto 16px;
            border-radius: 2px;
        }
        .otp-code {
            font-size: 40px;
            font-weight: bold;
            color: #094239;
            letter-spacing: 10px;
            font-family: 'Courier New', monospace;
            direction: ltr;
            display: inline-block;
            padding: 12px 24px;
            background-color: #ffffff;
            border-radius: 10px;
            border: 2px dashed #b9a779;
        }
        .expiry-notice {
            background-color: #fdf8e8;
            border-right: 4px solid #b9a779;
            padding: 12px 16px;
            margin: 20px 0;
            border-radius: 6px;
            font-size: 14px;
            color: #7a6a3a;
        }
        .security-notice {
            color: #3d3a3b;
            font-size: 13px;
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid #edebe0;
            line-height: 1.6;
        }
        .footer {
            background-color: #094239;
            padding: 24px;
            text-align: center;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
        }
        .footer a {
            color: #b9a779;
            text-decoration: none;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>وزارة الاقتصاد والصناعة</h1>
            <div class="ministry-name">الجمهورية العربية السورية</div>
        </div>

        <!-- Content -->
        <div class="content">
            <p class="greeting">مرحباً،</p>
            <p class="message">
                تم طلب رمز تحقق لتسجيل الدخول إلى حسابك في بوابة وزارة الاقتصاد والصناعة. يرجى استخدام الرمز التالي:
            </p>

            <div class="otp-box">
                <div class="otp-label">رمز التحقق الخاص بك</div>
                <div class="gold-divider"></div>
                <div class="otp-code">{{ $otp }}</div>
            </div>

            <div class="expiry-notice">
                &#9201; هذا الرمز صالح لمدة <strong>15 دقيقة</strong> فقط.
            </div>

            <div class="security-notice">
                <p style="margin: 0 0 8px 0;">إذا لم تطلب هذا الرمز، يرجى تجاهل هذا البريد الإلكتروني. قد يكون شخص ما قد أدخل بريدك الإلكتروني عن طريق الخطأ.</p>
                <p style="margin: 0;"><strong>لا تشارك هذا الرمز مع أي شخص. لن يطلب منك موظفونا أبداً هذا الرمز.</strong></p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p style="margin: 0 0 8px 0;">
                هذا البريد الإلكتروني تم إرساله تلقائياً من نظام وزارة الاقتصاد والصناعة. يرجى عدم الرد على هذا البريد.
            </p>
            <div style="width: 40px; height: 2px; background: #b9a779; margin: 12px auto;"></div>
            <p style="margin: 0;">
                &copy; {{ date('Y') }} وزارة الاقتصاد والصناعة - الجمهورية العربية السورية<br>
                <a href="{{ config('app.frontend_url', config('app.url')) }}">زيارة الموقع الرسمي</a>
            </p>
        </div>
    </div>
</body>
</html>
