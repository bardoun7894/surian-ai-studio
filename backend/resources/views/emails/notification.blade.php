<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title }}</title>
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
        .notification-box {
            background: linear-gradient(135deg, #f8f7f3 0%, #edebe0 100%);
            border-right: 4px solid #094239;
            padding: 24px;
            margin: 20px 0;
            border-radius: 8px;
        }
        .notification-title {
            font-size: 20px;
            font-weight: bold;
            color: #094239;
            margin-bottom: 12px;
        }
        .gold-divider {
            width: 60px;
            height: 3px;
            background: linear-gradient(90deg, #b9a779, #d4af37);
            margin: 0 0 16px 0;
            border-radius: 2px;
        }
        .notification-body {
            font-size: 15px;
            line-height: 1.7;
            color: #3d3a3b;
            margin-bottom: 20px;
        }
        .notification-data {
            background-color: #ffffff;
            border: 1px solid #edebe0;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
        }
        .data-row {
            padding: 10px 0;
            border-bottom: 1px solid #f4f3ef;
        }
        .data-row:last-child {
            border-bottom: none;
        }
        .data-label {
            font-weight: bold;
            color: #094239;
            display: inline-block;
            min-width: 150px;
        }
        .data-value {
            color: #3d3a3b;
        }
        .action-button {
            display: inline-block;
            background: linear-gradient(135deg, #094239 0%, #0d5c50 100%);
            color: #ffffff !important;
            padding: 14px 36px;
            text-decoration: none;
            border-radius: 10px;
            font-weight: bold;
            margin: 20px 0;
            text-align: center;
            box-shadow: 0 4px 12px rgba(9, 66, 57, 0.25);
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
            <div class="notification-box">
                <div class="notification-title">{{ $title }}</div>
                <div class="gold-divider"></div>
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

            <p style="color: #3d3a3b; font-size: 13px; margin-top: 24px;">
                هذا البريد الإلكتروني تم إرساله تلقائياً من نظام وزارة الاقتصاد والصناعة. يرجى عدم الرد على هذا البريد.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div style="width: 40px; height: 2px; background: #b9a779; margin: 0 auto 12px;"></div>
            <p style="margin: 0;">
                &copy; {{ date('Y') }} وزارة الاقتصاد والصناعة - الجمهورية العربية السورية<br>
                <a href="{{ config('app.frontend_url', config('app.url')) }}">زيارة الموقع الرسمي</a>
            </p>
        </div>
    </div>
</body>
</html>
