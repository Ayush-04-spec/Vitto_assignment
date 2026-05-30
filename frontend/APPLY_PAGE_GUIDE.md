# Apply Page - User Guide

## Overview
The Apply page (`/`) allows borrowers to submit loan applications through a clean, user-friendly form.

## Features

### Form Fields
All fields are required:

1. **Applicant Name**
   - Text input
   - Must be non-empty

2. **Mobile Number**
   - 10-digit Indian mobile number
   - Must start with 6, 7, 8, or 9
   - Example: 9876543210

3. **Loan Amount (₹)**
   - Minimum: ₹1,000
   - Number input with step of 1,000

4. **Loan Purpose**
   - Textarea for detailed description
   - Examples: "Home Renovation", "Business Expansion", "Education"

5. **Preferred Language**
   - Dropdown selection
   - Options: Hindi, Tamil, Telugu, Marathi, English

### Validation

#### Client-Side Validation
- All fields are validated before submission
- Inline error messages appear below each field
- Errors clear when user starts typing
- Mobile number format: `/^[6-9]\d{9}$/`
- Amount must be ≥ ₹1,000

#### Server-Side Validation
- API validates all inputs
- Returns clear error messages if validation fails

### User Flow

#### 1. Form Submission
- User fills out all required fields
- Clicks "Submit Application"
- Button shows "Submitting..." and is disabled during submission

#### 2. Success State
On successful submission (201 response):
- Form is cleared
- Success screen displays:
  - ✓ Green checkmark icon
  - "Application submitted successfully!" message
  - Reference number (UUID) in a monospace box
  - "Submit another application" button

#### 3. Error Handling
If submission fails:
- Error message displays above the submit button
- Form remains filled so user can correct and resubmit
- Common errors:
  - Network issues
  - Server validation failures
  - API unavailable

### Styling

#### Desktop View
- Centered form with max-width of 600px
- Clean white card with subtle shadow
- Comfortable spacing between fields
- Full-width submit button

#### Mobile View
- Single column layout
- Responsive padding
- Touch-friendly input sizes (16px font to prevent iOS zoom)
- Full-width submit button
- Optimized for small screens (480px and below)

## Testing the Apply Page

### Prerequisites
1. Backend server running on `http://localhost:3001`
2. Frontend server running on `http://localhost:5173`

### Test Cases

#### Test 1: Valid Submission
1. Navigate to `http://localhost:5173/`
2. Fill in:
   - Name: "Rajesh Kumar"
   - Mobile: "9876543210"
   - Amount: "100000"
   - Purpose: "Home Renovation"
   - Language: "Hindi"
3. Click "Submit Application"
4. **Expected**: Success screen with reference number

#### Test 2: Invalid Mobile Number
1. Fill in all fields
2. Enter mobile: "1234567890" (starts with 1)
3. Try to submit
4. **Expected**: Error message "Mobile must be a 10-digit number starting with 6-9"

#### Test 3: Amount Too Low
1. Fill in all fields
2. Enter amount: "500"
3. Try to submit
4. **Expected**: Error message "Loan amount must be at least ₹1,000"

#### Test 4: Empty Fields
1. Leave all fields empty
2. Click "Submit Application"
3. **Expected**: Error messages under each field

#### Test 5: Submit Another Application
1. Successfully submit an application
2. Click "Submit another application"
3. **Expected**: Return to empty form

#### Test 6: Network Error
1. Stop the backend server
2. Try to submit an application
3. **Expected**: Error message about connection failure

### Manual Testing Checklist

- [ ] All fields are required
- [ ] Mobile validation works (must start with 6-9)
- [ ] Amount validation works (minimum ₹1,000)
- [ ] Language dropdown has all 5 options
- [ ] Submit button disables during submission
- [ ] Success screen shows reference number
- [ ] "Submit another" button resets form
- [ ] Error messages display correctly
- [ ] Form is responsive on mobile
- [ ] Inputs don't zoom on iOS (16px font size)

## Environment Configuration

The API URL is configured via environment variable:

**`.env`**
```
VITE_API_URL=http://localhost:3001
```

For production, update this to your production API URL.

## Component Structure

```
Apply.jsx
├── State Management
│   ├── formData (name, mobile, amount, purpose, language)
│   ├── errors (field-level validation errors)
│   ├── isSubmitting (loading state)
│   ├── submitError (API error message)
│   └── successData (successful submission data)
├── Validation
│   ├── validateField() - Single field validation
│   └── validateForm() - Full form validation
├── Event Handlers
│   ├── handleChange() - Input change handler
│   ├── handleSubmit() - Form submission
│   └── handleSubmitAnother() - Reset to form
└── Render
    ├── Success Screen (when successData exists)
    └── Form (default view)
```

## Accessibility Features

- Proper label associations with `htmlFor`
- Required field indicators (*)
- Error messages linked to inputs
- Semantic HTML elements
- Focus states on inputs
- Keyboard navigation support

## Browser Compatibility

Tested and working on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

Potential improvements:
- [ ] Add file upload for documents
- [ ] Multi-step form wizard
- [ ] Save draft functionality
- [ ] Email confirmation
- [ ] SMS verification
- [ ] Progress indicator
- [ ] Field auto-save
- [ ] Accessibility audit (WCAG 2.1 AA)
