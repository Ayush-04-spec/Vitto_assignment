# Vitto API Testing Guide

Base URL: `http://localhost:3001`

## Prerequisites
Start the backend server:
```bash
cd backend
npm run dev
```

---

## ENDPOINT 1: Create Application
**POST** `/api/applications`

### Test Case 1: Valid Application
```bash
curl -X POST http://localhost:3001/api/applications \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Rajesh Kumar\",\"mobile\":\"9876543210\",\"amount\":100000,\"purpose\":\"Home Renovation\",\"language\":\"Hindi\"}"
```

**Expected Response (201):**
```json
{
  "id": "uuid-here",
  "name": "Rajesh Kumar",
  "mobile": "9876543210",
  "amount": "100000.00",
  "purpose": "Home Renovation",
  "language": "Hindi",
  "status": "pending",
  "created_at": "2026-05-30T10:00:00.000Z"
}
```

### Test Case 2: Invalid Mobile Number
```bash
curl -X POST http://localhost:3001/api/applications \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"mobile\":\"1234567890\",\"amount\":50000,\"purpose\":\"Business\",\"language\":\"English\"}"
```

**Expected Response (400):**
```json
{
  "error": "Mobile is required and must be a valid Indian mobile number (10 digits starting with 6-9)"
}
```

### Test Case 3: Invalid Language
```bash
curl -X POST http://localhost:3001/api/applications \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"mobile\":\"9876543210\",\"amount\":50000,\"purpose\":\"Business\",\"language\":\"French\"}"
```

**Expected Response (400):**
```json
{
  "error": "Language is required and must be one of: Hindi, Tamil, Telugu, Marathi, English"
}
```

### Test Case 4: Missing Required Field
```bash
curl -X POST http://localhost:3001/api/applications \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"mobile\":\"9876543210\",\"amount\":50000,\"language\":\"Hindi\"}"
```

**Expected Response (400):**
```json
{
  "error": "Purpose is required and must be a non-empty string"
}
```

### Test Case 5: Negative Amount
```bash
curl -X POST http://localhost:3001/api/applications \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"mobile\":\"9876543210\",\"amount\":-5000,\"purpose\":\"Business\",\"language\":\"Hindi\"}"
```

**Expected Response (400):**
```json
{
  "error": "Amount is required and must be a positive number"
}
```

---

## ENDPOINT 2: Get All Applications
**GET** `/api/applications`

### Test Case 1: Get All Applications
```bash
curl http://localhost:3001/api/applications
```

**Expected Response (200):**
```json
[
  {
    "id": "uuid-1",
    "name": "Rajesh Kumar",
    "mobile": "9876543210",
    "amount": "100000.00",
    "purpose": "Home Renovation",
    "language": "Hindi",
    "status": "pending",
    "created_at": "2026-05-30T10:00:00.000Z"
  },
  ...
]
```

### Test Case 2: Filter by Status (Pending)
```bash
curl "http://localhost:3001/api/applications?status=pending"
```

**Expected Response (200):** Array of pending applications only

### Test Case 3: Filter by Status (Approved)
```bash
curl "http://localhost:3001/api/applications?status=approved"
```

**Expected Response (200):** Array of approved applications only

### Test Case 4: Filter by Status (Rejected)
```bash
curl "http://localhost:3001/api/applications?status=rejected"
```

**Expected Response (200):** Array of rejected applications only

### Test Case 5: Invalid Status Filter
```bash
curl "http://localhost:3001/api/applications?status=invalid"
```

**Expected Response (400):**
```json
{
  "error": "Invalid status. Must be one of: pending, approved, rejected"
}
```

---

## ENDPOINT 3: Update Application Status
**PATCH** `/api/applications/:id/status`

### Test Case 1: Approve Application
First, get an application ID from the GET endpoint, then:
```bash
curl -X PATCH http://localhost:3001/api/applications/YOUR_UUID_HERE/status \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"approved\"}"
```

**Expected Response (200):**
```json
{
  "id": "uuid-here",
  "name": "Rajesh Kumar",
  "mobile": "9876543210",
  "amount": "100000.00",
  "purpose": "Home Renovation",
  "language": "Hindi",
  "status": "approved",
  "created_at": "2026-05-30T10:00:00.000Z"
}
```

### Test Case 2: Reject Application
```bash
curl -X PATCH http://localhost:3001/api/applications/YOUR_UUID_HERE/status \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"rejected\"}"
```

**Expected Response (200):** Updated application with status "rejected"

### Test Case 3: Invalid Status
```bash
curl -X PATCH http://localhost:3001/api/applications/YOUR_UUID_HERE/status \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"pending\"}"
```

**Expected Response (400):**
```json
{
  "error": "Status must be one of: approved, rejected"
}
```

### Test Case 4: Invalid UUID Format
```bash
curl -X PATCH http://localhost:3001/api/applications/invalid-id/status \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"approved\"}"
```

**Expected Response (400):**
```json
{
  "error": "Invalid application ID format"
}
```

### Test Case 5: Application Not Found
```bash
curl -X PATCH http://localhost:3001/api/applications/00000000-0000-0000-0000-000000000000/status \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"approved\"}"
```

**Expected Response (404):**
```json
{
  "error": "Application not found"
}
```

---

## ENDPOINT 4: Get Summary Statistics
**GET** `/api/summary`

### Test Case 1: Get Summary
```bash
curl http://localhost:3001/api/summary
```

**Expected Response (200):**
```json
{
  "total": 5,
  "totalAmount": 350000,
  "byStatus": {
    "pending": 2,
    "approved": 2,
    "rejected": 1
  }
}
```

---

## Complete Test Flow

Here's a complete test sequence to verify all functionality:

```bash
# 1. Check server health
curl http://localhost:3001/

# 2. Create multiple applications
curl -X POST http://localhost:3001/api/applications \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Priya Sharma\",\"mobile\":\"9123456789\",\"amount\":75000,\"purpose\":\"Education\",\"language\":\"English\"}"

curl -X POST http://localhost:3001/api/applications \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Amit Patel\",\"mobile\":\"8765432109\",\"amount\":150000,\"purpose\":\"Business Expansion\",\"language\":\"Marathi\"}"

curl -X POST http://localhost:3001/api/applications \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Lakshmi Reddy\",\"mobile\":\"7890123456\",\"amount\":200000,\"purpose\":\"Medical Emergency\",\"language\":\"Telugu\"}"

# 3. Get all applications
curl http://localhost:3001/api/applications

# 4. Get the first application ID from the response above, then approve it
curl -X PATCH http://localhost:3001/api/applications/FIRST_UUID_HERE/status \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"approved\"}"

# 5. Get the second application ID, then reject it
curl -X PATCH http://localhost:3001/api/applications/SECOND_UUID_HERE/status \
  -H "Content-Type: application/json" \
  -d "{\"status\":\"rejected\"}"

# 6. Get pending applications only
curl "http://localhost:3001/api/applications?status=pending"

# 7. Get summary statistics
curl http://localhost:3001/api/summary
```

---

## Windows PowerShell Alternative

If you're using PowerShell on Windows, use `Invoke-RestMethod`:

### Create Application
```powershell
$body = @{
    name = "Rajesh Kumar"
    mobile = "9876543210"
    amount = 100000
    purpose = "Home Renovation"
    language = "Hindi"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/applications" -Method Post -Body $body -ContentType "application/json"
```

### Get All Applications
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/applications" -Method Get
```

### Update Status
```powershell
$body = @{
    status = "approved"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/applications/YOUR_UUID_HERE/status" -Method Patch -Body $body -ContentType "application/json"
```

### Get Summary
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/summary" -Method Get
```
