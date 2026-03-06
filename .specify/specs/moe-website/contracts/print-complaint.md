# API Contract: Print Complaint (FR-28)

## Existing Endpoint

### GET /api/v1/complaints/{trackingNumber}/pdf

**Status**: Already implemented in `ComplaintController::printPdf()`

**Purpose**: Generate and download PDF of complaint details

**Authentication**: Public access (verified via tracking + national_id)

#### Request

```
GET /api/v1/complaints/GOV-123456/pdf
Accept: application/pdf
```

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| trackingNumber | string | Yes | Complaint tracking number (e.g., "GOV-123456") |

#### Response

**Success (200)**:
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="complaint_GOV-123456.pdf"

[Binary PDF data]
```

**Not Found (404)**:
```json
{
  "message": "Complaint not found"
}
```

## Frontend Component Contract

### ComplaintPrintButton

```typescript
interface ComplaintPrintButtonProps {
  trackingNumber: string;
  className?: string;
}

// Usage
<ComplaintPrintButton trackingNumber="GOV-123456" />
```

**Behavior**:
1. Shows "طباعة / Print" button with printer icon
2. On click: Shows loading state
3. Fetches PDF from API
4. Creates blob URL and triggers download
5. Shows success/error toast

**States**:
- `idle`: Button enabled, ready to click
- `loading`: Button shows spinner, disabled
- `error`: Toast shown, button re-enabled

## Integration Points

### ComplaintPortal.tsx

Add after tracking result display (line ~662):
```tsx
{trackingResult && (
  <div className="mt-4 flex justify-center">
    <ComplaintPrintButton trackingNumber={trackingResult.tracking_number} />
  </div>
)}
```

### Filament ComplaintResource

Add print action to table and view page:
```php
Tables\Actions\Action::make('print')
    ->label('طباعة')
    ->icon('heroicon-o-printer')
    ->url(fn ($record) => "/api/v1/complaints/{$record->tracking_number}/pdf")
    ->openUrlInNewTab();
```
