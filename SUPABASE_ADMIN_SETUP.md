# Supabase Admin Setup - Quick Start Guide

Since you're using Supabase, here's the exact steps to create your first admin account.

## Step 1: Generate Password Hash

You need to hash your password using bcryptjs. The easiest way is to use the Node.js command line.

**Option A: Using Node.js (Recommended)**
```bash
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('your-secure-password', 10))"
```

Replace `your-secure-password` with your actual password (e.g., `AdminSecure@2024`).

**Example Output:**
```
$2a$10$abcdefghijklmnopqrstuvwxyz1234567890.AbCdEfGhIjKlMnO
```

Copy this entire string - it's your password hash.

**Option B: Using Online Tool (Not Recommended for Production)**
If you don't have Node.js, you can temporarily use an online bcrypt tool:
- Visit https://bcrypt.online/
- Enter your password
- Set rounds to 10
- Copy the generated hash

## Step 2: Access Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Login with your account
3. Select your project: **DESTINY SUPERMARKET** (or whatever your project name is)
4. Click on **"Database"** in the left sidebar
5. Click on **"Tables"**
6. Find and click on the **"users"** table

## Step 3: Insert New Admin User

1. Click the **"Insert row"** button (usually at the top right)
2. A form will appear with fields for each column

### Fill in the Following Fields:

| Field | Value | Example |
|-------|-------|---------|
| **id** | Leave blank (auto-generated) | - |
| **email** | Your admin email | `admin@destiny.com` |
| **password_hash** | The bcrypt hash from Step 1 | `$2a$10$...` |
| **full_name** | Your name | `John Doe` |
| **role** | Type: `admin` | `admin` |
| **is_active** | Toggle: ON/TRUE | ✅ |
| **created_at** | Leave blank (auto-filled) | - |
| **updated_at** | Leave blank (auto-filled) | - |

**Important: Make sure `role` is exactly `admin` (lowercase)**

## Step 4: Save and Verify

1. Click **"Save"** button
2. You should see the new row in the users table
3. Verify all fields are correct

## Step 5: Test Admin Login

1. Open your application: `http://localhost:3000/admin-login`
2. Enter the email and password you set up (not the hash!)
3. You should be logged in and redirected to `/admin` dashboard

**Example:**
- Email: `admin@destiny.com`
- Password: `AdminSecure@2024` (the original password, NOT the hash)

## If Login Fails

### Check These Things:

1. **Is the email correct?**
   - In Supabase, find the user row
   - Verify email matches exactly (case-sensitive)

2. **Is the password hash correct?**
   - In Supabase, copy the password_hash field
   - It should start with `$2a$` or `$2b$`
   - It should be about 60 characters long
   - If it looks wrong, delete the row and try again

3. **Is role set to 'admin'?**
   - Click on the users table
   - Find your row
   - Check the role column - it must be `admin` (lowercase)
   - Not `Admin`, not `ADMIN`, just `admin`

4. **Is is_active set to true?**
   - Check the is_active column
   - Should be ✅ (checked/true)

5. **Browser cache?**
   - Clear browser cache/cookies
   - Try in an incognito/private window
   - Try on a different browser

## Adding More Admins (After First One Works)

Once your first admin account is working, you can create more admins by repeating the process:

1. Login to admin dashboard
2. (Optional) You can add admin creation UI to admin dashboard
3. OR manually add more admins in Supabase:
   - Repeat Steps 1-4 above
   - Make sure each email is unique
   - Each must have role='admin'

## Creating Employee Accounts

Employees can ONLY be created by admins using the admin dashboard:

1. Login as admin
2. Go to **Employees** section
3. Click **"Create Employee"** button
4. Fill in name, email, password
5. Click **Save**

The admin dashboard handles password hashing automatically!

## Troubleshooting

### Issue: "Invalid email or password"
**Solution:**
- Double-check the email in Supabase matches exactly
- Verify password_hash is valid (starts with $2a$ or $2b$)
- Make sure is_active is TRUE

### Issue: "You do not have permission to access this page"
**Solution:**
- Your user role must be `admin` (exactly, lowercase)
- Go to Supabase users table
- Find your user
- Change role from `employee` to `admin`
- Logout and login again

### Issue: Password doesn't work even with correct hash
**Solution:**
- Re-generate the hash using Step 1
- Make sure you're using the original password, not the hash
- Delete the row and create a new one with a fresh hash

### Issue: Email field shows "Unique" constraint error
**Solution:**
- Another user already has that email
- Try a different email
- Or delete the duplicate user first

## Security Best Practices

✅ **DO:**
- Use strong passwords (8+ characters, mix of upper/lower/numbers/symbols)
- Use secure email addresses
- Keep password_hash values secret (don't share)
- Rotate passwords every 90 days
- Use unique passwords for each admin

❌ **DON'T:**
- Use passwords like "password123" or "admin"
- Share admin credentials over email
- Commit credentials to git
- Use the same password as other systems
- Leave test/demo accounts in production

## Example: Complete Setup Walkthrough

### 1. Generate Hash for Password "MySecurePass2024!"

```bash
$ node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('MySecurePass2024!', 10))"
$2a$10$n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5
```

### 2. Go to Supabase Users Table

Click Insert Row

### 3. Fill Form:
```
email: manager@destiny.com
password_hash: $2a$10$n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5n5
full_name: Store Manager
role: admin
is_active: ✅ (TRUE)
```

### 4. Click Save

### 5. Test Login:
```
Go to: http://localhost:3000/admin-login
Email: manager@destiny.com
Password: MySecurePass2024!
```

## Support

If you get stuck:
1. Email: admin@anonymikletech.online
2. Phone: +254 782 829 321
3. Check `ADMIN_SECURITY_SETUP.md` for more details
4. Review the error message in browser console (F12)

## Next Steps

After your first admin is set up:

1. ✅ Test admin login works
2. ✅ Test accessing admin dashboard
3. ✅ Create employee accounts via admin UI
4. ✅ Test employee login
5. ✅ Verify employees can't access `/admin` pages
6. ✅ Create additional admin accounts as needed
7. ✅ Document all admin accounts in a secure location
8. ✅ Set up regular password rotation policy
9. ✅ Enable Supabase Row Level Security (RLS) policies
10. ✅ Set up audit logging for admin actions

You're now ready to use the secured POS system!
