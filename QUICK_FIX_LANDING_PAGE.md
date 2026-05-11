# Quick Fix: Landing Page Blank on Vercel

## The Problem
Your landing page shows a blank/black screen at `pos-destiny-system.vercel.app/landing`

## The Solution
Add Supabase credentials to Vercel environment variables (it takes 2 minutes).

---

## STEP-BY-STEP FIX (Copy & Paste Ready)

### STEP 1: Get Your Supabase Credentials

1. Open https://supabase.com/dashboard
2. Click your POS project
3. Click **Settings** (bottom of left menu)
4. Click **API** (in the tabs)
5. **Copy these two values**:
   - Project URL (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - anon public key (long string starting with `eyJ...`)

### STEP 2: Add to Vercel

1. Go to https://vercel.com/dashboard  
2. Click your **pos-destiny-system** project
3. Click **Settings** (top right)
4. Click **Environment Variables** (left sidebar)
5. Click **Add New** and paste:

**First Variable:**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: (paste your Project URL from step 1)
Environment: Production
Click Save
```

**Second Variable:**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: (paste your anon key from step 1)
Environment: Production
Click Save
```

### STEP 3: Redeploy

1. Go to Vercel dashboard
2. Click **Redeploy** button (top right)
3. Wait for deployment to complete (usually 1-2 minutes)

### STEP 4: Test

1. Open: https://pos-destiny-system.vercel.app/landing
2. You should now see:
   - Dark themed page
   - "DESTINY" logo at top
   - "Your supermarket. Unified." headline
   - Buttons to login
   - Features section

**If it still shows blank:**
- Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac) to hard refresh
- Or open in incognito/private window

---

## All Required Environment Variables for Vercel

### REQUIRED (Must have these)
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### OPTIONAL (Not needed, but useful)
```
NEXT_PUBLIC_API_URL (if you have custom API)
```

### AUTO-SET (Vercel sets these automatically)
```
NODE_ENV (automatically = "production")
VERCEL_ENV (automatically = "production")
```

---

## Common Issues & Fixes

### "Page is still blank"
- [ ] Check you added BOTH variables (URL AND Key)
- [ ] Make sure you clicked "Save" after adding each one
- [ ] Did you click "Redeploy"? (Important!)
- [ ] Hard refresh: Ctrl+Shift+R or Cmd+Shift+R
- [ ] Try incognito/private browser window

### "Got 'anon key' but it doesn't work"
- Make sure it's the **anon public key** (not service_role key)
- The anon key starts with `eyJ...`
- Copy the exact full string with no spaces

### "Got URL but don't see 'supabase.co' in it"
- Project URL must look like: `https://xxxxx.supabase.co`
- Don't use custom API endpoints
- Copy from: Supabase dashboard → Settings → API → "Project URL"

---

## Verify It's Working

### Test 1: Landing Page Loads
```
✅ URL: pos-destiny-system.vercel.app/landing
✅ Shows dark page with DESTINY logo
✅ Shows "Your supermarket. Unified." text
✅ Has buttons to click
```

### Test 2: Can Click Buttons
```
✅ Click "Employee Access" → redirects to POS page
✅ Click "Admin Access" → redirects to admin dashboard
```

### Test 3: No Console Errors
```
1. Open landing page
2. Press F12 (open Developer Tools)
3. Click "Console" tab
4. ✅ No red error messages
5. ✅ No messages about "undefined" or "Supabase"
```

---

## Environment Variable Reference

| Variable | Where It Comes From | What It Looks Like | Notes |
|----------|-------------------|-------------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API | `https://abc123.supabase.co` | Copy "Project URL" |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API | `eyJhbGciOiJIUzI1NiIs...` | Copy "anon public" key |

**❌ DO NOT use:**
- Service role key (that's for server-side only)
- Custom domain URL (use supabase.co URL)
- Anything from "Database Password"

---

## After Landing Page is Fixed

1. ✅ Test admin dashboard loads
2. ✅ Test you can add products
3. ✅ Test you can create orders
4. ✅ Monitor Supabase usage on dashboard
5. ✅ Set up custom domain (optional)

---

## Still Need Help?

### Resources
- Full guide: `VERCEL_ENV_REQUIREMENTS.md` (in project root)
- Troubleshooting: `LANDING_PAGE_FIX.md` (in project root)
- Deployment: `DEPLOYMENT_TO_VERCEL.md` (in project root)

### Support Links
- Vercel Help: https://vercel.com/help
- Supabase Docs: https://supabase.com/docs
- Check project docs folder for more files

### Debug Commands
```bash
# Check if variables are set (in browser console):
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20))
```

---

**That's it! Your landing page should be working now. Good luck! 🚀**
