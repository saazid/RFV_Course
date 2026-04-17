# Admin Panel - Complete Documentation

## Overview
সম্পূর্ণ ফাংশনাল admin panel "Right Form of Verbs" course enrollment management এর জন্য।

## Features

### ✅ Authentication
- **Email & Password Login**: নিরাপদ admin credential verification
- **Token-based Sessions**: 24-hour session timeout
- **Auto-redirect**: অলগইন না করলে dashboard এ যেতে পারবেন না
- **Logout**: সেশন revoke করে logout করা যায়

### ✅ Dashboard
- **Student Count**: সব সময় মোট enrollment count দেখা যায়
- **Real-time Stats**: 
  - Total Enrollments
  - Verified Enrollments
  - This Month Count
  - Last Enrollment Date

### ✅ Enrollment Management
- **View All Enrollments**: সব students এর list tabular format এ
- **View Details**: প্রতিটি enrollment এর সম্পূর্ণ details modal এ দেখা যায়
  - Full Name
  - Phone Number
  - Payment Method (bKash/Nagad)
  - Transaction ID
  - IP Address
  - Payment Screenshot
  - Submission Date & Time

### ✅ Delete Enrollments
- **Remove Students**: যেকোনো student এর enrollment permanently delete করতে পারবেন
- **Confirmation Dialog**: delete করার আগে confirmation নেওয়া হয়
- **Real-time Update**: delete করলে list থেকে immediately remove হয়ে যায়

### ✅ Export Data
- **CSV Export**: সব enrollment data CSV format এ download করা যায়
- **Formatted Output**: সুন্দর format এ সব data

## Login Credentials

```
Email: mdsaifullah77469@gmail.com
Password: rfv_sa_26
```

## How to Use

### Step 1: Login
1. যান `/admin/login` page এ
2. Email এবং Password দিন
3. Click করুন "Login" button এ

### Step 2: View Dashboard
1. Login successful হলে dashboard এ চলে যাবে
2. Stats দেখুন top এ (total enrollments, verified, etc.)
3. সব enrollments এর list দেখুন table এ

### Step 3: Manage Enrollments

#### View Details
1. যেকোনো enrollment এর "View" button click করুন
2. Modal open হবে full details সহ
3. Payment screenshot ও দেখা যাবে

#### Delete Enrollment
1. "Delete" button click করুন (red button)
2. Confirmation dialog আসবে
3. "Delete" confirm করুন
4. Student remove হয়ে যাবে list থেকে

#### Export Data
1. Dashboard এর top-right এ "Export CSV" button click করুন
2. সব data CSV file এ download হবে

### Step 4: Logout
1. Top-right corner এ "Logout" button click করুন
2. Token revoke হবে এবং login page এ যাবে

## API Endpoints

### Admin Login
```
POST /api/admin/login
Body: { email: string, password: string }
Response: { ok: boolean, message: string }
```

### Get All Submissions
```
GET /api/admin/submissions
Headers: { x-admin-token: string }
Response: { ok: boolean, submissions: Submission[] }
```

### Delete Submission
```
POST /api/admin/delete
Headers: { x-admin-token: string }
Body: { submissionId: string }
Response: { ok: boolean, message: string }
```

### Logout
```
POST /api/admin/logout
Headers: { x-admin-token: string }
Response: { ok: boolean, message: string }
```

## Security Features

1. **Token Validation**: প্রতিটি API request এ token verify করা হয়
2. **Session Timeout**: 24 hours পর token expire হয়
3. **Cookie Security**: httpOnly দিয়ে token store করা
4. **Middleware Protection**: Dashboard access এর জন্য middleware auth check করে

## File Structure

```
app/
  admin/
    login/
      page.tsx          # Login page
    dashboard/
      page.tsx          # Admin dashboard (protected)
  api/
    admin/
      login/
        route.ts        # Login endpoint
      submissions/
        route.ts        # Get all submissions
      delete/
        route.ts        # Delete submission endpoint
      logout/
        route.ts        # Logout endpoint

lib/
  adminAuth.ts          # Auth functions & token management

middleware.ts           # Route protection middleware
```

## Demo Data

যদি কোনো real submissions না থাকে, demo data show হবে এতে:
- আহমেদ রহমান
- ফাতিমা আক্তার  
- সালমান হোসেন
- নাজমা বেগম

## Troubleshooting

### Login না হচ্ছে?
- Email এবং password check করুন
- Invalid credentials error পেলে, সঠিক credential ব্যবহার করুন

### Dashboard access না পাচ্ছেন?
- Browser cookies enable করুন
- Token expire হয়েছে? Re-login করুন

### Data delete না হচ্ছে?
- Admin token valid আছে কিনা check করুন
- Network error থাকলে, again try করুন

## Future Enhancements

- [ ] Multiple admin accounts
- [ ] Role-based access control
- [ ] Audit logs
- [ ] Email verification
- [ ] Advanced search & filtering
- [ ] Batch operations
- [ ] Payment verification system

---

**Last Updated**: April 17, 2026
