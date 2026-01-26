<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
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
        .notification-box {
            background-color: #f8f9fa;
            border-right: 4px solid #1e3a5f;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .notification-title {
            font-size: 20px;
            font-weight: bold;
            color: #1e3a5f;
            margin-bottom: 15px;
        }
        .notification-body {
            font-size: 16px;
            line-height: 1.6;
            color: #333333;
            margin-bottom: 20px;
        }
        .notification-data {
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            padding: 15px;
            margin: 15px 0;
        }
        .data-row {
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        .data-row:last-child {
            border-bottom: none;
        }
        .data-label {
            font-weight: bold;
            color: #1e3a5f;
            display: inline-block;
            min-width: 150px;
        }
        .data-value {
            color: #555555;
        }
        .action-button {
            display: inline-block;
            background-color: #1e3a5f;
            color: #ffffff !important;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
        }
        .action-button:hover {
            background-color: #2d5a7b;
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
        .logo {
            max-width: 120px;
            margin-bottom: 15px;
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
            <div class="notification-box">
                <div class="notification-title">{{ $title }}</div>
                <div class="notification-body">{!! nl2br(e($body)) !!}</div>

                @if(!empty($data) && is_array($data))
                <div class="notification-data">
                    @foreach($data as $key => $value)
                        @if(!is_array($value) && !is_object($value))
                        <div class="data-row">
                            <span class="data-label">{{ ucfirst(str_replace('_', ' ', $key)) }}:</span>
                            <span class="data-value">{{ $value }}</span>
                        </div>
                        @endif
                    @endforeach
                </div>
                @endif

                @if($actionUrl)
                <div style="text-align: center;">
                    <a href="{{ $actionUrl }}" class="action-button">{{ $actionText }}</a>
                </div>
                @endif
            </div>

            <p style="color: #666; font-size: 14px; margin-top: 30px;">
                هذا البريد الإلكتروني تم إرساله تلقائياً من نظام وزارة الاقتصاد والصناعة. يرجى عدم الرد على هذا البريد.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>
                © {{ date('Y') }} وزارة الاقتصاد والصناعة - الجمهورية العربية السورية<br>
                <a href="{{ config('app.url') }}">زيارة الموقع الرسمي</a>
            </p>
        </div>
    </div>
</body>
</html>
