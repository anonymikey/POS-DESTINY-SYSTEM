"use client"

import { useState, useEffect } from "react"
import { Save, Bell, Lock, Globe, Database, Shield, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface StoreSettings {
  storeName: string
  storeEmail: string
  storePhone: string
  storeAddress: string
  timezone: string
  currency: string
  taxRate: number
  discountEnabled: boolean
  loyaltyPointsEnabled: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  backupEnabled: boolean
  allowEmployeeSignup: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: "My POS Store",
    storeEmail: "owner@store.com",
    storePhone: "(123) 456-7890",
    storeAddress: "123 Main St, City, State 12345",
    timezone: "America/New_York",
    currency: "USD",
    taxRate: 8.0,
    discountEnabled: true,
    loyaltyPointsEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    backupEnabled: true,
    allowEmployeeSignup: true,
  })
  const [isSaved, setIsSaved] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [showClearDialog, setShowClearDialog] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem("pos_settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSaveSettings = () => {
    localStorage.setItem("pos_settings", JSON.stringify(settings))
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }

  const handleClearAllData = () => {
    localStorage.clear()
    setShowClearDialog(false)
    window.location.href = "/"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your POS system configuration and preferences</p>
        </div>
        <Button onClick={handleSaveSettings} disabled={isSaved}>
          <Save className="h-4 w-4 mr-2" />
          {isSaved ? "Saved!" : "Save Settings"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4 space-y-2">
              <a href="#store-info" className="block px-4 py-2 rounded-lg hover:bg-muted">
                Store Information
              </a>
              <a href="#system-settings" className="block px-4 py-2 rounded-lg hover:bg-muted">
                System Settings
              </a>
              <a href="#notifications" className="block px-4 py-2 rounded-lg hover:bg-muted">
                Notifications
              </a>
              <a href="#security" className="block px-4 py-2 rounded-lg hover:bg-muted">
                Security & Backup
              </a>
              <a href="#danger-zone" className="block px-4 py-2 rounded-lg hover:bg-muted">
                Danger Zone
              </a>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Store Information */}
          <Card id="store-info">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Store Information
              </CardTitle>
              <CardDescription>Update your store details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={settings.storeName}
                    onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="storeEmail">Store Email</Label>
                  <Input
                    id="storeEmail"
                    type="email"
                    value={settings.storeEmail}
                    onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="storePhone">Store Phone</Label>
                  <Input
                    id="storePhone"
                    value={settings.storePhone}
                    onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="storeAddress">Store Address</Label>
                  <Input
                    id="storeAddress"
                    value={settings.storeAddress}
                    onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card id="system-settings">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                System Settings
              </CardTitle>
              <CardDescription>Configure system preferences and regional settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    className="w-full px-3 py-2 border border-input rounded-md bg-background"
                    value={settings.timezone}
                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={settings.currency}
                    onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="taxRate">Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  step="0.1"
                  value={settings.taxRate}
                  onChange={(e) => setSettings({ ...settings, taxRate: Number.parseFloat(e.target.value) })}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Discounts</Label>
                    <p className="text-sm text-muted-foreground">Allow discount codes in transactions</p>
                  </div>
                  <Switch
                    checked={settings.discountEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, discountEnabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Loyalty Points</Label>
                    <p className="text-sm text-muted-foreground">Enable customer loyalty program</p>
                  </div>
                  <Switch
                    checked={settings.loyaltyPointsEnabled}
                    onCheckedChange={(checked) => setSettings({ ...settings, loyaltyPointsEnabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Employee Sign-ups</Label>
                    <p className="text-sm text-muted-foreground">Allow employees to create their own accounts</p>
                  </div>
                  <Switch
                    checked={settings.allowEmployeeSignup}
                    onCheckedChange={(checked) => setSettings({ ...settings, allowEmployeeSignup: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card id="notifications">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive email alerts for important events</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive SMS alerts for critical issues (requires setup)</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security & Backup */}
          <Card id="security">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security & Backup
              </CardTitle>
              <CardDescription>Manage data backup and security settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Automatic Backup</Label>
                  <p className="text-sm text-muted-foreground">Enable daily automatic data backup</p>
                </div>
                <Switch
                  checked={settings.backupEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, backupEnabled: checked })}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Manual Actions</h4>
                <Button variant="outline" className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  Download Data Backup
                </Button>
                <Button variant="outline" className="w-full">
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card id="danger-zone" className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Destructive actions that cannot be undone</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setShowLogoutDialog(true)}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
              <Button
                variant="destructive"
                className="w-full"
                onClick={() => setShowClearDialog(true)}
              >
                Clear All Data
              </Button>
              <p className="text-xs text-muted-foreground">
                This will permanently delete all your store data. This action cannot be undone.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Logout Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logout</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to logout from the admin panel?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogoutDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => window.location.href = "/"}>
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear Data Dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Clear All Data</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to permanently delete all your store data? This includes:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>All products and categories</li>
              <li>All customer records</li>
              <li>All transaction history</li>
              <li>All settings</li>
            </ul>
            <p className="text-sm font-medium text-red-600">This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowClearDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearAllData}>
              Delete All Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
