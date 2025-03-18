'use client';

import { Bell, Calendar, Mail, MessageSquare } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { toast } from '@mosespace/toast';

export function NotificationSettings() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);

  // These would be fetched from the user's preferences in a real app
  const [emailNotifications, setEmailNotifications] = useState({
    checkInReminders: true,
    checkOutReminders: true,
    adminNotices: true,
    leaveApprovals: true,
  });

  const [pushNotifications, setPushNotifications] = useState({
    checkInReminders: true,
    checkOutReminders: true,
    adminNotices: true,
    leaveApprovals: false,
  });

  const handleTogglePushNotifications = async () => {
    setIsLoading(true);
    // try {
    //   if (!pushEnabled) {
    //     const success = await subscribeToPushNotifications();
    //     if (success) {
    //       setPushEnabled(true);
    //       toast.success(
    //         'Push notifications enabled',
    //         'You will now receive push notifications',
    //       );
    //     } else {
    //       throw new Error('Failed to enable push notifications');
    //     }
    //   } else {
    //     // Logic to disable push notifications would go here
    //     setPushEnabled(false);
    //     toast.success(
    //       'Push notifications disabled',
    //       'You will no longer receive push notifications',
    //     );
    //   }
    // } catch (error) {
    //   console.error('Error toggling push notifications:', error);
    //   toast.error('Error', 'Failed to update notification settings');
    // } finally {
    //   setIsLoading(false);
    // }
  };

  const saveNotificationSettings = () => {
    setIsLoading(true);
    // This would save the notification settings to the database in a real app
    setTimeout(() => {
      toast.success(
        'Notification settings saved',
        'Your notification preferences have been updated',
      );
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Push Notifications
          </CardTitle>
          <CardDescription>
            Receive notifications even when you're not using the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">
                Enable Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Allow the application to send you notifications when it's closed
              </p>
            </div>
            <Switch
              id="push-notifications"
              checked={pushEnabled}
              onCheckedChange={handleTogglePushNotifications}
              disabled={isLoading}
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Push Notification Settings</h4>
            <div className="grid gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="push-checkin" className="text-sm">
                    Check-in Reminders
                  </Label>
                </div>
                <Switch
                  id="push-checkin"
                  checked={pushNotifications.checkInReminders}
                  onCheckedChange={(checked) =>
                    setPushNotifications({
                      ...pushNotifications,
                      checkInReminders: checked,
                    })
                  }
                  disabled={!pushEnabled || isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="push-checkout" className="text-sm">
                    Check-out Reminders
                  </Label>
                </div>
                <Switch
                  id="push-checkout"
                  checked={pushNotifications.checkOutReminders}
                  onCheckedChange={(checked) =>
                    setPushNotifications({
                      ...pushNotifications,
                      checkOutReminders: checked,
                    })
                  }
                  disabled={!pushEnabled || isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="push-notices" className="text-sm">
                    Admin Notices
                  </Label>
                </div>
                <Switch
                  id="push-notices"
                  checked={pushNotifications.adminNotices}
                  onCheckedChange={(checked) =>
                    setPushNotifications({
                      ...pushNotifications,
                      adminNotices: checked,
                    })
                  }
                  disabled={!pushEnabled || isLoading}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <Label htmlFor="push-leave" className="text-sm">
                    Leave Approvals
                  </Label>
                </div>
                <Switch
                  id="push-leave"
                  checked={pushNotifications.leaveApprovals}
                  onCheckedChange={(checked) =>
                    setPushNotifications({
                      ...pushNotifications,
                      leaveApprovals: checked,
                    })
                  }
                  disabled={!pushEnabled || isLoading}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="mr-2 h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Manage which emails you receive from the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="email-checkin" className="text-sm">
                  Check-in Reminders
                </Label>
              </div>
              <Switch
                id="email-checkin"
                checked={emailNotifications.checkInReminders}
                onCheckedChange={(checked) =>
                  setEmailNotifications({
                    ...emailNotifications,
                    checkInReminders: checked,
                  })
                }
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="email-checkout" className="text-sm">
                  Check-out Reminders
                </Label>
              </div>
              <Switch
                id="email-checkout"
                checked={emailNotifications.checkOutReminders}
                onCheckedChange={(checked) =>
                  setEmailNotifications({
                    ...emailNotifications,
                    checkOutReminders: checked,
                  })
                }
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="email-notices" className="text-sm">
                  Admin Notices
                </Label>
              </div>
              <Switch
                id="email-notices"
                checked={emailNotifications.adminNotices}
                onCheckedChange={(checked) =>
                  setEmailNotifications({
                    ...emailNotifications,
                    adminNotices: checked,
                  })
                }
                disabled={isLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="email-leave" className="text-sm">
                  Leave Approvals
                </Label>
              </div>
              <Switch
                id="email-leave"
                checked={emailNotifications.leaveApprovals}
                onCheckedChange={(checked) =>
                  setEmailNotifications({
                    ...emailNotifications,
                    leaveApprovals: checked,
                  })
                }
                disabled={isLoading}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveNotificationSettings} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Notification Settings'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
