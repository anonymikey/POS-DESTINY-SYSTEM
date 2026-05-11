# Ready to Test - Database Authentication System

## Quick Setup (5 Minutes)

### Step 1: Create Database Tables (2 min)
- [ ] Open Supabase Dashboard
- [ ] Go to SQL Editor
- [ ] Copy all text from `AUTH_SCHEMA.sql` 
- [ ] Paste into SQL Editor and click "Run"
- [ ] Wait for "Success" message

### Step 2: Verify Environment Variables (1 min)
- [ ] Go to Vercel Project Settings
- [ ] Go to Environment Variables
- [ ] Check `NEXT_PUBLIC_SUPABASE_URL` exists
- [ ] Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` exists
- [ ] Both should have values from Supabase

### Step 3: Run Dev Server (1 min)
```bash
pnpm install  # Install bcryptjs if needed
pnpm dev      # Start dev server
```

### Step 4: Test (1 min)
- [ ] Open http://localhost:3000/landing
- [ ] Click "Admin Access"
- [ ] Create first admin account (use any email/password)
- [ ] Should redirect to admin dashboard

---

## Test Checklist

### Test 1: Create Admin
- [ ] Go to `/admin-signup`
- [ ] Fill: Name, Email, Password
- [ ] Click "Create Account"
- [ ] Redirected to `/admin`

### Test 2: Create Employee (from Admin)
- [ ] Go to `/admin/employees`
- [ ] Fill: Name, Email, Password
- [ ] Click "Create Employee"
- [ ] Employee appears in list

### Test 3: Employee Signup (if enabled)
- [ ] Go to `/employee-signup`
- [ ] Fill form and submit
- [ ] Should login and go to `/`

### Test 4: Toggle Signup
- [ ] Go to `/admin/settings`
- [ ] Toggle "Employee Sign-ups" OFF
- [ ] Click Save
- [ ] Go to `/employee-signup`
- [ ] Should show "Disabled" message

### Test 5: Employee Login
- [ ] Go to `/employee-login`
- [ ] Use created employee credentials
- [ ] Should go to POS at `/`

### Test 6: Delete Employee
- [ ] Go to `/admin/employees`
- [ ] Click trash icon next to employee
- [ ] Confirm deletion
- [ ] Employee removed from list

---

## Files Created/Modified

**New Files:**
- `AUTH_SCHEMA.sql` - Database schema
- `app/services/auth-db.ts` - Database service
- `DATABASE_AUTH_SETUP.md` - Complete guide
- `READY_TO_TEST.md` - This file

**Updated Files:**
- `app/context/auth-context.tsx` - Uses database
- `app/admin-signup/page.tsx` - Database integration
- `app/admin-login/page.tsx` - Database integration
- `app/employee-signup/page.tsx` - Database integration
- `app/employee-login/page.tsx` - Database integration
- `app/admin/employees/page.tsx` - Database integration
- `app/admin/settings/page.tsx` - Database integration
- `package.json` - Added bcryptjs

---

## Expected Results

When complete, you should have:

✅ Admin signup working (creates user in database)
✅ Admin login working (queries database)
✅ Admin can create employees (inserts into database)
✅ Employee list shows all employees (from database)
✅ Admin can delete employees (removes from database)
✅ Admin can toggle signup (saves to database)
✅ Employee signup works when enabled
✅ Employee login works
✅ All passwords securely hashed with bcrypt

---

## Troubleshooting

**Q: "Cannot find module bcryptjs"**
A: Run `pnpm install` to install dependencies

**Q: "Missing Supabase variables"**
A: Check Vercel Environment Variables are set correctly

**Q: "User with this email already exists"**
A: Check database - user might already exist from previous test

**Q: Settings not saving**
A: Check browser console for errors (F12)

---

## Next Steps After Testing

1. Deploy to Vercel with environment variables set
2. Run same tests on production URL
3. Create real admin and employee accounts
4. Configure system settings as needed
5. Train employees on login process

---

## Database Views

To view data in Supabase:

1. Go to Supabase Dashboard
2. Click "SQL Editor"
3. Run these queries:

```sql
-- View all users
SELECT id, email, full_name, role, is_active, created_at FROM users;

-- View system settings
SELECT key, value, updated_at FROM system_settings;

-- Count employees
SELECT COUNT(*) FROM users WHERE role = 'employee';

-- Count admins
SELECT COUNT(*) FROM users WHERE role = 'admin';
```

---

## Important Notes

⚠️ **First Time Only:**
- Admin signup creates the first admin account
- Only run `AUTH_SCHEMA.sql` once (creates tables)
- Don't delete the first admin unless you know what you're doing

⚠️ **Testing:**
- Use test emails (test@example.com, etc.)
- Each email must be unique
- Passwords are case-sensitive

⚠️ **Security:**
- Never commit `.env.local` to GitHub
- Keep `NEXT_PUBLIC_SUPABASE_ANON_KEY` secret
- Only use in Vercel production environment

---

## Success Indicators

You'll know it's working when:
1. Signup page creates accounts visible in Supabase
2. Login page authenticates against database
3. Employee list shows users from database
4. Settings toggle persists to database
5. No errors in browser console (only `[v0]` logs)

---

**Questions?** Check `DATABASE_AUTH_SETUP.md` for detailed documentation.
