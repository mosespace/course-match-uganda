'use client';

import { useState, useEffect } from 'react';
// import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export function AppearanceSettings() {
  // const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  const saveAppearanceSettings = () => {
    toast({
      title: 'Appearance settings saved',
      description: 'Your theme preferences have been updated',
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>
            Choose your preferred color theme for the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {/* <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              className="flex flex-col items-center justify-center gap-2 h-24"
              onClick={() => setTheme('light')}
            >
              <Sun className="h-6 w-6" />
              <span>Light</span>
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              className="flex flex-col items-center justify-center gap-2 h-24"
              onClick={() => setTheme('dark')}
            >
              <Moon className="h-6 w-6" />
              <span>Dark</span>
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              className="flex flex-col items-center justify-center gap-2 h-24"
              onClick={() => setTheme('system')}
            >
              <Monitor className="h-6 w-6" />
              <span>System</span>
            </Button> */}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={saveAppearanceSettings}>
            Save Appearance Settings
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
