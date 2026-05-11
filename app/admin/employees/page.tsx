'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Users, Plus, Trash2, Mail, Calendar, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import { getAllEmployees, createEmployee, deleteUser } from '@/app/services/auth-db'

interface Employee {
  id: string
  email: string
  full_name: string | null
  is_active: boolean
  created_at: string
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newFullName, setNewFullName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = async () => {
    try {
      setIsLoading(true)
      const employeeList = await getAllEmployees()
      setEmployees(employeeList)
    } catch (err) {
      setError('Failed to load employees')
      console.error('[v0] Error loading employees:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = () => {
    if (!newEmail || !newPassword || !newFullName) {
      setError('All fields are required')
      return false
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      return false
    }
    if (!newEmail.includes('@')) {
      setError('Please enter a valid email')
      return false
    }
    if (employees.some((e) => e.email === newEmail)) {
      setError('Email already exists')
      return false
    }
    return true
  }

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      const { user: newEmployee, error: createError } = await createEmployee({
        email: newEmail,
        password: newPassword,
        full_name: newFullName,
      })

      if (createError || !newEmployee) {
        setError(createError || 'Failed to create employee')
        return
      }

      // Add to local list
      setEmployees([...employees, newEmployee])

      setSuccess(`Employee "${newFullName}" created successfully!`)
      setNewEmail('')
      setNewPassword('')
      setNewFullName('')

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create employee')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteEmployee = async (id: string, fullName: string) => {
    if (!confirm(`Are you sure you want to delete ${fullName}?`)) {
      return
    }

    setDeletingId(id)
    try {
      const { success, error: deleteError } = await deleteUser(id)

      if (success) {
        setEmployees(employees.filter((e) => e.id !== id))
        setSuccess(`Employee "${fullName}" deleted successfully!`)
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(deleteError || 'Failed to delete employee')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete employee')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="w-8 h-8" />
          Employee Management
        </h1>
        <p className="text-slate-400 mt-1">Create and manage employee accounts</p>
      </div>

      {/* Create Employee Form */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Employee
          </CardTitle>
          <CardDescription>Add a new employee to your POS system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateEmployee} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <p className="text-green-400 text-sm">{success}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-500"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-500"
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-500"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto"
            >
              {isSubmitting ? 'Creating...' : 'Create Employee'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Employees List */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Employees ({employees.length})
            </span>
          </CardTitle>
          <CardDescription>All employees in your system</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <Loader className="w-8 h-8 text-slate-400 animate-spin mx-auto mb-2" />
              <p className="text-slate-400">Loading employees...</p>
            </div>
          ) : employees.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-2 opacity-50" />
              <p className="text-slate-400">No employees yet. Create one to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Email</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-300">Created</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((employee) => (
                    <tr key={employee.id} className="border-b border-slate-700 hover:bg-slate-700/20 transition">
                      <td className="py-3 px-4 text-sm text-slate-200">{employee.full_name || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm text-slate-400 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {employee.email}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={employee.is_active ? 'default' : 'secondary'}>
                          {employee.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-400 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(employee.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteEmployee(employee.id, employee.full_name || employee.email)}
                          disabled={deletingId === employee.id}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {deletingId === employee.id ? 'Deleting...' : <Trash2 className="w-4 h-4" />}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
