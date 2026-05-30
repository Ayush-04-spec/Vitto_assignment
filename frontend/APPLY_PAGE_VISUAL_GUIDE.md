# Apply Page - Visual Guide

## Page Layout

### Header Section
```
┌─────────────────────────────────────────┐
│                                         │
│         Apply for a Loan                │
│   Fill out the form below to submit    │
│       your loan application             │
│                                         │
└─────────────────────────────────────────┘
```

### Form Section (Empty State)
```
┌─────────────────────────────────────────┐
│  Applicant Name *                       │
│  ┌───────────────────────────────────┐  │
│  │ Enter your full name              │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Mobile Number *                        │
│  ┌───────────────────────────────────┐  │
│  │ 10-digit number starting with 6-9 │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Loan Amount (₹) *                      │
│  ┌───────────────────────────────────┐  │
│  │ Minimum ₹1,000                    │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Loan Purpose *                         │
│  ┌───────────────────────────────────┐  │
│  │ Describe the purpose of your loan│  │
│  │                                   │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Preferred Language *                   │
│  ┌───────────────────────────────────┐  │
│  │ Select a language            ▼    │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │     Submit Application            │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Form Section (With Validation Errors)
```
┌─────────────────────────────────────────┐
│  Applicant Name *                       │
│  ┌───────────────────────────────────┐  │
│  │                                   │  │ (red border)
│  └───────────────────────────────────┘  │
│  ⚠ Name is required                     │ (red text)
│                                         │
│  Mobile Number *                        │
│  ┌───────────────────────────────────┐  │
│  │ 1234567890                        │  │ (red border)
│  └───────────────────────────────────┘  │
│  ⚠ Mobile must be a 10-digit number     │ (red text)
│    starting with 6-9                    │
│                                         │
│  Loan Amount (₹) *                      │
│  ┌───────────────────────────────────┐  │
│  │ 500                               │  │ (red border)
│  └───────────────────────────────────┘  │
│  ⚠ Loan amount must be at least ₹1,000  │ (red text)
│                                         │
│  ...                                    │
└─────────────────────────────────────────┘
```

### Form Section (Submitting State)
```
┌─────────────────────────────────────────┐
│  [All fields filled in]                 │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │     Submitting...                 │  │ (disabled, gray)
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Success Screen
```
┌─────────────────────────────────────────┐
│                                         │
│              ┌─────┐                    │
│              │  ✓  │                    │ (green circle)
│              └─────┘                    │
│                                         │
│   Application submitted successfully!   │ (green text)
│                                         │
│   Your loan application has been        │
│   received and is being processed.      │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ Your reference number:            │  │ (gray box)
│  │                                   │  │
│  │  6b001953-3ff7-4449-9a11-...     │  │ (monospace, blue)
│  │                                   │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │  Submit another application       │  │ (blue button)
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### Error State (API Error)
```
┌─────────────────────────────────────────┐
│  [All fields filled in]                 │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │ ⚠ Failed to submit application.   │  │ (red background)
│  │   Please try again later.         │  │
│  └───────────────────────────────────┘  │
│                                         │
│  ┌───────────────────────────────────┐  │
│  │     Submit Application            │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Color Scheme

### Primary Colors
- **Primary Blue**: `#4a90e2` - Submit button, links, reference number
- **Success Green**: `#27ae60` - Success icon, success title
- **Error Red**: `#e74c3c` - Error messages, error borders
- **Text Dark**: `#1a1a1a` - Headings
- **Text Medium**: `#333` - Labels
- **Text Light**: `#666` - Helper text

### Background Colors
- **White**: `#fff` - Form background, input backgrounds
- **Light Gray**: `#f8f9fa` - Reference number section
- **Border Gray**: `#e0e0e0` - Input borders

### Interactive States
- **Hover**: Darker shade of primary color
- **Focus**: Blue border (`#4a90e2`)
- **Disabled**: Gray (`#b0b0b0`)
- **Error**: Red border (`#e74c3c`)

## Typography

### Font Sizes
- **Page Title (h1)**: 2rem (32px) desktop, 1.5rem (24px) mobile
- **Success Title (h2)**: 1.75rem (28px) desktop, 1.5rem (24px) mobile
- **Body Text**: 1rem (16px)
- **Labels**: 0.95rem (15.2px)
- **Error Messages**: 0.875rem (14px)
- **Reference Number**: 1rem (16px) monospace

### Font Weights
- **Headings**: 600 (semi-bold)
- **Labels**: 600 (semi-bold)
- **Buttons**: 600 (semi-bold)
- **Body**: 400 (normal)

## Spacing

### Form Layout
- **Container Padding**: 2rem (32px) desktop, 1rem (16px) mobile
- **Form Padding**: 2rem (32px) desktop, 1.5rem (24px) mobile
- **Field Margin**: 1.5rem (24px) between fields
- **Label Margin**: 0.5rem (8px) below label
- **Error Margin**: 0.25rem (4px) above error message

### Input Sizing
- **Input Padding**: 0.75rem (12px)
- **Border Width**: 2px
- **Border Radius**: 6px
- **Button Padding**: 0.875rem × 1.5rem (14px × 24px)

## Responsive Breakpoints

### Desktop (> 768px)
- Max form width: 600px
- Centered layout
- Comfortable spacing

### Tablet (481px - 768px)
- Full width with side padding
- Slightly reduced spacing

### Mobile (≤ 480px)
- Full width
- Minimal padding
- 16px font size (prevents iOS zoom)
- Smaller icons and titles

## Accessibility

### ARIA Labels
- All inputs have associated labels
- Error messages are announced
- Required fields marked with asterisk

### Keyboard Navigation
- Tab through all form fields
- Enter to submit form
- Focus visible on all interactive elements

### Color Contrast
- All text meets WCAG AA standards
- Error messages have sufficient contrast
- Focus indicators are clearly visible

## Animation & Transitions

### Smooth Transitions
- Border color: 0.2s
- Button hover: 0.2s
- Button transform on hover: translateY(-1px)

### Loading State
- Button text changes to "Submitting..."
- Button becomes disabled and grayed out
- No spinner needed (text change is sufficient)

## Mobile Optimizations

### Touch Targets
- Minimum 44px × 44px for all interactive elements
- Full-width buttons on mobile
- Adequate spacing between fields

### Input Behavior
- 16px font size prevents iOS zoom
- Appropriate input types (tel for mobile, number for amount)
- maxLength on mobile input (10 digits)

### Layout
- Single column on all screen sizes
- No horizontal scrolling
- Comfortable thumb-reach zones
