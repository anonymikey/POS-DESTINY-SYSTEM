# Vercel Environment Variables - Complete Requirements

This document lists all environment variables required to deploy the POS DESTINY System to Vercel.

## Quick Setup Checklist

- [ ] Supabase account created
- [ ] Supabase project initialized  
- [ ] Environment variables copied from Supabase
- [ ] Variables added to Vercel Settings
- [ ] Deployment successful
- [ ] Landing page displays correctly
- [ ] Can log in to app

---

## Required Environment Variables

### 1. Supabase Configuration (REQUIRED)

These variables connect your app to Supabase database. **Without these, the app will not function.**

#### `NEXT_PUBLIC_SUPABASE_URL`
- **Type**: Public (visible in client code)
- **Value**: Your Supabase project URL
- **Example**: `https://xxxxxxxxxxxxx.supabase.co`
- **Where to find**: 
  1. Go to https://supabase.com/dashboard
  2. Click your project
  3. Go to **Settings** → **API**
  4. Copy "Project URL"
- **Purpose**: Base URL for all Supabase API calls

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Type**: Public (visible in client code)
- **Value**: Your Supabase anonymous/public API key
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Where to find**:
  1. Go to https://supabase.com/dashboard
  2. Click your project
  3. Go to **Settings** → **API**
  4. Copy "anon public" key (NOT the service_role key)
- **Purpose**: Authentication key for public API access
- **Security Note**: This is safe to expose (public key) - Supabase uses RLS for security

---

## Step-by-Step Setup Instructions

### Step 1: Get Your Supabase Credentials

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your POS System project
3. Click **Settings** in the left sidebar
4. Click **API** from the menu
5. You'll see three important values:

```
Project URL:        https://xxxxxxxxxxxxx.supabase.co
anon public key:    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key:   (NOT USED - do not copy this)
```

**Copy the Project URL and anon public key** - you'll need these in the next step.

### Step 2: Add Variables to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your **pos-destiny-system** project
3. Click **Settings** in the top menu
4. Click **Environment Variables** in the left sidebar
5. Add the first variable:
   - **Name**: `NEXT_PUBLIC_SUPABASE_URL`
   - **Value**: Paste your Supabase project URL
   - **Environments**: Select **Production** (check all if you want)
   - Click **Save**
6. Add the second variable:
   - **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Value**: Paste your Supabase anon key
   - **Environments**: Select **Production** (check all if you want)
   - Click **Save**

#### Option B: Via Vercel CLI

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your Supabase URL when prompted

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your Supabase anon key when prompted
```

### Step 3: Deploy

After adding environment variables, redeploy your project:

```bash
vercel --prod
```

Or click **Redeploy** in the Vercel dashboard.

---

## Optional Environment Variables

These are not required but may be useful for advanced configurations:

### `NEXT_PUBLIC_API_URL` (Optional)
- **Type**: Public
- **Value**: Your custom API URL
- **Example**: `https://api.yourpos.com`
- **Default**: Uses Supabase directly (recommended)
- **Purpose**: For custom backend API layer (not configured yet)

### `NODE_ENV` (Auto-set by Vercel)
- **Type**: Private
- **Value**: Automatically set to `production`
- **Purpose**: Tells Node.js this is production environment
- **Note**: You don't need to set this - Vercel does it automatically

---

## Verifying Your Setup

### Check 1: Verify Variables in Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your project
3. Click **Settings** → **Environment Variables**
4. You should see:
   - ✅ `NEXT_PUBLIC_SUPABASE_URL`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Check 2: Test the Landing Page

1. Open your deployed app: `https://pos-destiny-system.vercel.app/landing`
2. You should see:
   - ✅ Dark theme with "DESTINY" logo
   - ✅ "Your supermarket. Unified." headline
   - ✅ Navigation bar with buttons
   - ✅ Features section visible

If you see a **blank/black page**, skip to "Troubleshooting" below.

### Check 3: Test Admin Access

1. Click **Admin Access** button
2. You should be redirected to the admin dashboard
3. The page should load without errors

### Check 4: Check Browser Console for Errors

1. Open your deployed app
2. Press **F12** to open Developer Tools
3. Click the **Console** tab
4. You should see NO red error messages
5. Look for any messages like "Cannot connect to Supabase" or "undefined variable"

---

## Troubleshooting

### Issue: Blank/Black Landing Page

**Symptoms**: Landing page loads but shows only a black screen

**Cause**: Usually missing or incorrect environment variables

**Solutions**:

1. **Verify variables are set**:
   - Go to Vercel Settings → Environment Variables
   - Confirm both variables are listed
   - Check the values match exactly (no extra spaces)

2. **Redeploy after adding variables**:
   ```bash
   vercel --prod
   ```
   Or in Vercel dashboard, click "Redeploy"

3. **Check variable values**:
   - Make sure Supabase URL starts with `https://`
   - Make sure anon key is NOT the service_role key
   - Both should be non-empty strings

4. **Clear browser cache**:
   - Hard refresh: Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or open in private/incognito window

### Issue: "Cannot connect to Supabase" Error

**Symptoms**: Console shows error about Supabase connection

**Cause**: Invalid credentials or Supabase project not initialized

**Solutions**:

1. **Verify Supabase credentials**:
   ```bash
   # In browser console:
   console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
   console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
   ```
   Both should show values (not undefined)

2. **Verify Supabase project exists**:
   - Go to https://supabase.com/dashboard
   - Confirm your project is listed
   - Confirm project is "Running" (not paused)

3. **Verify database schema is created**:
   - In Supabase, go to **SQL Editor**
   - Check that tables exist (products, orders, customers, etc.)
   - If no tables, run `DATABASE_SCHEMA.sql` again

4. **Test connection directly**:
   ```bash
   # In Node REPL:
   import { createClient } from '@supabase/supabase-js'
   const url = 'your_supabase_url'
   const key = 'your_anon_key'
   const supabase = createClient(url, key)
   const { data } = await supabase.from('categories').select('count')
   console.log(data)
   ```

### Issue: Admin Dashboard Shows Empty Data

**Symptoms**: Admin page loads but charts/tables are empty

**Cause**: Supabase tables exist but have no data OR RLS policies blocking read access

**Solutions**:

1. **Add test data**:
   - Go to Supabase dashboard
   - Click **SQL Editor**
   - Run a simple INSERT:
   ```sql
   INSERT INTO categories (name, description) 
   VALUES ('Test Category', 'Test Description');
   ```

2. **Check RLS policies**:
   - Go to Supabase dashboard
   - Click **Authentication** → **Policies**
   - Ensure read/write policies allow public access (for development)
   - For production, implement proper authentication

### Issue: Mobile/Responsive Not Working

**Symptoms**: Landing page looks distorted on mobile

**Cause**: CSS/viewport not loading correctly

**Solutions**:

1. **Clear CloudFlare cache** (if using Vercel custom domain):
   - Go to Vercel dashboard
   - Click domain settings
   - Clear cache

2. **Hard refresh in browser**:
   - Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

3. **Test in incognito window**:
   - Open private browsing window
   - Navigate to your URL
   - This bypasses browser cache

---

## Common Mistakes to Avoid

❌ **Mistake**: Copy the **service_role key** instead of **anon public key**
- ❌ This will NOT work
- ✅ Always use the **anon public** key for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

❌ **Mistake**: Miss the `NEXT_PUBLIC_` prefix
- ❌ `SUPABASE_URL` (wrong)
- ✅ `NEXT_PUBLIC_SUPABASE_URL` (correct)

❌ **Mistake**: Add extra spaces in variable values
- ❌ ` https://xyz.supabase.co ` (has spaces - wrong)
- ✅ `https://xyz.supabase.co` (correct)

❌ **Mistake**: Forget to redeploy after adding variables
- Environment variables only take effect on new deployments
- Always redeploy after adding/changing variables

❌ **Mistake**: Store variables in `.env.local` file
- `.env.local` is for LOCAL development only
- For Vercel, use the dashboard or CLI
- Never commit `.env.local` to Git

---

## Environment Variables Reference

### Production Variables Checklist

```
✅ NEXT_PUBLIC_SUPABASE_URL = https://xxxxxxxxxxxxx.supabase.co
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOi...
```

### Development Variables (for local `.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### What NOT to Do

```
❌ SUPABASE_URL (missing NEXT_PUBLIC_)
❌ NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY (wrong key type)
❌ NEXT_PUBLIC_SUPABASE_JWT_SECRET (not needed)
❌ HARDCODED VALUES IN CODE (insecure)
```

---

## Security Notes

### Safe to Expose
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - This is public information
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - This is the public/anonymous key

### Protected by Supabase
- All API calls are authenticated
- Row Level Security (RLS) policies control access
- Service role key stays on the server (not used in this app)

### Best Practices
1. Always use `NEXT_PUBLIC_` prefix for client-side variables
2. Rotate keys periodically in Supabase
3. Use RLS policies for production
4. Monitor Supabase usage in dashboard
5. Never commit `.env.local` to GitHub

---

## Next Steps After Setup

1. ✅ Verify landing page displays correctly
2. ✅ Test admin login functionality
3. ✅ Verify charts load with data
4. ✅ Test adding orders/products
5. ✅ Monitor Supabase usage in dashboard
6. ✅ Set up custom domain (optional)
7. ✅ Configure error tracking (optional - Sentry, etc.)

---

## Need Help?

### Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

### Debugging
1. Check Vercel deployment logs
2. Check browser console (F12)
3. Check Supabase dashboard for errors
4. Enable debug logging in app code

### Support
- Vercel Help: https://vercel.com/help
- Supabase Support: https://supabase.com/support
- Check project documentation files

---

**Last Updated**: May 2026  
**Version**: POS DESTINY System v1.0
