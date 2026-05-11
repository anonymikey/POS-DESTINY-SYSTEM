import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
