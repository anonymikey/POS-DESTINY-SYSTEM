# Database Authentication Setup Guide

## Overview

The POS DESTINY system now uses Supabase PostgreSQL database for complete authentication. All admin and employee credentials, settings, and configurations are securely stored in the database instead of localStorage.

---

## Database Schema

The system uses two main tables:

### 1. **users** Table
Stores all user accounts (admins and employees)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,  -- bcrypt hashed
  full_name VARCHAR(255),
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'employee')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. **system_settings** Table
Stores system configuration (employee signup toggle, etc.)

```sql
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(255) UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Setup Instructions

### Step 1: Create Tables in Supabase

1. Go to your Supabase project
2. Open SQL Editor
3. Copy the entire contents of `AUTH_SCHEMA.sql`
4. Paste into the SQL editor
5. Click "Run" to execute

**Expected Result:** Both tables created with indexes and triggers

### Step 2: Verify Environment Variables

Ensure these are set in your Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

To get these:
- Go to Supabase Dashboard → Your Project → Settings → API
- Copy `Project URL` and `anon public` key

### Step 3: Test the Connection

The app will automatically test the connection when you:
1. Try to sign up a new admin at `/admin-signup`
2. Check browser console for any connection errors

---

## Testing the Authentication System

### Test Scenario 1: Create First Admin Account

**URL:** `http://localhost:3000/landing`

1. Click "Admin Access" button
2. Click "Create one here"
3. Fill in form:
   - Full Name: `Admin User`
   - Email: `admin@test.com`
   - Password: `Test123456`
   - Confirm: `Test123456`
4. Click "Create Account"
5. Should redirect to `/admin` dashboard

**What Happens:**
- Password is hashed using bcrypt
- New record created in `users` table with role='admin'
- User stored in localStorage for session
- Settings initialized with `allow_employee_signup=true`

### Test Scenario 2: Admin Creates Employee

**URL:** `http://localhost:3000/admin/employees`

1. Fill in employee form:
   - Full Name: `John Doe`
   - Email: `john@test.com`
   - Password: `Test123456`
2. Click "Create Employee"
3. Employee appears in list below

**What Happens:**
- Employee record created in `users` table with role='employee'
- Password hashed and stored
- Employee list refreshed from database

### Test Scenario 3: Employee Self-Registration (Enabled)

**URL:** `http://localhost:3000/employee-signup`

1. Fill in form:
   - Full Name: `Jane Doe`
   - Email: `jane@test.com`
   - Password: `Test123456`
   - Confirm: `Test123456`
2. Click "Sign Up"
3. Should redirect to `/` (POS)

**What Happens:**
- System checks `allow_employee_signup` setting
- If true, creates new employee record
- Logs in automatically

### Test Scenario 4: Employee Self-Registration (Disabled)

**URL:** `http://localhost:3000/admin/settings`

1. Toggle OFF "Employee Sign-ups"
2. Click "Save Settings"
3. Logout and go to `/employee-signup`

**Expected:** Page shows "Sign-ups Disabled" message

**What Happens:**
- Setting saved to `system_settings` table as `allow_employee_signup=false`
- Employee signup endpoint checks this before creating accounts

### Test Scenario 5: Employee Login

**URL:** `http://localhost:3000/employee-login`

1. Email: `john@test.com` (created in Scenario 2)
2. Password: `Test123456`
3. Click "Login"
4. Should redirect to `/` (POS system)

**What Happens:**
- System queries `users` table for email
- Password compared using bcrypt
- User session stored in localStorage
- Redirected to POS

### Test Scenario 6: Admin Login

**URL:** `http://localhost:3000/admin-login`

1. Email: `admin@test.com` (created in Scenario 1)
2. Password: `Test123456`
3. Click "Login"
4. Should redirect to `/admin`

**What Happens:**
- Same process as employee login
- Redirected to admin dashboard instead of POS

---

## Database Service Functions

All database operations use the `auth-db.ts` service:

### Authentication Functions

```typescript
// Login user
loginUser(credentials: LoginCredentials): Promise<{ user: User | null; error: string | null }>

// Sign up new user
signupUser(data: SignupData): Promise<{ user: User | null; error: string | null }>

// Create employee (admin only)
createEmployee(data: EmployeeData): Promise<{ user: User | null; error: string | null }>

// Get user by ID
getUserById(id: string): Promise<User | null>

// Get all employees
getAllEmployees(): Promise<User[]>

// Delete user
deleteUser(id: string): Promise<{ success: boolean; error: string | null }>

// Deactivate user
deactivateUser(id: string): Promise<{ success: boolean; error: string | null }>
```

### Settings Functions

```typescript
// Get setting by key
getSystemSetting(key: string): Promise<string | null>

// Update setting
updateSystemSetting(key: string, value: string): Promise<{ success: boolean; error: string | null }>

// Check if employee signup allowed
isEmployeeSignupAllowed(): Promise<boolean>
```

---

## Features

✅ **Secure Password Storage**
- All passwords hashed with bcrypt (10 rounds)
- Never stored in plain text

✅ **Role-Based Access Control**
- Admin: Full access to dashboard and settings
- Employee: Access to POS only

✅ **Account Management**
- Admins can create unlimited employee accounts
- Admins can delete employee accounts
- Employees can self-register (when enabled)

✅ **System Settings**
- Toggle employee signup on/off
- Settings persisted in database
- Controlled from admin settings page

✅ **Session Management**
- User stored in localStorage for current session
- Session cleared on logout
- User data verified from database on app load

✅ **Error Handling**
- Detailed error messages for all operations
- Validation on signup (email, password, etc.)
- User feedback on success/failure

---

## Troubleshooting

### "Missing Supabase environment variables"
**Solution:** Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vercel settings

### "User with this email already exists"
**Solution:** Email must be unique. Try different email address.

### "Password must be at least 6 characters"
**Solution:** Use longer password (minimum 6 characters)

### "Invalid email or password" (on login)
**Solution:** 
- Check email spelling
- Verify user was created successfully
- Check if account is active

### Tables don't exist
**Solution:**
1. Go to Supabase SQL Editor
2. Run `AUTH_SCHEMA.sql` again
3. Check for any SQL errors

### Settings not saving
**Solution:**
1. Check browser console for errors
2. Verify Supabase environment variables
3. Check that `system_settings` table exists
4. Look at Supabase logs for database errors

---

## Security Best Practices

1. **Never commit `.env.local` to Git**
   - Environment variables are secret
   - Use Vercel project settings instead

2. **Use Strong Passwords**
   - Minimum 6 characters (enforced)
   - Consider requiring longer passwords

3. **Regular Backups**
   - Supabase provides automated backups
   - Keep sensitive data secure

4. **Monitor Active Sessions**
   - Check who's logged in
   - Logout users when leaving

---

## Sample Test Data

You can manually insert test data into `users` table via Supabase SQL Editor:

```sql
-- This is for testing only - the app will hash passwords
-- DO NOT insert plain passwords in production

-- Note: You must use hashed passwords in production
-- Use the signup pages instead for proper password hashing
```

---

## Next Steps

1. Run `AUTH_SCHEMA.sql` in Supabase
2. Verify environment variables in Vercel
3. Test all 6 scenarios above
4. Deploy to production when ready
5. Monitor database usage in Supabase dashboard

---

## Support

If you encounter issues:
1. Check console logs (`F12` → Console tab)
2. Check Supabase logs in project dashboard
3. Verify all environment variables are correct
4. Ensure tables were created successfully

All auth operations are logged in browser console with `[v0]` prefix for debugging.
