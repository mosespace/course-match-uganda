'use client';

import AcademicForm from '@/components/academic-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function page() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'a-level' | 'o-level'>('a-level');

  const handleFormSubmit = (weight: string, level: string) => {
    router.push(`/search?weight=${weight}&level=${level}`);
  };
  return (
    <section className="min-h-screen items-center">
      <div className="mx-auto flex items-center justify-center">
        <Card className="w-full max-w-2xl border-primary/20 shadow-lg shadow-primary/5">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-t-lg">
            <CardTitle className="text-2xl">Find Matching Courses</CardTitle>
            <CardDescription>
              Enter your academic results to find courses that match your
              qualifications
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <AcademicForm onSubmit={handleFormSubmit} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
