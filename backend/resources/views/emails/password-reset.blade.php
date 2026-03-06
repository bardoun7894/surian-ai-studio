<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>إعادة تعيين كلمة المرور</title>
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
        .reset-box {
            background-color: #f8f9fa;
            border: 2px solid #1e3a5f;
            border-radius: 8px;
            padding: 30px;
            margin: 20px 0;
            text-align: center;
        }
        .reset-label {
            font-size: 16px;
            color: #555555;
            margin-bottom: 15px;
        }
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #1e3a5f 0%, #2d5a7b 100%);
            color: #ffffff !important;
            padding: 14px 40px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            margin: 10px 0;
        }
        .reset-button:hover {
            background: linear-gradient(135deg, #2d5a7b 0%, #1e3a5f 100%);
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
        .url-fallback {
            word-break: break-all;
            font-size: 12px;
            color: #888888;
            margin-top: 15px;
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
                تم طلب إعادة تعيين كلمة المرور لحسابك. اضغط على الزر أدناه لإعادة تعيين كلمة المرور:
            </p>

            <div class="reset-box">
                <div class="reset-label">إعادة تعيين كلمة المرور</div>
                <a href="{{ $resetUrl }}" class="reset-button">إعادة تعيين كلمة المرور</a>
            </div>

            <div class="expiry-notice">
                ⏱ هذا الرابط صالح لمدة <strong>ساعة واحدة</strong> فقط.
            </div>

            <div class="url-fallback">
                <p>إذا لم يعمل الزر أعلاه، انسخ الرابط التالي والصقه في متصفحك:</p>
                <p>{{ $resetUrl }}</p>
            </div>

            <div class="security-notice">
                <p>إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني. سيبقى حسابك آمناً.</p>
                <p>لا تشارك هذا الرابط مع أي شخص.</p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>
                هذا البريد الإلكتروني تم إرساله تلقائياً من نظام وزارة الاقتصاد والصناعة. يرجى عدم الرد على هذا البريد.
            </p>
            <p>
                &copy; {{ date('Y') }} وزارة الاقتصاد والصناعة - الجمهورية العربية السورية<br>
                <a href="{{ config('app.url') }}">زيارة الموقع الرسمي</a>
            </p>
        </div>
    </div>
</body>
</html>
