# Supabase Setup Guide for POS System

This guide will walk you through setting up Supabase for your POS system.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in the details:
   - **Name**: Choose any name (e.g., "POS-System")
   - **Database Password**: Save this securely, you'll need it
   - **Region**: Choose the closest region to you
   - **Pricing Plan**: Start with Free tier (sufficient for testing)
5. Click "Create new project" and wait for it to initialize (5-10 minutes)

## Step 2: Create the Database Schema

1. In your Supabase dashboard, go to the **SQL Editor** section
2. Click "New Query"
3. Copy the entire content from `DATABASE_SCHEMA.sql` file
4. Paste it into the SQL editor
5. Click "Run" to execute all the SQL commands
6. Wait for completion - you should see a success message

## Step 3: Get Your Credentials

1. Go to **Settings** → **API**
2. Copy and save these values:
   - **Project URL** (also called supabase_url)
   - **API Key** (the anon public key)
3. Also note your **Project ID** from the URL

## Step 4: Create Environment Variables

Add these to your Vercel project settings:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Or if deploying locally, add to `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Step 5: Install Supabase Client

Run in your project:

```bash
pnpm add @supabase/supabase-js
```

## Step 6: Update Your Database Service

Replace your `app/services/database.ts` with the Supabase version (will be provided).

## Database Schema Overview

### Tables Created:

- **users** - Authentication and user management
- **customers** - Customer information and loyalty tracking
- **categories** - Product categories
- **inventory** - Products/items with stock tracking
- **orders** - Order headers with totals
- **order_items** - Individual items in each order
- **transactions** - Payment transactions
- **store_settings** - Store configuration
- **audit_logs** - System activity logs

### Key Features:

- Row Level Security (RLS) enabled
- Automatic timestamps (created_at, updated_at)
- Foreign key relationships
- Proper indexes for performance
- Default categories pre-loaded

## Testing the Connection

After setup, test the connection by:

1. Going to the admin dashboard
2. Try to load a page with data
3. Check browser console for any errors
4. In Supabase, go to **SQL Editor** → **Schema** to verify tables exist

## Important Notes

- **Free tier limits**: 500MB storage, suitable for development/testing
- **Backups**: Supabase automatically backs up your database
- **Scaling**: Can upgrade plan anytime as you grow
- **Security**: Always use Row Level Security for production
- **API Rate Limits**: Free tier has 100 requests/second

## Troubleshooting

### Connection Issues
- Verify environment variables are set
- Check that your Supabase project is running
- Ensure firewall allows connections

### RLS Errors
- Make sure you're authenticated
- Check RLS policies are correctly set
- Admin users might need special policies

### Missing Tables
- Re-run the DATABASE_SCHEMA.sql file
- Check SQL editor output for errors
- Verify no syntax errors in the SQL

## Next Steps

1. Update your API layer to use Supabase client
2. Migrate localStorage data to Supabase
3. Add proper error handling
4. Test all CRUD operations
5. Set up authentication flow
6. Configure RLS policies for production
