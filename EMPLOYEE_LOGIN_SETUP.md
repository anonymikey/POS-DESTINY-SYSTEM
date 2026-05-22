# Employee Login Setup Guide

## Overview
The Destiny Supermarket POS system uses Supabase for employee authentication. When an employee logs in via `/employee-login`, their credentials are verified against the Supabase `users` table.

## How Employee Login Works

1. **Employee enters credentials** at `/employee-login`
2. **System queries Supabase** `users` table for matching email
3. **Password verification** compares provided password with bcrypt hash
4. **On success:**
   - User object stored in Auth Context
   - localStorage flag `pos_employee_access` set to `"true"`
   - Redirected to POS dashboard (`/`)
5. **On failure:**
   - Error message displayed
   - User remains on login page

## Setting Up Employees in Supabase

### Option 1: Use Admin Dashboard (Recommended)

1. Navigate to `/admin-login`
2. Login with admin credentials (default: `admin@example.com` / `password123`)
3. Go to **Admin Panel → Employees**
4. Click **Create Employee**
5. Fill in:
   - Full Name
   - Email Address
   - Password (will be bcrypt hashed automatically)
6. Click **Create Employee**

The employee can now login using their email and password.

### Option 2: Direct Database Entry (Advanced)

If you need to add employees directly to Supabase:

1. Go to Supabase Dashboard → `users` table
2. Insert a new row with:
   ```json
   {
     "email": "employee@destiny.com",
     "password_hash": "[bcrypt hash of password]",
     "full_name": "Employee Name",
     "role": "employee",
     "is_active": true,
     "created_at": "2026-05-22T00:00:00Z",
     "updated_at": "2026-05-22T00:00:00Z"
   }
   ```

### Generating Bcrypt Hashes

Use an online bcrypt generator or Node.js:

```javascript
const bcrypt = require('bcryptjs');
const password = 'your-password';
const hash = await bcrypt.hash(password, 10);
console.log(hash);
```

## Troubleshooting Employee Login

### Issue: "Invalid email or password"

**Possible causes:**
1. Email doesn't exist in Supabase `users` table
2. Password hash is incorrect or corrupted
3. User account is marked `is_active = false`

**Solutions:**
- Verify employee exists in Supabase `users` table
- Check password hash is valid bcrypt format (starts with `$2a$` or `$2b$`)
- Ensure `is_active` is `true`
- Check browser console for debug logs (prefixed with `[v0]`)

### Issue: Login succeeds but redirects to landing page

This should no longer happen with the latest fix. The flow is:
1. Login succeeds
2. `pos_employee_access` localStorage set to `"true"`
3. Redirect to `/` (POS dashboard)
4. POS page checks for `pos_employee_access` flag
5. If present, shows POS interface
6. If missing, redirects back to `/landing`

**If this still occurs:**
- Check browser DevTools → Application → Local Storage
- Verify `pos_employee_access` is set to `"true"`
- Check browser console for auth errors
- Restart browser and try again

## Testing the Flow

### Create Test Employee via Admin
```
1. Go to http://localhost:3000/admin-login
2. Login: admin@example.com / password123
3. Click Employees in sidebar
4. Create employee:
   - Name: "John Doe"
   - Email: "john@destiny.com"
   - Password: "testpass123"
5. Success message shows "Employee 'John Doe' created successfully!"
```

### Login as Employee
```
1. Go to http://localhost:3000/employee-login
2. Enter:
   - Email: john@destiny.com
   - Password: testpass123
3. Click "Login as Employee"
4. Should be redirected to POS dashboard
5. See Destiny Supermarket header with logo
```

### Verify Session
```
1. Open DevTools → Application → Local Storage
2. Check `pos_employee_access` = "true"
3. Check `auth_user` contains employee data (id, email, role: "employee")
```

## Security Notes

- Passwords are hashed with bcryptjs (10 salt rounds)
- Password hashes are never sent to client
- Only safe user fields returned after login (id, email, full_name, role, is_active)
- Each login verifies credentials fresh from Supabase
- Sessions stored in localStorage (cleared on logout)

## API Endpoints

### Employee Login
- **Endpoint:** `/employee-login` (POST via form)
- **Service:** `loginUser()` in `auth-db.ts`
- **Database:** Supabase `users` table
- **Returns:** User object with auth context set

### Admin Login  
- **Endpoint:** `/admin-login` (POST via form)
- **Service:** Same `loginUser()` function
- **Role check:** Admin users have `role = "admin"`

## Database Schema

```sql
-- users table structure
CREATE TABLE public.users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  full_name text,
  role text NOT NULL DEFAULT 'employee',  -- 'admin' or 'employee'
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);
```

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

When these are set, the app uses Supabase for authentication. If not set, it falls back to local mock database with demo admin account.

---

**Last Updated:** May 22, 2026
**Status:** Production Ready with Supabase Integration
