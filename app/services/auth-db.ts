import bcrypt from 'bcryptjs'

// Local mock database for when Supabase is not configured
const mockDatabase = {
  users: [
    {
      id: 'admin-001',
      email: 'admin@destiny.com',
      password_hash: '$2a$10$abcdefghijklmnopqrstuvwxyz123456', // Mock hash
      full_name: 'Admin User',
      role: 'admin' as const,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ],
  system_settings: {
    'allow_employee_signup': 'true',
    'store_name': 'Destiny Supermarket'
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const useLocalDB = !supabaseUrl || !supabaseAnonKey
let supabase: any = null

// Initialize Supabase client if credentials exist
if (!useLocalDB) {
  try {
    const { createClient } = require('@supabase/supabase-js')
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  } catch (err) {
    console.log('[v0] Supabase not available, using local database')
  }
}

export interface User {
  id: string
  email: string
  full_name: string | null
  role: 'admin' | 'employee'
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  email: string
  password: string
  full_name: string
  role: 'admin' | 'employee'
}

// Hash password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Compare password with hash
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Sign up new user
export async function signupUser(data: SignupData): Promise<{ user: User | null; error: string | null }> {
  try {
    if (useLocalDB) {
      // Check if user already exists in local DB
      const existingUser = mockDatabase.users.find(u => u.email === data.email)
      if (existingUser) {
        return { user: null, error: 'User with this email already exists' }
      }

      // Hash password
      const passwordHash = await hashPassword(data.password)

      // Create user in local DB
      const newUser: User = {
        id: 'user-' + Date.now(),
        email: data.email,
        password_hash: passwordHash,
        full_name: data.full_name,
        role: data.role,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      mockDatabase.users.push(newUser as any)
      const { password_hash, ...userWithoutPassword } = newUser
      return { user: userWithoutPassword, error: null }
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', data.email)
      .single()

    if (existingUser) {
      return { user: null, error: 'User with this email already exists' }
    }

    // Hash password
    const passwordHash = await hashPassword(data.password)

    // Create user
    const { data: newUser, error } = await supabase
      .from('users')
      .insert([
        {
          email: data.email,
          password_hash: passwordHash,
          full_name: data.full_name,
          role: data.role,
          is_active: true,
        },
      ])
      .select()
      .single()

    if (error) {
      return { user: null, error: error.message }
    }

    return { user: newUser as User, error: null }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An error occurred during signup'
    return { user: null, error: errorMessage }
  }
}

// Login user
export async function loginUser(credentials: LoginCredentials): Promise<{ user: User | null; error: string | null }> {
  try {
    if (useLocalDB) {
      // Get user by email from local DB
      const user = mockDatabase.users.find(u => u.email === credentials.email)

      if (!user) {
        return { user: null, error: 'Invalid email or password' }
      }

      // Check if user is active
      if (!user.is_active) {
        return { user: null, error: 'Your account has been deactivated' }
      }

      // Verify password
      const passwordMatch = await comparePassword(credentials.password, user.password_hash)
      if (!passwordMatch) {
        return { user: null, error: 'Invalid email or password' }
      }

      // Remove password hash from response
      const { password_hash, ...userWithoutPassword } = user
      return { user: userWithoutPassword as User, error: null }
    }

    // Get user by email
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', credentials.email)
      .single()

    if (error || !user) {
      return { user: null, error: 'Invalid email or password' }
    }

    // Check if user is active
    if (!user.is_active) {
      return { user: null, error: 'Your account has been deactivated' }
    }

    // Verify password
    const passwordMatch = await comparePassword(credentials.password, user.password_hash)
    if (!passwordMatch) {
      return { user: null, error: 'Invalid email or password' }
    }

    // Remove password hash from response
    const { password_hash, ...userWithoutPassword } = user
    return { user: userWithoutPassword as User, error: null }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An error occurred during login'
    return { user: null, error: errorMessage }
  }
}

// Get user by ID
export async function getUserById(id: string): Promise<User | null> {
  try {
    if (useLocalDB) {
      const user = mockDatabase.users.find(u => u.id === id)
      if (!user) return null
      const { password_hash, ...userWithoutPassword } = user
      return userWithoutPassword as User
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !user) {
      return null
    }

    const { password_hash, ...userWithoutPassword } = user
    return userWithoutPassword as User
  } catch (err) {
    return null
  }
}

// Get all employees
export async function getAllEmployees(): Promise<User[]> {
  try {
    if (useLocalDB) {
      return mockDatabase.users
        .filter(u => u.role === 'employee')
        .map(emp => {
          const { password_hash, ...userWithoutPassword } = emp
          return userWithoutPassword as User
        })
    }

    const { data: employees, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'employee')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching employees:', error)
      return []
    }

    return employees.map(emp => {
      const { password_hash, ...userWithoutPassword } = emp
      return userWithoutPassword as User
    })
  } catch (err) {
    console.error('Error fetching employees:', err)
    return []
  }
}

// Create employee (admin only)
export async function createEmployee(data: Omit<SignupData, 'role'>): Promise<{ user: User | null; error: string | null }> {
  return signupUser({
    ...data,
    role: 'employee',
  })
}

// Delete user
export async function deleteUser(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    if (useLocalDB) {
      const index = mockDatabase.users.findIndex(u => u.id === id)
      if (index > -1) {
        mockDatabase.users.splice(index, 1)
        return { success: true, error: null }
      }
      return { success: false, error: 'User not found' }
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An error occurred while deleting user'
    return { success: false, error: errorMessage }
  }
}

// Deactivate user
export async function deactivateUser(id: string): Promise<{ success: boolean; error: string | null }> {
  try {
    if (useLocalDB) {
      const user = mockDatabase.users.find(u => u.id === id)
      if (user) {
        user.is_active = false
        return { success: true, error: null }
      }
      return { success: false, error: 'User not found' }
    }

    const { error } = await supabase
      .from('users')
      .update({ is_active: false })
      .eq('id', id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An error occurred'
    return { success: false, error: errorMessage }
  }
}

// Get system setting
export async function getSystemSetting(key: string): Promise<string | null> {
  try {
    if (useLocalDB) {
      const value = mockDatabase.system_settings[key as keyof typeof mockDatabase.system_settings]
      return value || null
    }

    const { data: setting, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', key)
      .single()

    if (error || !setting) {
      return null
    }

    return setting.value
  } catch (err) {
    return null
  }
}

// Update system setting
export async function updateSystemSetting(key: string, value: string): Promise<{ success: boolean; error: string | null }> {
  try {
    if (useLocalDB) {
      mockDatabase.system_settings[key as keyof typeof mockDatabase.system_settings] = value as any
      return { success: true, error: null }
    }

    const { error } = await supabase
      .from('system_settings')
      .upsert(
        { key, value },
        { onConflict: 'key' }
      )

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'An error occurred'
    return { success: false, error: errorMessage }
  }
}

// Check if employee signup is allowed
export async function isEmployeeSignupAllowed(): Promise<boolean> {
  const value = await getSystemSetting('allow_employee_signup')
  return value === 'true'
}
