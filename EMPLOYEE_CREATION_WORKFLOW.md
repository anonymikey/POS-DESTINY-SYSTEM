# Employee Account Creation Workflow

## Quick Reference Guide

### For Admins: Creating Employees

**Step-by-Step Instructions:**

1. **Login to Admin Dashboard**
   - Go to `/admin-login`
   - Enter admin credentials
   - Access admin panel at `/admin`

2. **Navigate to Employees**
   - Click "Employees" in left sidebar
   - You'll see "Employee Management" page
   - Shows all current employees

3. **Create New Employee**
   - Fill in form:
     - Full Name: Employee's full name
     - Email: Employee's email address
     - Password: Secure password (6+ characters)
   - Click "Create Employee" button
   - Success message appears

4. **Distribute Credentials**
   - Copy email and password
   - Send securely to employee
   - Include login URL: `https://yoursite.com/employee-login`
   - Include instructions

5. **Employee Logs In**
   - Employee goes to `/employee-login`
   - Enters email and password
   - Redirected to POS at `/`
   - Sees onboarding tutorial (first visit only)

---

### For Employees: Getting Access

**What to do if you don't have credentials:**

1. **Contact Your Manager/Admin**
   - Ask them to create an account
   - Provide your name and preferred email
   - Wait for credentials

2. **Receive Credentials**
   - Check email for login details
   - Email contains:
     - Email address
     - Temporary password
     - Login URL

3. **Login to POS**
   - Go to: `https://yoursite.com/employee-login`
   - Enter email
   - Enter password
   - Click "Login as Employee"

4. **First Time in POS**
   - Onboarding modal appears
   - 5-step tutorial on how to use POS
   - Click "Get Started" when finished
   - Ready to process sales

---

## User Flows

### Admin Account Creation Flow

```
Admin Dashboard (/admin)
    ↓
Click "Employees" → /admin/employees
    ↓
Fill in Employee Details
  - Full Name
  - Email
  - Password
    ↓
Click "Create Employee"
    ↓
Success Message
    ↓
Employee Listed in Table
    ↓
Admin Copies Credentials
    ↓
Admin Emails to Employee
    ↓
Done
```

### Employee Login Flow

```
Homepage (/landing)
    ↓
Click "Employee Login"
    ↓
Enter Email
    ↓
Enter Password (from admin)
    ↓
Click "Login as Employee"
    ↓
Authenticate against database
    ↓
If correct: Redirect to POS (/)
If wrong: Error message shown
    ↓
At POS:
  - First visit: Onboarding modal
  - Subsequent: Go straight to POS
    ↓
Ready to use system
```

---

## Key Points

### Only Admins Can Create Employees
- ✅ Admins use `/admin/employees` to create accounts
- ❌ Employees cannot use `/employee-signup`
- ❌ No self-registration available
- ❌ No public signup forms

### Employee Login Still Works
- ✅ Employees login with provided credentials at `/employee-login`
- ✅ Password entered from admin must match exactly
- ✅ Login validates against Supabase database
- ✅ Session stored securely in localStorage

### Security Measures
- ✅ Passwords bcrypt hashed in database
- ✅ Only admin can see passwords initially
- ✅ Credentials distributed via email (not in app)
- ✅ Clear audit trail of account creation

---

## Troubleshooting

### Employee Can't Login
**Problem:** Employee entered correct credentials but gets error

**Solutions:**
1. Check spelling of email (case-sensitive)
2. Check password is typed exactly (case-sensitive)
3. Verify admin created account (check in `/admin/employees`)
4. Ask admin to resend credentials
5. If still fails, admin can create new account with different password

### Employee Account Not Showing
**Problem:** Admin created account but it doesn't appear in list

**Solutions:**
1. Refresh the page (F5)
2. Verify form was submitted successfully (success message shown)
3. Check browser console for errors (F12)
4. Try creating again with different email
5. Contact system administrator

### Employee Forgot Password
**Problem:** Employee doesn't remember password provided by admin

**Solutions:**
1. Employee contacts admin
2. Admin goes to `/admin/employees`
3. Admin creates NEW account with same email
4. Admin sends new credentials to employee
5. Employee uses new credentials to login

---

## Admin Responsibilities

When creating employees, admins should:
- Verify employee information is correct
- Use secure passwords (suggest: `EmployeeName2024!` format)
- Distribute credentials securely (email, in-person, etc.)
- Document creation date
- Note any special permissions needed
- Plan offboarding when employee leaves

---

## Employee Responsibilities

When receiving credentials, employees should:
- Keep password confidential
- Never share credentials with others
- Logout after each shift
- Report forgotten passwords to admin
- Notify admin when leaving job
- Use system only for authorized work

---

## Verification Steps

### Admin: Verify Account Created
1. Go to `/admin/employees`
2. Look for employee in the list
3. Check creation date matches
4. Verify email is correct
5. Account is ready to use

### Employee: Verify Login Works
1. Go to `/employee-login`
2. Enter email from admin
3. Enter password from admin
4. Click "Login as Employee"
5. Should redirect to POS at `/`

---

## Important Notes

- **Employees cannot create their own accounts** - This is by design for security
- **Admins control all account creation** - Only way to add employees
- **Credentials are one-time use** - Employee should keep them secure
- **No self-service password reset** - Admin must create new account
- **Audit trail is maintained** - Who created what account and when

---

## Contact & Support

- **Employees:** Contact your manager/admin for account creation
- **Admins:** See `/admin/employees` for account management
- **System Issues:** Contact system administrator

---

## Summary

The DESTINY POS uses admin-only employee account creation for maximum security. This ensures only authorized individuals have system access and protects supermarket data from unauthorized access. The workflow is simple: admin creates → admin distributes credentials → employee logs in and works.
