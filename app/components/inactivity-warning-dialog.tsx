'use client'

import { AlertCircle, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface InactivityWarningDialogProps {
  open: boolean
  countdown: number
  onDismiss: () => void
  onLogout: () => void
}

export function InactivityWarningDialog({
  open,
  countdown,
  onDismiss,
  onLogout,
}: InactivityWarningDialogProps) {
  const minutes = Math.floor(countdown / 60)
  const seconds = countdown % 60

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[400px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <DialogTitle>Session Inactivity Warning</DialogTitle>
          </div>
          <DialogDescription>
            Your session will expire due to inactivity
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-foreground">
              You will be automatically logged out in:
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            To continue working, click "Stay Logged In" or move your mouse/use keyboard. 
            Otherwise, you will be logged out automatically.
          </p>
        </div>

        <DialogFooter className="gap-3 sm:gap-0">
          <Button
            variant="outline"
            onClick={onLogout}
            className="w-full sm:w-auto"
          >
            Logout Now
          </Button>
          <Button
            onClick={onDismiss}
            className="w-full sm:w-auto"
          >
            Stay Logged In
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
