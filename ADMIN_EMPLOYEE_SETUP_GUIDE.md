# Admin & Employee Authentication Setup Guide

## Quick Start (5 minutes)

### Step 1: First Admin Setup
1. Go to `/landing` in your app
2. Click **"Admin Access"** button
3. Click **"Create one here"** to go to `/admin-signup`
4. Fill in:
   - Full Name: `Your Name`
   - Email: `admin@yourstore.com`
   - Password: `securepassword`
   - Confirm Password: `securepassword`
5. Click **"Create Admin Account"**
6. You'll be redirected to `/admin` dashboard

### Step 2: Create Employee Accounts
1. In admin dashboard, click **"Employees"** in the sidebar
2. Fill in the form:
   - Full Name: `Employee Name`
   - Email: `employee@yourstore.com`
   - Password: `employeepassword`
3. Click **"Create Employee"**
4. Employee is now in the system

### Step 3: Control Employee Signup
1. Go to **Settings** in admin dashboard
2. Find **"System Settings"**
3. Toggle **"Employee Sign-ups"** ON or OFF
   - **ON**: Employees can self-register at `/employee-signup`
   - **OFF**: Only you can create employee accounts

---

## User Flows

### ✅ Admin Flow
```
/landing → "Admin Access" → /admin-login
                              ↓
                          (Enter credentials)
                              ↓
                          /admin (Dashboard)
                              ↓
                    Manage employees, settings, products, etc.
```

### ✅ Employee Flow (When Signup is ENABLED)
```
/landing → "Employee Login" → /employee-login
                                  ↓
                          Click "Sign up here"
                                  ↓
                          /employee-signup
                                  ↓
                          (Create account)
                                  ↓
                          / (POS System)
                                  ↓
                        Use checkout & sales
```

### ✅ Employee Flow (When Signup is DISABLED)
```
/landing → "Employee Login" → /employee-login
                                  ↓
                          (Admin-created account only)
                                  ↓
                          / (POS System)
                                  ↓
                        Use checkout & sales
```

---

---

## Features

### 🔐 Admin Features
- Create employee accounts manually
- Delete employee accounts
- View all employees in the system
- Toggle employee self-signup on/off
- Full access to store settings and management

### 👥 Employee Features
- Login to access POS system
- Self-signup (only if admin enables it)
- Access to checkout and sales features
- Cannot access admin panel

---

## Navigation Guide

### Sidebar Links (Admin Only)
| Section | Link | Purpose |
|---------|------|---------|
| Dashboard | /admin | View store stats & overview |
| Products | /admin/products | Manage inventory |
| Orders | /admin/orders | View transactions |
| Customers | /admin/customers | Manage customer data |
| **Employees** | **/admin/employees** | Create/manage staff ⭐ |
| Settings | /admin/settings | Configure system & signup |

### Public Links
| Link | Purpose |
|------|---------|
| /landing | Home page with login options |
| /admin-signup | Create admin account |
| /admin-login | Admin login |
| /employee-signup | Employee self-registration (if enabled) |
| /employee-login | Employee login |
| / | POS checkout (employees only) |

---

## Scenario Examples

### Scenario 1: Fresh Start
1. Visit `/admin-signup` and create your admin account
2. Login to `/admin`
3. Go to **Employees** section
4. Create 3 employee accounts for your staff
5. Go to **Settings** > **System Settings**
6. Toggle **"Employee Sign-ups"** OFF (to prevent unauthorized signups)
7. Share login credentials with your employees
8. They login at `/employee-login` to access the POS

### Scenario 2: Allow Employees to Self-Register
1. Create your admin account
2. Go to **Settings** > **System Settings**
3. Toggle **"Employee Sign-ups"** ON
4. Share the app URL with new employees
5. They can click "Employee Login" → "Sign up here"
6. They create their own accounts and access the POS immediately

### Scenario 3: Disable Self-Registration Later
1. Go to **Settings** > **System Settings**
2. Toggle **"Employee Sign-ups"** OFF
3. Try accessing `/employee-signup` - shows "Sign-ups Disabled" message
4. New employees can only be added by you in the Employees section

---

## Security Tips

✅ **Do's:**
- Use strong, unique passwords
- Change demo account passwords immediately
- Disable employee signup if not needed
- Regularly review employee list
- Delete former employee accounts

❌ **Don'ts:**
- Share admin credentials with employees
- Use "password123" in production
- Leave signup enabled if not needed
- Ignore unauthorized access attempts

---

## Troubleshooting

### "Employee signup is currently disabled"
**Problem:** Trying to signup but getting disabled message
**Solution:** Ask admin to enable employee signup in Settings, or provide your login credentials

### "Invalid email or password"
**Problem:** Can't login with your credentials
**Solution:** 
- Verify you're entering the correct email and password
- Check that you're logging in as the right role (admin vs employee)
- Use demo credentials to test: `admin@example.com` / `password123`

### "User already exists"
**Problem:** Getting error when creating an account
**Solution:** Email already registered. Use a different email address or contact admin.

### Lost access to admin account
**Problem:** Forgot admin password
**Solution:** 
- Clear browser storage: Open DevTools (F12) → Application → Clear all
- Start fresh at `/admin-signup`
- Create new admin account with different email

---

## What's Next?

After setup, you can:
1. ✅ Customize store name in Settings
2. ✅ Add products to your inventory
3. ✅ Set tax rates and discounts
4. ✅ Configure payment methods
5. ✅ Enable customer loyalty program
6. ✅ View analytics and reports

---

## Need Help?

Refer to:
- `AUTHENTICATION_SYSTEM.md` - Technical details
- Admin Dashboard - Hover over sections for tooltips
- Settings page - Detailed descriptions for each option

---

**Ready to get started? Visit `/landing` and click "Admin Access"! 🚀**
