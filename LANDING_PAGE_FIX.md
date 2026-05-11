# Landing Page Fix Guide

## Problem

The landing page appears blank/black when deployed to Vercel, even though it works fine locally.

## Root Causes

1. **Missing Environment Variables** - The app needs Supabase variables to initialize
2. **Motion Library Hydration** - The `motion/react` library may have issues rendering server-side
3. **Missing CSS Classes** - The page relies on animations that might not load in time

## Solution: Add Environment Variables to Vercel

The landing page uses animations from the `motion` library, which loads fine locally but may have timing issues in production. More importantly, **the entire app requires Supabase credentials to function**.

### Required Steps:

1. **Go to Vercel Dashboard**
   - Navigate to https://vercel.com/dashboard
   - Select your `pos-destiny-system` project

2. **Add Environment Variables**
   - Click **Settings** in the top navigation
   - Click **Environment Variables** on the left sidebar
   - Add these two variables:

```
Variable 1:
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project.supabase.co
(Get this from Supabase dashboard → Settings → API → Project URL)

Variable 2:
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5...
(Get this from Supabase dashboard → Settings → API → anon public key)
```

3. **Redeploy**
   - After adding variables, click **Redeploy** in the Vercel dashboard
   - Or run: `vercel --prod`
   - Wait for deployment to complete

4. **Verify**
   - Visit: `https://pos-destiny-system.vercel.app/landing`
   - You should now see the full landing page with logo, text, and features

## If Landing Page Still Shows Blank

If the page is still blank after adding environment variables, try these steps:

### Option 1: Clear Browser Cache

1. Hard refresh your browser:
   - **Windows**: Press `Ctrl + Shift + R`
   - **Mac**: Press `Cmd + Shift + R`

2. Or open in incognito/private mode

### Option 2: Check Vercel Deployment Logs

1. Go to Vercel dashboard
2. Click **Deployments** tab
3. Find the latest deployment
4. Click it to see build logs
5. Look for any error messages

### Option 3: Check Browser Console

1. Visit your landing page
2. Press **F12** to open Developer Tools
3. Click **Console** tab
4. Look for red error messages
5. Common errors:
   - `Cannot find module 'motion/react'` → Dependencies not installed
   - `NEXT_PUBLIC_SUPABASE_URL is undefined` → Missing env vars
   - `Hydration mismatch` → Restart and clear cache

### Option 4: Use Simplified Landing Page

If animations are causing issues, you can switch to a simpler version:

1. Create `app/landing/page.simple.tsx` with basic HTML (no animations)
2. Test if that renders
3. If it does, the issue is animation-related

Example simple landing page:
```tsx
'use client'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold">DESTINY</h1>
        <p className="text-xl text-white/60">Enterprise POS System</p>
        <div className="flex gap-4 mt-8">
          <button className="bg-white text-black px-6 py-2 rounded-lg font-semibold">
            Employee Access
          </button>
          <button className="border border-white/50 px-6 py-2 rounded-lg">
            Admin Access
          </button>
        </div>
      </div>
    </div>
  )
}
```

## Permanent Fix: Motion Library Configuration

The `motion/react` library (v12.38.0) is installed but may need proper Vercel configuration.

### Update `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize motion library
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve?.fallback,
          fs: false,
          path: false,
          crypto: false,
        },
      };
    }
    return config;
  },
  
  // Experimental features for better motion support
  experimental: {
    optimizePackageImports: ['motion'],
  },
};

module.exports = nextConfig;
```

Then redeploy:
```bash
vercel --prod
```

## Checklist for Full Fix

- [ ] Add `NEXT_PUBLIC_SUPABASE_URL` to Vercel env vars
- [ ] Add `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel env vars
- [ ] Redeploy project to Vercel
- [ ] Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
- [ ] Check landing page loads correctly
- [ ] Verify no red errors in browser console (F12)
- [ ] Test Admin Access button works
- [ ] Test Employee Access button works

## Quick Test Commands

```bash
# Check if dependencies installed locally
npm list motion

# Build locally to test
npm run build

# Preview production build locally
npm run start
```

## Still Having Issues?

**Check Vercel Logs**:
```bash
vercel logs [project-name]
```

**Test Supabase Connection**:
```bash
# In browser console:
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20))
```

**Check build output**:
```bash
npm run build
```

## Related Documents

- See `VERCEL_ENV_REQUIREMENTS.md` for complete environment variable setup
- See `DEPLOYMENT_TO_VERCEL.md` for full deployment guide
- See `SUPABASE_INTEGRATION.md` for database integration details
