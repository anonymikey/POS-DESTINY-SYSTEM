# Deploying Your POS System to Vercel

This guide walks you through deploying your application to Vercel for production use.

## Prerequisites

- GitHub account (recommended, but not required)
- Vercel account (free at https://vercel.com)
- Supabase project set up (follow SUPABASE_SETUP_GUIDE.md)

## Option 1: Deploy via GitHub (Recommended)

### Step 1: Push Code to GitHub

1. Initialize a git repository in your project folder:
   ```bash
   git init
   git add .
   git commit -m "Initial POS system setup"
   ```

2. Create a new repository on GitHub (https://github.com/new)

3. Add remote and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/pos-system.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Connect to Vercel

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Select "Import Git Repository"
4. Find and select your GitHub repository
5. Click "Import"

### Step 3: Add Environment Variables

1. In the Vercel dashboard, go to your project
2. Click "Settings" → "Environment Variables"
3. Add your Supabase credentials:

   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: your_supabase_url
   ```

   ```
   Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: your_supabase_key
   ```

4. Click "Save"

### Step 4: Deploy

1. Click "Deploy" on the Vercel dashboard
2. Wait for the build to complete
3. Your app will be live at `your-project.vercel.app`

## Option 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
pnpm install -g vercel
```

### Step 2: Authenticate

```bash
vercel login
```

Follow the prompts to authenticate with your Vercel account.

### Step 3: Deploy

```bash
vercel --prod
```

This will:
- Build your application
- Ask for project settings (accept defaults)
- Deploy to production
- Provide your live URL

### Step 4: Add Environment Variables

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Paste your Supabase URL and press Enter

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Paste your Supabase API key and press Enter
```

Then redeploy:

```bash
vercel --prod
```

## Option 3: Deploy via v0 (Simplest)

If you're using v0.app:

1. Click the "Publish" button in the top right
2. Connect your Vercel account
3. Follow the prompts
4. Environment variables can be added after deployment

## Post-Deployment Checklist

After deployment, verify everything works:

### Functionality Tests

- [ ] Can access the main POS page
- [ ] Can browse products
- [ ] Can add items to cart
- [ ] Can proceed to checkout
- [ ] Can view admin dashboard
- [ ] Dashboard charts display correctly
- [ ] Can manage products
- [ ] Can manage orders
- [ ] Can manage customers
- [ ] Can manage categories
- [ ] Can view analytics
- [ ] Mobile view works properly

### Data Persistence Tests

- [ ] Orders are saved in Supabase
- [ ] Customers persist across sessions
- [ ] Inventory updates correctly
- [ ] Dashboard shows live data

### Performance Tests

- [ ] Page loads in under 3 seconds
- [ ] Charts render smoothly
- [ ] No console errors
- [ ] Mobile response is fast

### Security Tests

- [ ] Environment variables are not exposed
- [ ] API calls use HTTPS
- [ ] Supabase RLS policies work
- [ ] No sensitive data in logs

## Setting Up Auto-Deployment

Vercel automatically redeploys when you push to GitHub:

1. Make changes locally
2. Commit and push:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
3. Vercel automatically builds and deploys
4. Check deployment status in dashboard

## Domain Configuration

To use a custom domain:

1. In Vercel dashboard, go to "Settings" → "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel automatically provisions SSL certificate

## Environment Variables Reference

Required variables for production:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

Optional variables:

```
NEXT_PUBLIC_API_URL=your-api-url (if using custom API)
NODE_ENV=production (auto-set by Vercel)
```

## Troubleshooting Deployment

### Build Fails

```
Error: Cannot find module
```

Solution: Ensure all dependencies are listed in `package.json`

```bash
pnpm install
git add .
git commit -m "Update dependencies"
git push
```

### Environment Variables Not Working

- Verify variables are prefixed with `NEXT_PUBLIC_` for client-side use
- Redeploy after adding variables:
  ```bash
  vercel --prod
  ```

### Supabase Connection Issues

1. Verify URL and API key are correct
2. Check Supabase project is running
3. Ensure RLS policies are configured
4. Test connection in browser console:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
   ```

### Performance Issues

- Check Vercel Analytics (Settings → Analytics)
- Optimize images (already done with Next.js Image)
- Review database queries
- Check third-party scripts

## Monitoring Your Deployment

### Vercel Analytics

1. Go to "Settings" → "Analytics"
2. Monitor:
   - Page load times
   - Core Web Vitals
   - Error rates
   - Function execution time

### Supabase Monitoring

1. Go to Supabase dashboard
2. Check:
   - Database size
   - Query performance
   - API usage
   - Error logs

### Logs

View deployment logs:

```bash
vercel logs [project-name]
```

View real-time logs:

```bash
vercel logs [project-name] --follow
```

## Rolling Back to Previous Version

If something breaks after deployment:

1. In Vercel dashboard, go to "Deployments"
2. Find the previous working deployment
3. Click the deployment
4. Click "Promote to Production"

Or use CLI:

```bash
vercel --prod --skip-build
```

## Performance Optimization Tips

1. **Enable Caching**
   - Images are already optimized
   - Add cache headers in `vercel.json`:

   ```json
   {
     "headers": [
       {
         "source": "/api/(.*)",
         "headers": [
           { "key": "Cache-Control", "value": "public, max-age=60" }
         ]
       }
     ]
   }
   ```

2. **Database Optimization**
   - Add indexes (done in schema)
   - Optimize queries for production

3. **Bundle Optimization**
   - Next.js automatically optimizes
   - Check `Build size` in Vercel dashboard

## Production Best Practices

1. **Always Use Environment Variables**
   - Never hardcode secrets
   - Use Vercel's environment variables

2. **Enable HTTPS**
   - Vercel does this automatically
   - All traffic is encrypted

3. **Monitor Errors**
   - Set up error tracking (e.g., Sentry)
   - Check Vercel logs regularly

4. **Regular Backups**
   - Enable Supabase backups
   - Verify data integrity

5. **Update Dependencies**
   - Check for updates monthly
   - Test before deploying
   - Keep Next.js updated

## Getting Help

If you encounter issues:

1. Check Vercel documentation: https://vercel.com/docs
2. Check Supabase documentation: https://supabase.com/docs
3. Review error logs in Vercel dashboard
4. Open issue on GitHub (if using GitHub deployment)

## Success Indicators

Your deployment is successful when:

✅ App loads without errors
✅ Dashboard shows real data with charts
✅ Can create/read/update/delete data
✅ Mobile version works correctly
✅ Page loads in under 3 seconds
✅ No console errors
✅ Supabase connection is live
✅ Custom domain works (if configured)

---

**Congratulations! Your POS system is now live on Vercel! 🎉**

Your application is now accessible globally and automatically scales with Vercel's infrastructure.
