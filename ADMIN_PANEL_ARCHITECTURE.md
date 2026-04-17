# Admin Panel - Architecture & Features

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                         │
├─────────────────────────────────────────────────────────┤
│
│  /admin/login (Public)
│  ├── Email input
│  ├── Password input
│  ├── Login button
│  └── Error handling
│
│  /admin/dashboard (Protected by Middleware)
│  ├── Authentication Check
│  ├── Dashboard with Stats
│  │   ├── Total Enrollments
│  │   ├── Verified Count
│  │   ├── This Month Count
│  │   └── Last Enrollment Date
│  ├── Enrollments Table
│  │   ├── View Details (Modal)
│  │   └── Delete Button (with Confirmation)
│  ├── Action Buttons
│  │   ├── Refresh
│  │   ├── Export CSV
│  │   └── Logout
│  └── Modals
│      ├── Details Modal
│      └── Delete Confirmation Modal
│
└─────────────────────────────────────────────────────────┘
                         ↓
         ┌───────────────────────────────┐
         │    Next.js API Routes         │
         ├───────────────────────────────┤
         │
         │ POST /api/admin/login
         │ ├── Validate credentials
         │ └── Return token + set cookie
         │
         │ GET /api/admin/submissions
         │ ├── Validate token
         │ ├── Read from JSONL file
         │ └── Return submissions list
         │
         │ POST /api/admin/delete
         │ ├── Validate token
         │ ├── Remove from JSONL
         │ └── Return success/error
         │
         │ POST /api/admin/logout
         │ ├── Revoke token
         │ └── Clear cookie
         │
         └───────────────────────────────┘
                         ↓
         ┌───────────────────────────────┐
         │    Middleware (Protection)    │
         ├───────────────────────────────┤
         │ Check for admin_token cookie  │
         │ Redirect if unauthorized      │
         └───────────────────────────────┘
                         ↓
         ┌───────────────────────────────┐
         │    File System (Backend)      │
         ├───────────────────────────────┤
         │ /data/submissions.jsonl       │
         │ (JSONL format)                │
         └───────────────────────────────┘
```

## Data Flow

### Login Flow
```
User inputs email/password
         ↓
POST /api/admin/login
         ↓
Validate credentials
         ↓
Generate token
         ↓
Set admin_token cookie (httpOnly)
         ↓
Redirect to dashboard
```

### View Enrollments Flow
```
Dashboard loads
         ↓
GET /api/admin/submissions (with token)
         ↓
Validate token in API route
         ↓
Read submissions.jsonl
         ↓
Parse JSONL lines to JSON
         ↓
Return array of submissions
         ↓
Display in table
```

### Delete Enrollment Flow
```
User clicks delete button
         ↓
Show confirmation modal
         ↓
User confirms deletion
         ↓
POST /api/admin/delete (with submission ID)
         ↓
Validate token
         ↓
Read JSONL file
         ↓
Filter out deleted submission
         ↓
Write back to file
         ↓
Remove from table (UI)
```

## Component Structure

```
AdminDashboard
├── Header
│   ├── Title
│   └── Action Buttons
│      ├── Refresh Button
│      ├── Export CSV Button
│      └── Logout Button
├── Stats Section
│   ├── Total Enrollments Card
│   ├── Verified Enrollments Card
│   ├── This Month Card
│   └── Last Enrollment Card
├── Enrollments Table
│   ├── Table Headers
│   ├── Table Rows (map submissions)
│   │   ├── ID
│   │   ├── Name
│   │   ├── Phone
│   │   ├── Payment Method
│   │   ├── Transaction ID
│   │   ├── Submitted Date
│   │   └── Actions
│   │       ├── View Button
│   │       └── Delete Button
│   └── Empty State
├── Details Modal (Overlay)
│   ├── Close Button
│   ├── Details Section
│   │   ├── Name
│   │   ├── Phone
│   │   ├── Payment Method
│   │   ├── Transaction ID
│   │   ├── IP Address
│   │   ├── Submission Date
│   │   └── Screenshot
│   └── Action Buttons
│       ├── Close
│       └── Delete Enrollment
└── Delete Confirmation Modal
    ├── Warning Message
    └── Action Buttons
        ├── Cancel
        └── Delete (Confirm)
```

## State Management

```typescript
// Component State
{
  submissions: Submission[],      // All enrollment data
  loading: boolean,               // Loading state
  error: string,                  // Error messages
  selectedSubmission: Submission | null,  // Modal data
  deleteConfirm: string | null,   // Delete confirmation ID
  deleting: boolean               // Delete in progress
}
```

## Data Model

```typescript
interface Submission {
  id: string;                    // Unique ID
  receivedAt: string;            // ISO timestamp
  fullName: string;              // Student name
  phone: string;                 // Phone number
  paymentMethod: "bkash" | "nagad";  // Payment type
  transactionId: string;         // Transaction reference
  screenshot: {
    filename: string;            // File name
    mimeType: string;            // MIME type
    size: number;                // File size in bytes
    storedPath?: string;         // Optional path to stored file
  };
  ip?: string;                   // IP address
  userAgent?: string;            // Browser info
}
```

## Security Layers

```
Layer 1: Client-side
───────────────────
✓ Check for token before showing dashboard
✓ Validate inputs before sending to API
✓ Clear sensitive data on logout

Layer 2: Middleware
───────────────────
✓ Check admin_token cookie
✓ Redirect unauthorized users
✓ Protect dashboard route

Layer 3: API Routes
───────────────────
✓ Validate token header
✓ Check token expiry (24 hours)
✓ Verify token in active set

Layer 4: File System
───────────────────
✓ Read-only access for GET
✓ Write with validation for POST
✓ No direct file access from client
```

## Error Handling

```
No Login Token
└─ Middleware → Redirect to /admin/login

Invalid Credentials
└─ API → Return 401 error
└─ UI → Show error message

Expired Session
└─ API → Return 401 error
└─ UI → Auto-redirect to login

File Read Error
└─ API → Return 500 error
└─ UI → Show error message

Delete Failure
└─ API → Return 500 error
└─ UI → Show alert

Network Error
└─ Catch block
└─ UI → Display error message
└─ User can retry
```

## Database Schema (JSONL)

```json
{"id":"unique-id-1","receivedAt":"2026-04-17T10:59:44Z","fullName":"Name","phone":"+8801234567890","paymentMethod":"bkash","transactionId":"ABC123","screenshot":{"filename":"file.jpg","mimeType":"image/jpeg","size":57623,"storedPath":"path"},"ip":"127.0.0.1","userAgent":"Mozilla..."}
{"id":"unique-id-2","receivedAt":"2026-04-17T11:00:00Z","fullName":"Name2","phone":"+8801234567891",...}
```

## Session Management

```
Token Lifecycle:
───────────────
1. User logs in
   └─ Token generated: base64(email:timestamp:random)

2. Token stored in cookie
   └─ httpOnly: true (secure)
   └─ secure: production only
   └─ sameSite: strict
   └─ maxAge: 24 hours

3. Each API request
   └─ Token validated
   └─ Expiry checked (< 24 hours)
   └─ Tracked in activeTokens Set

4. User logs out
   └─ Token removed from activeTokens
   └─ Cookie cleared
   └─ Session ended

5. Token expires
   └─ Auto revoked after 24 hours
   └─ User must re-login
```

## Performance Considerations

```
Optimizations:
──────────────
✓ Demo data cached for instant load
✓ Real submissions fetched once on mount
✓ Data filtering done client-side
✓ No infinite loops or unnecessary renders
✓ Modal overlays don't re-render entire page
✓ CSV export done in-browser

Potential Improvements:
──────────────────────
□ Pagination for large datasets
□ Search/filter functionality
□ Caching layer for submissions
□ Database instead of JSONL
□ WebSocket for real-time updates
□ Batch operations
□ Soft deletes (archive instead of remove)
```

## Browser Compatibility

```
Required:
─────────
✓ ES6+ JavaScript support
✓ Fetch API (or polyfill)
✓ Cookies enabled
✓ LocalStorage (for future features)

Tested On:
──────────
✓ Chrome/Edge (latest)
✓ Firefox (latest)
✓ Safari (latest)
✓ Mobile browsers
```

---

**Created**: April 17, 2026
**Version**: 1.0
**Status**: Production Ready
