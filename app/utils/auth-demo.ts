/**
 * Demo Authentication Setup
 * 
 * Initialize demo accounts for testing purposes
 * This should be called once on first app load
 */

export function initializeDemoAccounts() {
  const existingUsers = localStorage.getItem("pos_users")
  
  // Only initialize if no users exist
  if (existingUsers) {
    return
  }

  const demoAccounts = [
    {
      id: "admin_001",
      email: "admin@example.com",
      password: "password123",
      fullName: "John Admin",
      isAdmin: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "employee_001",
      email: "employee@example.com",
      password: "password123",
      fullName: "Jane Employee",
      isAdmin: false,
      createdAt: new Date().toISOString(),
    },
  ]

  localStorage.setItem("pos_users", JSON.stringify(demoAccounts))

  // Initialize default settings
  const defaultSettings = {
    storeName: "DESTINY POS",
    storeEmail: "info@destinypos.com",
    storePhone: "+1 (555) 123-4567",
    storeAddress: "123 Business St, Commerce City, State 12345",
    timezone: "America/New_York",
    currency: "USD",
    taxRate: 8.0,
    discountEnabled: true,
    loyaltyPointsEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    backupEnabled: true,
    allowEmployeeSignup: true,
  }

  localStorage.setItem("pos_settings", JSON.stringify(defaultSettings))
}
