'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { createUser } from '@/actions/users';
import { Button } from '@/components/ui/button';
import { toast } from '@mosespace/toast';
import { signIn } from 'next-auth/react';
import CustomText from './back-end/re-usable-inputs/text-reusable';

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: 'Name must be at least 2 characters.',
    }),
    email: z.string().email({
      message: 'Please enter a valid email address.',
    }),
    password: z.string().min(8, {
      message: 'Password must be at least 8 characters.',
    }),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const result = await createUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      if (result.success) {
        toast.success(
          'Account created!',
          'Your company account has been created successfully.'
        );
        // Sign in the user after account creation
        const signInResult = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (signInResult?.error) {
          toast.error(
            'Sign in failed',
            "Your account was created but we couldn't sign you in automatically."
          );
          router.push('/login');
        } else {
          router.push(`/onboarding/${result.userId}`);
        }
      } else {
        toast.error('Error', `${result.message}`);
      }
    } catch (error) {
      toast.error('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <CustomText
          label="Your Name(s)"
          register={register}
          name="name"
          type="text"
          errors={errors}
          placeholder="Uncle Moses"
          className="w-full"
        />
        <CustomText
          label="Email"
          register={register}
          name="email"
          type="email"
          errors={errors}
          placeholder="name@example.com"
          className="w-full"
        />
        <CustomText
          label="Password"
          register={register}
          name="password"
          type="password"
          errors={errors}
          placeholder="********"
          className="w-full"
        />
        <CustomText
          label="Confirm Password"
          register={register}
          name="confirmPassword"
          type="password"
          errors={errors}
          placeholder="********"
          className="w-full"
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </>
  );
}
