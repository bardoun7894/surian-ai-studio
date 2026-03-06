# API Documentation (Phase 16 Updates)

## Settings & Configuration

### Get UI Settings
**Endpoint**: `GET /api/v1/public/settings/ui`
**Access**: Public
**Description**: Retrieve configuration settings for the frontend UI.
**Response**:
```json
{
  "settings": {
    "announcements_homepage_count": 9,
    "featured_directorates_count": 3,
    "suggestions_enabled": true
  }
}
```

## Suggestions Portal

### Submit Suggestion
**Endpoint**: `POST /api/v1/suggestions`
**Access**: Public
**Description**: Submit a new suggestion or complaint.
**Parameters**:
- `name` (required, string)
- `description` (required, string, min: 10)
- `job_title` (optional, string)
- `email` (optional, email)
- `phone` (optional, string)
- `files` (optional, array of files, max 5, max 10MB each)
**Response**:
```json
{
  "success": true,
  "message": "Suggestion submitted successfully",
  "data": {
    "tracking_number": "SUG-20240122-123456",
    "status": "pending"
  }
}
```

## Directorates

### Get Featured Directorates
**Endpoint**: `GET /api/v1/public/directorates/featured`
**Access**: Public
**Description**: Get list of featured directorates for homepage display.
**Response**:
```json
[
  {
    "id": "1",
    "name": "Directorate Name",
    "icon": "Building",
    "featured": true,
    "subDirectorates": [...]
  }
]
```

## Complaints

### Track Complaint
**Endpoint**: `GET /api/v1/complaints/track/{trackingNumber}`
**Access**: Public
**Description**: Track the status of a complaint by its tracking number.
**Response**:
```json
{
  "id": "1",
  "tracking_number": "CMP-123",
  "status": "in_progress",
  "history": [...]
}
```
