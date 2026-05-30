# Vitto API Quick Reference

## Base URL
`http://localhost:3001`

---

## Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications` | Create new loan application |
| GET | `/api/applications` | Get all applications (with optional status filter) |
| PATCH | `/api/applications/:id/status` | Update application status |
| GET | `/api/summary` | Get summary statistics |

---

## 1. Create Application
**POST** `/api/applications`

**Request Body:**
```json
{
  "name": "string (required, non-empty)",
  "mobile": "string (required, 10 digits starting with 6-9)",
  "amount": "number (required, positive)",
  "purpose": "string (required, non-empty)",
  "language": "string (required: Hindi|Tamil|Telugu|Marathi|English)"
}
```

**Success Response (201):**
```json
{
  "id": "uuid",
  "name": "string",
  "mobile": "string",
  "amount": "decimal",
  "purpose": "string",
  "language": "string",
  "status": "pending",
  "created_at": "timestamp"
}
```

**Error Responses:**
- `400` - Validation error
- `500` - Internal server error

---

## 2. Get Applications
**GET** `/api/applications`

**Query Parameters:**
- `status` (optional): `pending` | `approved` | `rejected`

**Success Response (200):**
```json
[
  {
    "id": "uuid",
    "name": "string",
    "mobile": "string",
    "amount": "decimal",
    "purpose": "string",
    "language": "string",
    "status": "string",
    "created_at": "timestamp"
  }
]
```

**Error Responses:**
- `400` - Invalid status parameter
- `500` - Internal server error

---

## 3. Update Status
**PATCH** `/api/applications/:id/status`

**URL Parameters:**
- `id` (required): Valid UUID

**Request Body:**
```json
{
  "status": "approved | rejected"
}
```

**Success Response (200):**
```json
{
  "id": "uuid",
  "name": "string",
  "mobile": "string",
  "amount": "decimal",
  "purpose": "string",
  "language": "string",
  "status": "approved|rejected",
  "created_at": "timestamp"
}
```

**Error Responses:**
- `400` - Invalid UUID format or invalid status
- `404` - Application not found
- `500` - Internal server error

---

## 4. Get Summary
**GET** `/api/summary`

**Success Response (200):**
```json
{
  "total": "number",
  "totalAmount": "number",
  "byStatus": {
    "pending": "number",
    "approved": "number",
    "rejected": "number"
  }
}
```

**Error Responses:**
- `500` - Internal server error

---

## PowerShell Examples

### Create Application
```powershell
$body = @{
    name = "Rajesh Kumar"
    mobile = "9876543210"
    amount = 100000
    purpose = "Home Renovation"
    language = "Hindi"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/applications" `
  -Method Post -Body $body -ContentType "application/json"
```

### Get All Applications
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/applications" -Method Get
```

### Get Pending Applications
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/applications?status=pending" -Method Get
```

### Approve Application
```powershell
$body = @{ status = "approved" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3001/api/applications/YOUR_UUID/status" `
  -Method Patch -Body $body -ContentType "application/json"
```

### Get Summary
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/summary" -Method Get
```

---

## Validation Rules

### Mobile Number
- Must be exactly 10 digits
- Must start with 6, 7, 8, or 9
- Examples: `9876543210`, `8123456789`, `7890123456`

### Language
- Must be one of: `Hindi`, `Tamil`, `Telugu`, `Marathi`, `English`
- Case-sensitive

### Amount
- Must be a positive number
- Stored with 2 decimal places

### Status (for updates)
- Can only be updated to: `approved` or `rejected`
- Cannot be set back to `pending`

### UUID Format
- Must be valid UUID v4 format
- Example: `c8115193-450a-46c7-a37b-2c6c028d2377`

---

## Error Response Format

All errors return JSON:
```json
{
  "error": "Clear error message"
}
```

HTTP Status Codes:
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error
