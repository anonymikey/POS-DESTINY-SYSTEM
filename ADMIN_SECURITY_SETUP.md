# Admin Security Setup Guide

## Overview

This document explains how to properly set up admin accounts with the new security restrictions that prevent unauthorized access to the admin dashboard.

## Security Changes Summary

- **Demo credentials removed** - No demo admin accounts are provided
- **Admin signup disabled** - Admins must be created manually by existing administrators
- **Role-based access control** - Only users with `role='admin'` can access admin dashboard
- **Employee protection** - Employees are blocked from accessing admin pages

## Creating Your First Admin Account

### For Supabase Users

1. **Access Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project (DESTINY SUPERMARKET POS)
   - Navigate to Database → Tables → users

2. **Create Admin User**
   - Click "Insert row" or use SQL editor
   - Fill in the following fields:
     ```
     email: your-admin@example.com
     full_name: Admin Name
     role: admin
     is_active: true
     ```

3. **Hash the Password**
   - You need to hash your password using bcryptjs before storing it
   - Use this Node.js command to generate the hash:
     ```bash
     node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-password', 10))"
     ```
   - Replace `your-password` with your desired password

4. **Add Password Hash**
   - Paste the generated hash into the `password_hash` field
   - Save the row

5. **Login**
   - Go to http://localhost:3000/admin-login
   - Use your email and password to login

### For Local Database Users

If you're using the local mock database:

1. **Add to mockDatabase directly in auth-db.ts**
   ```typescript
   // Create admin account with proper bcrypt hash
   const adminHash = await hashPassword('your-secure-password')
   mockDatabase.users.push({
     id: 'admin-001',
     email: 'admin@company.com',
     password_hash: adminHash,
     full_name: 'Administrator',
     role: 'admin',
     is_active: true,
     created_at: new Date().toISOString(),
     updated_at: new Date().toISOString(),
   } as StoredUser)
   ```

2. **Restart the application** for changes to take effect

## Creating Additional Admin Accounts

Once you have one admin account, you can create more admins:

1. **Login to Admin Dashboard**
   - Access http://localhost:3000/admin-login
   - Use your existing admin credentials

2. **Using Admin Dashboard** (if admin creation UI is available)
   - Navigate to Settings or User Management
   - Create new admin user account

3. **Using Database Directly**
   - Follow the same steps as "Creating Your First Admin Account" above
   - Ensure `role` is set to `admin`

## Security Best Practices

### Password Security
- Use strong passwords (minimum 8+ characters, mix of upper/lower/numbers/symbols)
- Never share admin passwords
- Rotate passwords regularly (at least quarterly)
- Never use demo credentials in production

### Access Control
- Only assign admin role to trusted personnel
- Audit who has admin access regularly
- Disable accounts for employees who leave the company
- Use the `is_active` field to deactivate accounts without deleting

### Database Security
- Enable Row Level Security (RLS) in Supabase for the users table
- Restrict direct database access to authorized personnel only
- Use environment variables for database connection strings
- Never commit sensitive credentials to version control

### Monitoring
- Keep audit logs of admin actions
- Monitor failed login attempts
- Regular security audits
- Review access logs monthly

## Testing Admin Access

### Test Admin Login
```
1. Go to http://localhost:3000/admin-login
2. Enter admin email and password
3. Should be redirected to /admin dashboard
4. Verify sidebar and navigation work
```

### Test Employee Rejection
```
1. Create an employee account (via admin dashboard)
2. Logout from admin
3. Login as employee at http://localhost:3000/employee-login
4. Try accessing http://localhost:3000/admin directly
5. Should be redirected to /unauthorized page
```

### Test Signup Restrictions
```
1. Try accessing http://localhost:3000/admin-signup
2. Should see blocked message explaining admins can only be created by existing admins
3. Try accessing http://localhost:3000/employee-signup
4. Should see disabled message explaining employees must be created by admins
```

## Database Schema Reference

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'employee', -- 'admin' or 'employee'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Required Fields
- `email` - Unique user email
- `password_hash` - Bcrypt hashed password (NOT plaintext)
- `full_name` - User's display name
- `role` - Either 'admin' or 'employee'
- `is_active` - Boolean flag to enable/disable account

## Troubleshooting

### Admin Can't Login
1. Verify email and password are correct
2. Confirm user exists in database
3. Check `is_active` is set to `true`
4. Verify `role` is set to `admin`
5. Check password hash is valid bcrypt hash

### Employee Can Access Admin Pages
1. Verify employee role is `employee` in database
2. Clear browser cache and localStorage
3. Check AdminRouteGuard component is applied to /admin layout
4. Verify user role is correctly returned from loginUser function

### Password Hashing Issues
1. Use bcryptjs library (same as application uses)
2. Hashing should produce string starting with `$2a$` or `$2b$`
3. Always hash passwords before storing in database

## Support

For issues with admin access:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Check application logs for authentication errors
4. Verify Supabase connection if using Supabase
5. Contact support at admin@anonymikletech.online

## Next Steps

1. Create your first admin account using the steps above
2. Test login works correctly
3. Create employee accounts via admin dashboard
4. Test employee login and access restrictions
5. Set up additional admins as needed
6. Document admin accounts for your organization
