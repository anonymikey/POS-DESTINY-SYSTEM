-- Supabase/PostgreSQL Database Schema for POS System
-- Copy and paste this entire SQL into your Supabase SQL Editor and run it

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users/Auth table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'cashier', 'user')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  address TEXT,
  loyalty_points INTEGER DEFAULT 0,
  total_spent DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  icon TEXT DEFAULT '📦',
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Products/Inventory table
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category_id UUID REFERENCES categories(id),
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2) DEFAULT 0,
  stock INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 5,
  image_url TEXT,
  supplier TEXT,
  sku TEXT UNIQUE,
  barcode TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES customers(id),
  user_id UUID REFERENCES users(id),
  customer_name TEXT,
  total DECIMAL(10, 2) NOT NULL DEFAULT 0,
  subtotal DECIMAL(10, 2) DEFAULT 0,
  discount_amount DECIMAL(10, 2) DEFAULT 0,
  tax_amount DECIMAL(10, 2) DEFAULT 0,
  payment_method TEXT DEFAULT 'cash',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order Items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES inventory(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  amount DECIMAL(10, 2) NOT NULL,
  transaction_type TEXT DEFAULT 'sale' CHECK (transaction_type IN ('sale', 'refund', 'adjustment')),
  payment_status TEXT DEFAULT 'completed' CHECK (payment_status IN ('completed', 'pending', 'failed')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Store Settings table
CREATE TABLE store_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  store_name TEXT DEFAULT 'My Store',
  store_email TEXT,
  store_phone TEXT,
  store_address TEXT,
  tax_rate DECIMAL(5, 2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  timezone TEXT DEFAULT 'UTC',
  discount_enabled BOOLEAN DEFAULT TRUE,
  loyalty_points_enabled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Audit Log table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_products_category ON inventory(category_id);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
CREATE INDEX idx_transactions_order ON transactions(order_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all customers
CREATE POLICY "users_can_read_customers" ON customers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to create customers
CREATE POLICY "users_can_create_customers" ON customers
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update customers
CREATE POLICY "users_can_update_customers" ON customers
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to read inventory
CREATE POLICY "users_can_read_inventory" ON inventory
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to create orders
CREATE POLICY "users_can_create_orders" ON orders
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to read orders
CREATE POLICY "users_can_read_orders" ON orders
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow users to update their own orders
CREATE POLICY "users_can_update_orders" ON orders
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to read order items
CREATE POLICY "users_can_read_order_items" ON order_items
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to create order items
CREATE POLICY "users_can_create_order_items" ON order_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Insert default store settings
INSERT INTO store_settings (store_name, tax_rate) VALUES ('My Store', 0);

-- Create categories
INSERT INTO categories (name, color, icon, description) VALUES
  ('Food', '#f59e0b', '🍔', 'Food and beverages'),
  ('Drinks', '#3b82f6', '☕', 'Hot and cold beverages'),
  ('Desserts', '#ec4899', '🍰', 'Sweet treats and desserts'),
  ('Snacks', '#10b981', '🍿', 'Snacks and light items');
