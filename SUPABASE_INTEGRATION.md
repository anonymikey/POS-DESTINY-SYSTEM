# Supabase Integration Guide

Your POS system includes seamless Supabase integration with automatic localStorage fallback. This guide explains how to integrate Supabase with your application.

## Architecture

The system uses a hybrid approach:
- **With Supabase**: All data syncs to PostgreSQL cloud database
- **Without Supabase**: Falls back to localStorage (perfect for testing)
- **Automatic switching**: No code changes needed when enabling/disabling

## Quick Setup

### 1. Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Create new project
4. Save your credentials:
   - Project URL
   - Anon API Key

### 2. Run Database Schema

1. In Supabase dashboard, go to SQL Editor
2. Create new query
3. Copy entire content from `DATABASE_SCHEMA.sql`
4. Paste and execute
5. Wait for all tables to be created

### 3. Add Environment Variables

Create `.env.local` in project root:

```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

Or in Vercel Settings → Environment Variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Restart Development Server

```bash
pnpm dev
```

Your app will now use Supabase! Data syncs automatically.

## How It Works

### Database Service

The system provides a unified database service (`supabase-db.ts`) that handles both Supabase and localStorage:

```typescript
import {
  customerService,
  productService,
  orderService,
  categoryService,
} from "@/services/supabase-db"

// Use like normal - works with or without Supabase
const customers = await customerService.getAll()
const order = await orderService.create(newOrder)
```

### Automatic Detection

The service automatically detects if Supabase is configured:

```typescript
const USE_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL
```

If environment variables are set, Supabase is used. Otherwise, localStorage is used.

### Services Included

#### customerService
- `getAll()` - Fetch all customers
- `create(customer)` - Create new customer
- `update(id, updates)` - Update customer
- `delete(id)` - Delete customer

#### productService
- `getAll()` - Fetch all products
- `getByCategory(categoryId)` - Filter by category
- `create(product)` - Create product
- `update(id, updates)` - Update product
- `delete(id)` - Delete product

#### orderService
- `getAll()` - Fetch all orders with items
- `create(order)` - Create order with items
- `update(id, updates)` - Update order status

#### categoryService
- `getAll()` - Fetch all categories
- `create(category)` - Create category
- `update(id, updates)` - Update category

## Usage Examples

### Using in Components

```typescript
import { customerService } from "@/services/supabase-db"
import { useEffect, useState } from "react"

export function Customers() {
  const [customers, setCustomers] = useState([])

  useEffect(() => {
    customerService.getAll().then(setCustomers)
  }, [])

  return (
    <div>
      {customers.map(customer => (
        <div key={customer.id}>{customer.name}</div>
      ))}
    </div>
  )
}
```

### Creating Records

```typescript
import { orderService } from "@/services/supabase-db"

const newOrder = await orderService.create({
  customer_name: "John Doe",
  total: 100,
  subtotal: 90,
  discount_amount: 0,
  tax_amount: 10,
  payment_method: "cash",
  status: "completed",
  items: [
    {
      product_name: "Coffee",
      quantity: 2,
      unit_price: 5,
      total: 10,
      product_id: "123",
      id: "1",
      order_id: "",
      created_at: new Date().toISOString(),
    },
  ],
})
```

### Updating Records

```typescript
import { customerService } from "@/services/supabase-db"

const updated = await customerService.update("customer-id", {
  loyalty_points: 100,
  total_spent: 500,
})
```

## Verifying Connection

### In Browser Console

```typescript
// Check if Supabase is configured
import { dbHealthCheck } from "@/services/supabase-db"

console.log(dbHealthCheck.isSupabaseConnected()) // true or false

// Test connection
const health = await dbHealthCheck.test()
console.log(health) // { supabase: true/false, localStorage: true }
```

### In Your App

All data operations will automatically use Supabase if configured, or fall back to localStorage.

## Migrating Data to Supabase

When you first enable Supabase:

1. Existing localStorage data remains in browser
2. You can either:
   - Start fresh with Supabase (recommended)
   - Manually migrate localStorage data

### Manual Migration

```typescript
// Export from localStorage
const data = JSON.parse(localStorage.getItem('products'))

// Import to Supabase
for (const item of data) {
  await productService.create(item)
}

// Clear localStorage (optional)
localStorage.removeItem('products')
```

## Security Considerations

### Row Level Security (RLS)

The database schema includes RLS policies. For production:

1. Enable authentication
2. Update RLS policies in Supabase
3. Use auth tokens instead of anon key

```sql
-- Example: Users can only read their own data
CREATE POLICY "Users can read own data" ON customers
  FOR SELECT USING (
    auth.uid() = user_id
  );
```

### Environment Variables

- **Never commit** `.env.local` to git
- Use Vercel Settings for deployed apps
- Keep API keys private
- Rotate keys periodically

## Troubleshooting

### Connection Issues

**Error: Cannot connect to Supabase**

1. Verify URL and API key are correct
2. Check Supabase project is active
3. Ensure network allows connections
4. Check browser console for errors

**Solution:**
```bash
# Test in Node REPL
import { supabase } from "@/services/supabase-client"
const { data, error } = await supabase.from('categories').select('count')
console.log(error) // Shows connection errors
```

### Missing Tables

**Error: Relation does not exist**

The database schema hasn't been run. Do this:

1. Copy `DATABASE_SCHEMA.sql`
2. Paste in Supabase SQL Editor
3. Execute
4. Refresh your app

### RLS Errors

**Error: new row violates row-level security policy**

RLS policies are preventing writes. Disable for development:

1. Go to Supabase dashboard
2. Find the table
3. Click "RLS"
4. Click "Disable RLS" (for development only)

For production, configure proper RLS policies.

### Data Not Syncing

**localStorage data isn't in Supabase**

They're separate storage systems. To migrate:

1. Enable Supabase (set env vars)
2. Your new data goes to Supabase
3. Old localStorage data remains in browser
4. Clear localStorage when ready:
   ```typescript
   localStorage.clear()
   ```

## Performance Tips

### Optimize Queries

```typescript
// Good: Only select needed fields
const { data } = await supabase
  .from('products')
  .select('id, name, price')

// Less good: Select everything
const { data } = await supabase
  .from('products')
  .select('*')
```

### Caching

Implement caching for frequently accessed data:

```typescript
const cache = new Map()

export async function getCategoriesWithCache() {
  if (cache.has('categories')) {
    return cache.get('categories')
  }
  
  const categories = await categoryService.getAll()
  cache.set('categories', categories)
  return categories
}
```

### Batch Operations

For multiple inserts:

```typescript
const items = [...] // array of items

// Better than looping with individual inserts
const { data } = await supabase
  .from('order_items')
  .insert(items)
```

## Monitoring

### Supabase Dashboard

Monitor your usage:

1. Go to Supabase project
2. Check **Usage** for:
   - Database size
   - Query count
   - API calls
   - Active users

### Logs

View errors:

1. Go to **Logs** section
2. Check recent activity
3. Debug issues

## Advanced Configuration

### Custom Auth

For user authentication beyond demo:

```typescript
import { supabase } from "@/services/supabase-client"

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Get current user
const { data: { user } } = await supabase.auth.getUser()
```

### Realtime Subscriptions

Listen for changes:

```typescript
const subscription = supabase
  .from('orders')
  .on('*', payload => {
    console.log('Order updated:', payload)
  })
  .subscribe()

// Cleanup
subscription.unsubscribe()
```

### Custom Functions

Create stored procedures:

```sql
CREATE FUNCTION get_sales_summary()
RETURNS TABLE (
  total_sales numeric,
  order_count integer,
  avg_order_value numeric
) AS $$
  SELECT
    SUM(total) as total_sales,
    COUNT(*) as order_count,
    AVG(total) as avg_order_value
  FROM orders;
$$ LANGUAGE SQL;
```

Use from app:

```typescript
const { data } = await supabase.rpc('get_sales_summary')
```

## Pricing & Limits

### Free Tier
- 500MB database storage
- 1GB bandwidth/month
- 100,000 rows
- Perfect for testing

### Paid Tier
- 100GB+ storage (scales)
- Higher bandwidth
- Unlimited rows
- Priority support

## Next Steps

1. **Set up Supabase** - Follow "Quick Setup" above
2. **Test connection** - Run health check
3. **Verify data** - Check Supabase dashboard
4. **Deploy** - Push to Vercel with env vars
5. **Monitor** - Watch usage in Supabase

## Disable Supabase (Fallback to localStorage)

To temporarily disable Supabase:

1. Remove `NEXT_PUBLIC_SUPABASE_URL` env var
2. App automatically uses localStorage
3. All data stored locally
4. Perfect for testing without Supabase

## Files

- `app/services/supabase-client.ts` - Client initialization
- `app/services/supabase-db.ts` - Database services
- `DATABASE_SCHEMA.sql` - Database schema
- `SUPABASE_SETUP_GUIDE.md` - Setup instructions

## Support

For issues:

1. Check Supabase docs: https://supabase.com/docs
2. Check RLS policies
3. View Supabase logs
4. Verify environment variables
5. Test in browser console
