# POS System - Point of Sale Application

A modern, fully-featured Point of Sale (POS) system built with Next.js, React, Tailwind CSS, and Recharts. Perfect for retail shops, restaurants, cafes, and small businesses.

## Features

### Customer-Facing POS
- Browse products by category
- Add items to shopping cart
- Real-time cart updates
- Customer information collection
- Apply discount codes
- Multiple payment methods
- Responsive mobile design
- Quick checkout process

### Admin Dashboard
- **Real-time Analytics**
  - Revenue and order tracking
  - Sales trend charts (7-day)
  - Top selling products visualization
  - Inventory breakdown by category
  - Low stock alerts

- **Product Management**
  - Add/Edit/Delete products
  - Grid and table view options
  - Stock level tracking
  - Cost and profit margin calculations
  - Category organization
  - Supplier information

- **Order Management**
  - Complete order history
  - Order status workflow (pending → completed)
  - Order details and itemization
  - Customer association
  - Transaction tracking

- **Customer Management**
  - Customer profiles with history
  - Loyalty points tracking
  - Contact information management
  - Purchase history per customer
  - Repeat customer identification

- **Inventory Management**
  - Real-time stock tracking
  - Low stock threshold alerts
  - Category-wise inventory breakdown
  - Product cost and selling price management

- **Settings & Configuration**
  - Store information management
  - Tax rate configuration
  - Currency and timezone settings
  - Feature toggles
  - Notification preferences

## Tech Stack

### Frontend
- **Next.js 15.2.6** - React framework with server-side rendering
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **Shadcn/UI** - Pre-built, customizable components (70+ components)
- **Recharts** - Data visualization and charts
- **Lucide Icons** - Beautiful icon library

### Backend & Data
- **Supabase** - PostgreSQL database with real-time capabilities
- **localStorage** - Browser storage for testing/offline mode
- **Row Level Security (RLS)** - Database security policies

### Deployment
- **Vercel** - Recommended hosting platform (auto-scaling, CDN, serverless)
- **GitHub** - Version control and CI/CD integration

## Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- GitHub account (for deployment)
- Supabase account (for production data)

### Installation

```bash
# Clone or download the project
cd pos-system

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Navigate to http://localhost:3000 to see the application.

### Directory Structure

```
pos-system/
├── app/
│   ├── admin/                 # Admin dashboard and management pages
│   │   ├── page.tsx          # Dashboard with charts
│   │   ├── products/         # Product management
│   │   ├── orders/           # Order management
│   │   ├── customers/        # Customer management
│   │   ├── categories/       # Category management
│   │   ├── analytics/        # Analytics and reporting
│   │   ├── settings/         # Store settings
│   │   └── layout.tsx        # Admin layout with sidebar
│   ├── components/            # Reusable components
│   │   ├── mobile-cart-drawer.tsx
│   │   ├── mobile-category-selector.tsx
│   │   ├── product-grid.tsx
│   │   ├── cart-sidebar.tsx
│   │   ├── category-sidebar.tsx
│   │   └── [other components]
│   ├── context/               # React context for state
│   │   └── cart-context.tsx
│   ├── data/                  # Static data
│   │   ├── products.tsx
│   │   └── categories.tsx
│   ├── services/              # API and database services
│   │   └── database.ts
│   ├── page.tsx              # Main POS page
│   ├── checkout/             # Checkout page
│   ├── success/              # Order success page
│   └── layout.tsx            # Root layout
├── components/
│   └── ui/                   # Shadcn UI components (auto-generated)
├── public/                   # Static assets and images
├── styles/                   # Global styles
├── DATABASE_SCHEMA.sql       # Supabase database schema
├── SUPABASE_SETUP_GUIDE.md   # Supabase setup instructions
├── DEPLOYMENT_TO_VERCEL.md   # Deployment guide
├── IMPLEMENTATION_SUMMARY.md # Features summary
└── package.json              # Dependencies
```

## Usage

### For Customers

1. **Browse Products**
   - Select category from sidebar (desktop) or menu (mobile)
   - Click product to add to cart

2. **Checkout**
   - View cart and modify quantities
   - Select or add customer information
   - Apply discount codes
   - Complete payment

3. **Mobile Experience**
   - Touch-optimized buttons
   - Slide-out cart drawer
   - Full-screen category selector

### For Administrators

1. **Dashboard**
   - View real-time KPIs and charts
   - Monitor recent orders
   - Check low stock items
   - Analyze sales trends

2. **Product Management**
   - Add new products with details
   - Update stock levels
   - Set prices and costs
   - Manage categories

3. **Order Management**
   - View all orders
   - Update order status
   - View detailed order information
   - Track customer purchases

4. **Customer Management**
   - Create customer profiles
   - Track loyalty points
   - View purchase history
   - Manage contact information

5. **Settings**
   - Configure store information
   - Set tax rates
   - Enable/disable features
   - Manage notifications

## Database Setup

### Using localStorage (Testing)
The app works out-of-the-box with localStorage. All data is stored locally in the browser.

### Using Supabase (Production)

1. **Read**: `SUPABASE_SETUP_GUIDE.md` for detailed setup instructions
2. **Copy**: SQL schema from `DATABASE_SCHEMA.sql`
3. **Create**: Supabase project and run SQL
4. **Configure**: Environment variables
5. **Integrate**: Update database service

See `DATABASE_SCHEMA.sql` for complete schema details.

## Deployment

### Deploy to Vercel (Recommended)

1. **Read**: `DEPLOYMENT_TO_VERCEL.md` for complete instructions
2. **Push**: Code to GitHub
3. **Connect**: GitHub to Vercel
4. **Configure**: Environment variables
5. **Deploy**: One-click deployment

### Environment Variables

For production deployment, add these to Vercel:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
```

## Configuration

### Store Settings

Store information can be configured in `/admin/settings`:
- Store name, email, phone, address
- Tax rate and currency
- Timezone and language
- Feature toggles

### Database Configuration

Located in `app/services/database.ts`:
- Switch between localStorage and Supabase
- Configure API endpoints
- Set cache strategies

### Tailwind CSS

Customization in `tailwind.config.ts`:
- Color schemes
- Font families
- Spacing
- Breakpoints

## Features in Detail

### Mobile-First Design
- Responsive breakpoints: sm, md, lg, xl
- Touch-optimized controls
- Mobile drawer for cart
- Simplified navigation

### Real-time Analytics
- Dynamic KPI cards with live data
- Interactive charts (Line, Bar, Pie)
- 7-day sales trends
- Category breakdown
- Top products ranking

### Security
- Row Level Security (RLS) in database
- Secure API communication
- Environment variable protection
- No hardcoded secrets

### Performance
- Optimized images with Next.js Image component
- Lazy loading with Recharts
- CSS optimization with Tailwind
- IndexedDB support for offline data

## Testing Checklist

- [ ] Add products and create orders
- [ ] Verify dashboard charts display data
- [ ] Test mobile responsiveness
- [ ] Check admin CRUD operations
- [ ] Validate form inputs
- [ ] Test order status updates
- [ ] Verify customer data persistence
- [ ] Check inventory tracking
- [ ] Test discount application
- [ ] Validate payment methods

## Troubleshooting

### Common Issues

**Charts not displaying**
- Clear browser cache
- Check browser console for errors
- Verify data exists in localStorage

**Mobile layout broken**
- Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
- Check viewport meta tag in layout.tsx
- Test in different browsers

**Data not saving**
- Check browser localStorage is enabled
- Verify localStorage hasn't reached quota
- Check browser console for errors

**Supabase connection failed**
- Verify environment variables are set
- Check Supabase project is running
- Ensure RLS policies are configured

## Performance Optimization

### Already Implemented
- Next.js image optimization
- CSS minification
- Code splitting and lazy loading
- Responsive image sizing
- Efficient chart rendering

### Recommended Improvements
- Enable database indexes (done in schema)
- Set up caching headers
- Implement pagination for large datasets
- Add service worker for offline mode
- Set up CDN distribution

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

To contribute improvements:

1. Create a new branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - feel free to use for commercial projects

## Support

For issues or questions:

1. Check documentation files
2. Review error messages in console
3. Check Vercel/Supabase status pages
4. Consult official documentation

## Roadmap

Future features:
- Email/SMS notifications
- Advanced reporting and exports
- Loyalty program features
- Multi-location support
- Staff management and permissions
- Barcode scanning
- Receipt printing
- Dark mode support
- Multi-language support
- Inventory forecasting
- Supplier management

## Getting Started Right Now

1. **Development**: `pnpm dev` (http://localhost:3000)
2. **Testing**: Add sample data and create orders
3. **Dashboard**: View charts with real data
4. **Admin**: Manage products, orders, customers
5. **Deployment**: Follow `DEPLOYMENT_TO_VERCEL.md`

---

**Ready to launch your POS system? Let's go!** 🚀

For detailed guides, see:
- 📖 `SUPABASE_SETUP_GUIDE.md` - Database setup
- 🚀 `DEPLOYMENT_TO_VERCEL.md` - Deployment steps
- 📋 `IMPLEMENTATION_SUMMARY.md` - Feature overview
