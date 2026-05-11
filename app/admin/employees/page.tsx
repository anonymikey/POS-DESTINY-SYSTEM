"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Users, Plus, Trash2, Mail, Calendar, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"

interface Employee {
  id: string
  email: string
  fullName: string
  isAdmin: boolean
  createdAt: string
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [newEmail, setNewEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newFullName, setNewFullName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadEmployees()
  }, [])

  const loadEmployees = () => {
    try {
      const users = JSON.parse(localStorage.getItem("pos_users") || "[]")
      const employeeList = users.filter((u: any) => !u.isAdmin) as Employee[]
      setEmployees(employeeList)
    } catch (err) {
      setError("Failed to load employees")
    }
  }

  const validateForm = () => {
    if (!newEmail || !newPassword || !newFullName) {
      setError("All fields are required")
      return false
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return false
    }
    if (employees.some((e) => e.email === newEmail)) {
      setError("Email already exists")
      return false
    }
    return true
  }

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      const users = JSON.parse(localStorage.getItem("pos_users") || "[]")

      const newEmployee = {
        id: `user_${Date.now()}`,
        email: newEmail,
        password: newPassword,
        fullName: newFullName,
        isAdmin: false,
        createdAt: new Date().toISOString(),
      }

      users.push(newEmployee)
      localStorage.setItem("pos_users", JSON.stringify(users))

      setEmployees([
        ...employees,
        {
          id: newEmployee.id,
          email: newEmployee.email,
          fullName: newEmployee.fullName,
          isAdmin: false,
          createdAt: newEmployee.createdAt,
        },
      ])

      setSuccess(`Employee "${newFullName}" created successfully!`)
      setNewEmail("")
      setNewPassword("")
      setNewFullName("")

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create employee")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteEmployee = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      try {
        const users = JSON.parse(localStorage.getItem("pos_users") || "[]")
        const updatedUsers = users.filter((u: any) => u.id !== id)
        localStorage.setItem("pos_users", JSON.stringify(updatedUsers))
        setEmployees(employees.filter((e) => e.id !== id))
        setSuccess(`Employee "${name}" deleted successfully!`)
        setTimeout(() => setSuccess(""), 3000)
      } catch (err) {
        setError("Failed to delete employee")
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Employee Management</h1>
          <p className="text-slate-400">Create and manage employee accounts</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-700/50 px-4 py-2 rounded-lg">
          <Users className="w-5 h-5 text-blue-400" />
          <span className="text-white font-semibold">{employees.length}</span>
        </div>
      </div>

      {/* Create Employee Form */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-400" />
            Create New Employee
          </CardTitle>
          <CardDescription>Add a new employee account to your system</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-green-400 text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleCreateEmployee} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                <Input
                  type="text"
                  placeholder="John Doe"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                <Input
                  type="email"
                  placeholder="employee@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-500"
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
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? "Creating..." : "Create Employee"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Employees List */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Employees</CardTitle>
          <CardDescription>List of all employees in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">No employees yet</p>
              <p className="text-slate-500 text-sm">Create your first employee using the form above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-slate-500 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                        <span className="text-blue-400 font-semibold text-sm">
                          {employee.fullName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-white">{employee.fullName}</p>
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                          <Mail className="w-4 h-4" />
                          {employee.email}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    <div className="text-right">
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(employee.createdAt).toLocaleDateString()}
                      </p>
                      <Badge variant="outline" className="mt-1 border-green-600 text-green-400">
                        Active
                      </Badge>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteEmployee(employee.id, employee.fullName)}
                      className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
