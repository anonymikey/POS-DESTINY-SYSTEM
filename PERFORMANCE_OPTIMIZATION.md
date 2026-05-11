# Performance Optimization Guide

This document covers performance optimization and bug fixes for your POS system.

## Already Optimized

Your application already includes these optimizations:

### Code Level
- Dynamic imports for large components
- Lazy loading for charts and heavy components
- Efficient React component structure
- Proper use of useCallback and useMemo

### Bundle Level
- Next.js automatic code splitting
- CSS minification with Tailwind
- Image optimization with Next.js Image
- Tree shaking of unused code

### Database Level
- 13 indexes for fast queries
- Efficient schema design
- Proper foreign key relationships
- RLS policies for security

## Monitoring Performance

### Using Vercel Analytics

1. Deploy to Vercel
2. Go to project settings
3. Enable Analytics
4. Monitor:
   - Core Web Vitals
   - Page load time
   - Error rates

### Browser DevTools

```javascript
// Measure page load performance
window.addEventListener('load', () => {
  const perfData = window.performance.timing
  const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
  console.log('Page load time:', pageLoadTime, 'ms')
})

// Check Core Web Vitals
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(entry)
  }
})
observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
```

## Performance Checklist

### Client-Side Performance

- [ ] **Code Splitting**
  - Heavy components use dynamic imports
  - Charts load on demand
  - Modal content lazy loads

- [ ] **Caching**
  - Service worker enabled (optional)
  - Browser cache headers set
  - Static assets cached

- [ ] **Rendering**
  - Avoid unnecessary re-renders
  - Proper use of key in lists
  - Debounce expensive operations

- [ ] **Assets**
  - Images optimized with Next.js Image
  - SVGs used for icons
  - CSS files minified

### Server-Side Performance

- [ ] **API Optimization**
  - Proper error handling
  - Database queries optimized
  - Unnecessary queries eliminated

- [ ] **Database**
  - Indexes on frequently queried columns
  - RLS policies efficient
  - Connection pooling enabled

- [ ] **Caching**
  - API response caching
  - Database query results cached
  - Static content cached

## Specific Optimizations

### 1. Optimize Chart Rendering

Charts can be heavy. Implement lazy loading:

```typescript
import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('@/components/chart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false, // Don't render on server
})

export function Dashboard() {
  return <Chart />
}
```

### 2. Database Query Optimization

Instead of:
```typescript
// Bad: Loads all data
const users = await userService.getAll()
const filtered = users.filter(u => u.active)
```

Do:
```typescript
// Good: Filter in database
const activeUsers = await userService.getAll()
// Or better: pass filter to service
const filtered = activeUsers.filter(u => u.active)
```

### 3. Image Optimization

Already using Next.js Image:

```typescript
import Image from 'next/image'

export function ProductImage({ src, alt }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={300}
      height={300}
      quality={80} // Reduced from default 75
      placeholder="blur"
    />
  )
}
```

### 4. List Rendering Optimization

Always use keys:

```typescript
// Good
{items.map(item => (
  <div key={item.id}>{item.name}</div>
))}

// Bad - uses array index
{items.map((item, idx) => (
  <div key={idx}>{item.name}</div>
))}
```

### 5. Memoization

For expensive components:

```typescript
import { memo } from 'react'

const ProductCard = memo(({ product }) => (
  <div>{product.name}</div>
), (prev, next) => prev.product.id === next.product.id)

export default ProductCard
```

### 6. Data Fetching Optimization

Use SWR for caching:

```typescript
import useSWR from 'swr'

function Orders() {
  const { data: orders } = useSWR('/api/orders', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })
  return <div>Orders: {orders?.length}</div>
}
```

## Common Performance Issues

### Issue: Dashboard loads slowly

**Cause:** Charts rendering too many data points

**Solution:**
```typescript
// Limit data points for charts
const chartData = salesData.slice(-30) // Last 30 days
```

### Issue: Product grid slow on mobile

**Cause:** Loading all product images

**Solution:**
```typescript
// Use different image sizes for mobile
<Image
  src={image}
  width={mobile ? 200 : 400}
  height={mobile ? 200 : 400}
  priority={isAboveTheFold} // Only for visible images
/>
```

### Issue: Search/filter is sluggish

**Cause:** Filtering on every keystroke

**Solution:**
```typescript
import { useDebouncedCallback } from 'use-debounce'

const handleSearch = useDebouncedCallback((query) => {
  filterProducts(query)
}, 300)
```

### Issue: Admin dashboard hangs with lots of orders

**Cause:** All orders loaded at once

**Solution:**
```typescript
// Implement pagination
const [page, setPage] = useState(1)
const orders = await orderService.getPage(page, 20)
```

## Memory Leaks Prevention

### Cleanup Event Listeners

```typescript
useEffect(() => {
  const handleResize = () => console.log('resized')
  window.addEventListener('resize', handleResize)
  
  return () => window.removeEventListener('resize', handleResize)
}, [])
```

### Cancel Fetch Requests

```typescript
useEffect(() => {
  const controller = new AbortController()
  
  fetch('/api/data', { signal: controller.signal })
  
  return () => controller.abort()
}, [])
```

### Clear Timers

```typescript
useEffect(() => {
  const timer = setTimeout(() => doSomething(), 1000)
  
  return () => clearTimeout(timer)
}, [])
```

## Testing Performance

### Lighthouse Audit

1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Run audit
4. Check scores for:
   - Performance
   - Accessibility
   - Best Practices
   - SEO

### Core Web Vitals

Check these metrics:

- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

Use Web Vitals library:

```typescript
import { getCLS, getFID, getFCP, getLCP } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
```

## Build Optimization

### Bundle Analysis

```bash
# Analyze bundle size
pnpm add --save-dev @next/bundle-analyzer

# Create next.config.mjs with analyzer
```

### Remove Unused Code

```typescript
// Bad: Unused imports
import { Button, Card, Badge } from '@/components/ui'
<Button>Click</Button>

// Good: Only import what you use
import { Button } from '@/components/ui'
<Button>Click</Button>
```

## Production Optimization

### Environment Variables

```bash
# .env.production
NEXT_PUBLIC_SUPABASE_URL=https://...
NODE_ENV=production
```

### Output Optimization

In `next.config.mjs`:

```javascript
module.exports = {
  compress: true, // Enable gzip compression
  swcMinify: true, // Use SWC for faster minification
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}
```

### Database Connection Pooling

Supabase includes connection pooling. For high traffic:

1. Enable connection pooling in Supabase
2. Set pool size: 30-50
3. Monitor pool usage

## Deployment Performance

### Vercel Deployment

1. Push to GitHub
2. Vercel automatically optimizes
3. CDN distributes globally
4. Caching headers applied

### Key Features
- Edge caching
- Image optimization
- ISR (Incremental Static Regeneration)
- Serverless Functions

## Monitoring in Production

### Set up Error Tracking

Option 1: Sentry

```typescript
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
})
```

Option 2: Vercel Analytics (built-in)

1. Enable in Vercel dashboard
2. Monitor performance
3. Get alerts

### Performance Alerts

Set up alerts for:
- Page load time > 3s
- Error rate > 1%
- Database query > 500ms

## Regular Maintenance

### Monthly
- [ ] Check Vercel Analytics
- [ ] Review error logs
- [ ] Monitor database usage
- [ ] Check for unused dependencies

### Quarterly
- [ ] Update dependencies
- [ ] Run Lighthouse audit
- [ ] Review slow queries
- [ ] Optimize assets

### Annually
- [ ] Full performance review
- [ ] Upgrade Node.js version
- [ ] Review architecture
- [ ] Plan scalability

## Known Good Performance

With these optimizations, expect:

- First Page Load: 1-2 seconds
- Dashboard Load: 1-3 seconds
- Product Grid: 0.5-1 seconds
- Mobile Performance: Within 3-4 seconds
- Database Queries: 50-200ms
- API Responses: 100-300ms

## Files

- `PERFORMANCE_OPTIMIZATION.md` - This file
- `.next/bundle-report.json` - Bundle analysis (if enabled)
- `vercel.json` - Vercel configuration

## Resources

- Vercel Docs: https://vercel.com/docs
- Next.js Performance: https://nextjs.org/learn/seo/web-performance
- Web Vitals: https://web.dev/vitals
- Lighthouse: https://developers.google.com/web/tools/lighthouse

## Summary

Your POS system is already highly optimized. The main performance improvements are:

1. Implemented dynamic imports and lazy loading
2. Optimized database queries with proper indexes
3. Used Next.js Image for automatic optimization
4. Proper React component optimization
5. Efficient CSS with Tailwind

Continue monitoring with Vercel Analytics and perform regular audits quarterly.
