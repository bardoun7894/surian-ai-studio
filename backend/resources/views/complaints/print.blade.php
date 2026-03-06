<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>شكوى رقم {{ $complaint->tracking_number }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            direction: rtl;
            font-size: 12pt;
            line-height: 1.6;
            color: #333;
            padding: 20px;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #094239;
            padding-bottom: 20px;
        }

        .header h1 {
            color: #094239;
            font-size: 24pt;
            margin-bottom: 10px;
        }

        .header p {
            color: #428177;
            font-size: 14pt;
        }

        .tracking-number {
            background-color: #edebe0;
            padding: 15px;
            text-align: center;
            margin-bottom: 20px;
            border-radius: 5px;
            border: 2px solid #b9a779;
        }

        .tracking-number strong {
            color: #094239;
            font-size: 18pt;
        }

        .section {
            margin-bottom: 20px;
        }

        .section-title {
            background-color: #094239;
            color: white;
            padding: 10px;
            margin-bottom: 10px;
            font-size: 14pt;
            font-weight: bold;
        }

        .field {
            padding: 10px;
            margin-bottom: 10px;
            border-bottom: 1px solid #edebe0;
        }

        .field-label {
            font-weight: bold;
            color: #094239;
            display: inline-block;
            width: 150px;
        }

        .field-value {
            display: inline-block;
        }

        .description {
            background-color: #f9f9f9;
            padding: 15px;
            border-right: 4px solid #428177;
            margin-top: 10px;
            white-space: pre-wrap;
        }

        .status-badge {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 10pt;
        }

        .status-new {
            background-color: #e3f2fd;
            color: #1976d2;
        }

        .status-under_review {
            background-color: #fff3e0;
            color: #f57c00;
        }

        .status-in_progress {
            background-color: #f3e5f5;
            color: #7b1fa2;
        }

        .status-resolved {
            background-color: #e8f5e9;
            color: #388e3c;
        }

        .status-closed {
            background-color: #e0e0e0;
            color: #616161;
        }

        .priority-high, .priority-urgent {
            color: #d32f2f;
            font-weight: bold;
        }

        .priority-medium {
            color: #f57c00;
        }

        .priority-low {
            color: #388e3c;
        }

        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 10pt;
            color: #666;
            border-top: 2px solid #edebe0;
            padding-top: 15px;
        }

        .timestamp {
            text-align: left;
            font-size: 9pt;
            color: #999;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>وزارة الاقتصاد والصناعة</h1>
        <p>الجمهورية العربية السورية</p>
    </div>

    <div class="tracking-number">
        <strong>رقم التتبع: {{ $complaint->tracking_number }}</strong>
    </div>

    <div class="section">
        <div class="section-title">معلومات الشكوى</div>

        <div class="field">
            <span class="field-label">الحالة:</span>
            <span class="field-value status-badge status-{{ $complaint->status }}">
                {{ ucfirst(str_replace('_', ' ', $complaint->status)) }}
            </span>
        </div>

        <div class="field">
            <span class="field-label">الأولوية:</span>
            <span class="field-value priority-{{ $complaint->priority }}">
                {{ ucfirst($complaint->priority) }}
            </span>
        </div>

        @if($complaint->directorate)
        <div class="field">
            <span class="field-label">المديرية المختصة:</span>
            <span class="field-value">{{ $complaint->directorate->name_ar }}</span>
        </div>
        @endif

        <div class="field">
            <span class="field-label">تاريخ التقديم:</span>
            <span class="field-value">{{ $complaint->created_at->format('Y-m-d H:i') }}</span>
        </div>

        @if($complaint->updated_at != $complaint->created_at)
        <div class="field">
            <span class="field-label">آخر تحديث:</span>
            <span class="field-value">{{ $complaint->updated_at->format('Y-m-d H:i') }}</span>
        </div>
        @endif
    </div>

    @if($complaint->user)
    <div class="section">
        <div class="section-title">معلومات مقدم الشكوى</div>

        <div class="field">
            <span class="field-label">الاسم:</span>
            <span class="field-value">{{ $complaint->user->name }}</span>
        </div>

        <div class="field">
            <span class="field-label">البريد الإلكتروني:</span>
            <span class="field-value">{{ $complaint->user->email }}</span>
        </div>

        @if($complaint->user->phone)
        <div class="field">
            <span class="field-label">الهاتف:</span>
            <span class="field-value">{{ $complaint->user->phone }}</span>
        </div>
        @endif
    </div>
    @endif

    <div class="section">
        <div class="section-title">تفاصيل الشكوى</div>

        @if($complaint->subject)
        <div class="field">
            <span class="field-label">الموضوع:</span>
            <span class="field-value">{{ $complaint->subject }}</span>
        </div>
        @endif

        <div class="description">
            {{ $complaint->description }}
        </div>
    </div>

    @if($complaint->ai_summary)
    <div class="section">
        <div class="section-title">الملخص (تم إنشاؤه تلقائياً)</div>
        <div class="description">
            {{ $complaint->ai_summary }}
        </div>
    </div>
    @endif

    @if($complaint->response)
    <div class="section">
        <div class="section-title">الرد الرسمي</div>
        <div class="description">
            {{ $complaint->response }}
        </div>

        @if($complaint->responded_at)
        <div class="field">
            <span class="field-label">تاريخ الرد:</span>
            <span class="field-value">{{ $complaint->responded_at->format('Y-m-d H:i') }}</span>
        </div>
        @endif

        @if($complaint->responded_by)
        <div class="field">
            <span class="field-label">الموظف المسؤول:</span>
            <span class="field-value">{{ $complaint->respondedBy->name }}</span>
        </div>
        @endif
    </div>
    @endif

    <div class="footer">
        <p>هذه الوثيقة تم إنشاؤها آلياً من نظام الشكاوى الإلكتروني</p>
        <p>وزارة الاقتصاد والصناعة - الجمهورية العربية السورية</p>
    </div>

    <div class="timestamp">
        تاريخ الطباعة: {{ now()->format('Y-m-d H:i:s') }}
    </div>
</body>
</html>
