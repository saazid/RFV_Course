# Admin Panel - Quick Start Guide

## 🚀 Getting Started

### 1. Start Development Server
```bash
npm run dev
```
Server চালু হবে `http://localhost:3000` এ

### 2. Navigate to Admin Login
```
http://localhost:3000/admin/login
```

### 3. Login with Demo Credentials
```
Email: mdsaifullah77469@gmail.com
Password: rfv_sa_26
```

### 4. Dashboard Features

#### View All Enrollments
- Dashboard open হবে login এর পর
- Table এ সব students দেখা যাবে
- Stats দেখা যাবে top এ

#### View Enrollment Details
```
Each row এ "View" button click করুন
Modal open হবে:
- Full name
- Phone number
- Payment method
- Transaction ID
- IP address
- Submission date & time
- Payment screenshot
```

#### Delete Enrollment
```
Each row এ "Delete" button click করুন
Confirmation dialog দেখা যাবে
"Delete" confirm করুন
Student remove হবে list থেকে
```

#### Export Data
```
Top-right এ "Export CSV" button click করুন
সব data download হবে CSV format এ
```

#### Refresh Data
```
"Refresh" button এর মাধ্যমে manually refresh করতে পারবেন
Auto-refresh হয় না, manual refresh করতে হয়
```

## 📊 Features Checklist

- ✅ **Email & Password Login**: সম্পূর্ণ authentication system
- ✅ **Dashboard**: All enrollments show করে
- ✅ **Real-time Stats**: 
  - Total enrollments count
  - Verified count
  - This month count
  - Last enrollment date
- ✅ **View Details**: Modal এ সম্পূর্ণ details
- ✅ **Delete Enrollments**: Confirmation সহ delete
- ✅ **Export CSV**: সম্পূর্ণ data download
- ✅ **Session Management**: 24-hour session timeout
- ✅ **Security**: Token-based authentication
- ✅ **Responsive Design**: Mobile-friendly layout

## 🔒 Security Features

1. **Protected Routes**: Dashboard middleware দিয়ে protect করা
2. **Token Validation**: প্রতিটি API request এ verify হয়
3. **Session Timeout**: 24 hours পর auto logout
4. **Secure Cookies**: httpOnly flag সেট করা
5. **Token Revocation**: Logout এ token revoke হয়

## 📝 API Testing

### Login
```bash
curl -X POST http://localhost:3000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"mdsaifullah77469@gmail.com","password":"rfv_sa_26"}'
```

### Get Enrollments (with token from login response)
```bash
curl -X GET http://localhost:3000/api/admin/submissions \
  -H "x-admin-token: <token>"
```

### Delete Enrollment
```bash
curl -X POST http://localhost:3000/api/admin/delete \
  -H "Content-Type: application/json" \
  -H "x-admin-token: <token>" \
  -d '{"submissionId":"dedac90cc5d180f9"}'
```

## 🧪 Testing Scenarios

### Scenario 1: New User Login
1. `/admin/login` যান
2. Demo credentials দিন
3. Login button click করুন
4. Dashboard এ redirect হবেন

### Scenario 2: View Enrollment Details
1. Dashboard এ যান
2. যেকোনো enrollment এ "View" click করুন
3. Modal open হবে সব details সহ
4. "Close" button দিয়ে modal close করুন

### Scenario 3: Delete Enrollment
1. Dashboard এ যান
2. যেকোনো enrollment এ "Delete" click করুন
3. Confirmation dialog আসবে
4. "Delete" confirm করুন
5. Student remove হবে list থেকে

### Scenario 4: Export Data
1. Dashboard এ যান
2. "Export CSV" button click করুন
3. CSV file download হবে
4. File open করে verify করুন

### Scenario 5: Session Timeout
1. Login করুন
2. 24+ hours wait করুন (or manually set timestamp)
3. Page refresh করুন
4. Auto-redirect হবে login page এ

### Scenario 6: Logout & Security
1. Dashboard এ যান
2. "Logout" button click করুন
3. Login page এ যাবেন
4. Cookies clear এ যাবে
5. Direct dashboard access করলে login page এ redirect হবেন

## 🛠️ Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables (if needed)
```env
NODE_ENV=production
```

### Database Integration (Future)
Current: JSONL file based
Future: Can integrate with MongoDB/PostgreSQL

## 📞 Support

Any issues? Check:
1. Developer console (F12) for errors
2. Network tab for API failures
3. Console logs for detailed error messages
4. Verify credentials are correct

## 📚 Related Files

- `/lib/adminAuth.ts` - Auth functions
- `/app/api/admin/*` - API endpoints
- `/app/admin/*` - UI pages
- `/middleware.ts` - Route protection
- `/ADMIN_PANEL_GUIDE.md` - Detailed documentation

---

Happy admin panel usage! 🎉
