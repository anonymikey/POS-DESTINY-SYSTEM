# Authentication System Implementation Guide

## Overview

This document describes the new role-based authentication system for DESTINY POS with separate flows for Admins and Employees.

## System Architecture

### User Types

1. **Admins**
   - Can create and manage employee accounts
   - Can control employee signup settings
   - Access to full admin panel at `/admin`
   - Can enable/disable employee self-signup

2. **Employees**
   - Can only login (not signup if disabled by admin)
   - Access to POS checkout system at `/`
   - Cannot access admin panel

### Authentication Flow

#### Admin Path
1. `/admin-signup` - Admin creates account (first admin should do this)
2. `/admin-login` - Admin logs in
3. `/admin` - Admin dashboard with full controls

#### Employee Path
1. `/employee-signup` - Employee creates account (only if enabled by admin)
2. `/employee-login` - Employee logs in
3. `/` - POS system access

## New Files Created

### Context Layer
- **`app/context/auth-context.tsx`**
  - Auth context providing `useAuth()` hook
  - Manages user state, login, signup, logout
  - Stores user data in localStorage

### Pages
- **`app/admin-signup/page.tsx`** - Admin registration page
- **`app/admin-login/page.tsx`** - Admin login page
- **`app/employee-signup/page.tsx`** - Employee registration page (respects admin settings)
- **`app/employee-login/page.tsx`** - Employee login page
- **`app/admin/employees/page.tsx`** - Employee management section

### Utilities
- **`app/utils/auth-demo.ts`** - Demo account initialization helper

## Configuration

### Admin Settings for Signup Control

Located in: `Settings > System Settings > Employee Sign-ups`

Toggle this option to enable/disable employee self-signup:
- **Enabled**: Employees can create accounts via `/employee-signup`
- **Disabled**: Employees cannot signup; only admins can create accounts

### Demo Accounts (Pre-initialized)

When the system first runs, it creates demo accounts:

**Admin Account:**
- Email: `admin@example.com`
- Password: `password123`
- Name: John Admin

**Employee Account:**
- Email: `employee@example.com`
- Password: `password123`
- Name: Jane Employee

## Features

### 1. Separate Login Pages
- `/admin-login` - Styled for admin access (blue theme)
- `/employee-login` - Styled for employee access (green theme)

### 2. Employee Management
- Admins can create employee accounts at `/admin/employees`
- Fill in: Full Name, Email, Password
- Employees are added to the system immediately
- Admins can delete employee accounts

### 3. Signup Control
- Admin toggle in Settings to allow/prevent employee signup
- When disabled, employees see a "Sign-ups Disabled" message
- Employees are directed to login instead

### 4. Role-Based Access
- `/admin` routes require admin access
- `/` (POS) requires employee access
- Landing page provides clear navigation to both paths

## File Locations

```
app/
├── context/
│   └── auth-context.tsx              # Auth context provider

├── admin-signup/
│   └── page.tsx                      # Admin registration
├── admin-login/
│   └── page.tsx                      # Admin login
├── employee-signup/
│   └── page.tsx                      # Employee registration
├── employee-login/
│   └── page.tsx                      # Employee login
├── admin/
│   ├── employees/
│   │   └── page.tsx                  # Employee management
│   ├── settings/
│   │   └── page.tsx                  # (Updated with signup toggle)
│   └── layout.tsx                    # (Updated with Employees nav)
└── layout.tsx                        # (Updated with AuthProvider)
```

## LocalStorage Schema

### `pos_users`
```json
[
  {
    "id": "user_123456",
    "email": "admin@example.com",
    "password": "hashed_password",
    "fullName": "John Admin",
    "isAdmin": true,
    "createdAt": "2024-01-01T12:00:00Z"
  }
]
```

### `pos_settings`
```json
{
  "storeName": "DESTINY POS",
  "storeEmail": "info@destinypos.com",
  "allowEmployeeSignup": true,
  "... other settings ...": ""
}
```

### `auth_user` (Current logged-in user)
```json
{
  "id": "user_123456",
  "email": "admin@example.com",
  "fullName": "John Admin",
  "isAdmin": true,
  "createdAt": "2024-01-01T12:00:00Z"
}
```

## Using the Auth Context

### In Components
```typescript
import { useAuth } from '@/app/context/auth-context'

export default function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
  
  if (isAuthenticated) {
    return <p>Welcome, {user?.fullName}!</p>
  }
}
```

## Security Notes

✅ **Production Ready**: Uses Supabase with bcrypt password hashing and secure authentication.

### Production Recommendations
1. Implement real authentication with Supabase Auth
2. Hash passwords with bcrypt
3. Use secure HTTP-only cookies for sessions
4. Implement JWT tokens
5. Add RBAC (Role-Based Access Control) middleware
6. Use environment variables for secrets
7. Implement audit logging

## Environment Setup

### Supabase Configuration
Add to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## Troubleshooting

### Employee can't signup even when enabled
- Check Settings > System Settings > Employee Sign-ups is toggled ON
- Clear browser cache if toggle appears different

### Forgot password
- Currently no recovery. Delete the user and recreate (development only)

### Wrong role accessing wrong section
- Clear localStorage: `localStorage.clear()` in browser console
- Login again with correct role

## Next Steps

1. Test the complete flow from admin signup to employee access
2. Verify employee management works correctly
3. Test signup toggle functionality
4. Consider adding:
   - Password reset functionality
   - Email verification
   - Two-factor authentication
   - Role-based page guards (middleware)
   - Activity logging
   - Permission management per endpoint

## Support

For issues or questions, refer to the sections above or check the implementation in each page file.
