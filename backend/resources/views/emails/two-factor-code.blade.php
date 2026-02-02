<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>رمز التحقق</title>
    <style>
        body {
            font-family: 'Arial', 'Tahoma', sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            direction: rtl;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #1e3a5f 0%, #2d5a7b 100%);
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
        }
        .header .ministry-name {
            margin-top: 10px;
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 30px 20px;
        }
        .otp-box {
            background-color: #f8f9fa;
            border: 2px solid #1e3a5f;
            border-radius: 8px;
            padding: 30px;
            margin: 20px 0;
            text-align: center;
        }
        .otp-label {
            font-size: 16px;
            color: #555555;
            margin-bottom: 15px;
        }
        .otp-code {
            font-size: 36px;
            font-weight: bold;
            color: #1e3a5f;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            direction: ltr;
        }
        .expiry-notice {
            background-color: #fff3cd;
            border-right: 4px solid #ffc107;
            padding: 12px 16px;
            margin: 20px 0;
            border-radius: 4px;
            font-size: 14px;
            color: #856404;
        }
        .security-notice {
            color: #666666;
            font-size: 13px;
            margin-top: 25px;
            padding-top: 15px;
            border-top: 1px solid #e0e0e0;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666666;
            border-top: 1px solid #e0e0e0;
        }
        .footer a {
            color: #1e3a5f;
            text-decoration: none;
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
            <p style="font-size: 16px; color: #333333;">مرحباً،</p>
            <p style="font-size: 16px; color: #333333; line-height: 1.6;">
                تم طلب رمز تحقق لتسجيل الدخول إلى حسابك. يرجى استخدام الرمز التالي:
            </p>

            <div class="otp-box">
                <div class="otp-label">رمز التحقق الخاص بك</div>
                <div class="otp-code">{{ $otp }}</div>
            </div>

            <div class="expiry-notice">
                ⏱ هذا الرمز صالح لمدة <strong>15 دقيقة</strong> فقط.
            </div>

            <div class="security-notice">
                <p>إذا لم تطلب هذا الرمز، يرجى تجاهل هذا البريد الإلكتروني. قد يكون شخص ما قد أدخل بريدك الإلكتروني عن طريق الخطأ.</p>
                <p>لا تشارك هذا الرمز مع أي شخص. لن يطلب منك موظفونا أبداً هذا الرمز.</p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>
                هذا البريد الإلكتروني تم إرساله تلقائياً من نظام وزارة الاقتصاد والصناعة. يرجى عدم الرد على هذا البريد.
            </p>
            <p>
                © {{ date('Y') }} وزارة الاقتصاد والصناعة - الجمهورية العربية السورية<br>
                <a href="{{ config('app.url') }}">زيارة الموقع الرسمي</a>
            </p>
        </div>
    </div>
</body>
</html>
