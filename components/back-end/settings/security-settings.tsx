'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { Shield, Key, AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { changePassword } from '@/actions/users';

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: 'Current password is required.',
    }),
    newPassword: z.string().min(8, {
      message: 'New password must be at least 8 characters.',
    }),
    confirmPassword: z.string().min(8, {
      message: 'Confirm password must be at least 8 characters.',
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export function SecuritySettings() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  async function onSubmitPasswordForm(
    values: z.infer<typeof passwordFormSchema>,
  ) {
    setIsLoading(true);
    try {
      const result = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      if (result.success) {
        toast({
          title: 'Password changed',
          description: 'Your password has been changed successfully.',
        });
        passwordForm.reset();
      } else {
        throw new Error(result.error || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: 'Error',
        description:
          'Failed to change password. Please check your current password and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Key className="mr-2 h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onSubmitPasswordForm)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      Password must be at least 8 characters long
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Changing Password...' : 'Change Password'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Account Security
          </CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Security Notice</AlertTitle>
            <AlertDescription>
              For enhanced security, we recommend enabling two-factor
              authentication and regularly updating your password.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Button variant="outline">Set Up</Button>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">Active Sessions</h4>
                <p className="text-sm text-muted-foreground">
                  Manage devices where you're currently logged in
                </p>
              </div>
              <Button variant="outline">Manage</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
