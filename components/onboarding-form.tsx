'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// import { updateUserProfile } from '@/actions/users';
import { Button } from '@/components/ui/button';
import { toast } from '@mosespace/toast';
import Select from 'react-tailwindcss-select';
import { Option } from 'react-tailwindcss-select/dist/components/type';
import CustomTextArea from './back-end/re-usable-inputs/custom-text-area';
import CustomText from './back-end/re-usable-inputs/text-reusable';
import { updateProfile } from '@/actions/users';

const formSchema = z.object({
  streetAddress: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  postCode: z.string().min(1, 'Postal code is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  department: z.string().optional(),
  notes: z.string().optional(),
});

interface OnboardingFormProps {
  userId: string;
}

export default function OnboardingForm({ userId }: OnboardingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [department, setDepartment] = useState<Option | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      streetAddress: '',
      city: '',
      state: '',
      country: '',
      postCode: '',
      phoneNumber: '',
      department: 'HR',
      notes: '',
    },
  });

  const departments = [
    { value: 'HR', label: 'Human Resources' },
    { value: 'MARKETING', label: 'Marketing' },
    { value: 'SALES', label: 'Sales' },
    { value: 'ENGINEERING', label: 'Engineering' },
    { value: 'DESIGN', label: 'Design' },
    { value: 'FINANCE', label: 'Finance' },
    { value: 'LEGAL', label: 'Legal' },
    { value: 'CUSTOMER_SUPPORT', label: 'Customer Support' },
    { value: 'PRODUCT', label: 'Product' },
    { value: 'OPERATIONS', label: 'Operations' },
    { value: 'IT', label: 'IT' },
    { value: 'OTHER', label: 'Other' },
  ];

  const handleDepartmentChange = (option: Option | Option[] | null) => {
    if (!option || Array.isArray(option)) return;
    const department = departments.find((d) => d.value === option.value);
    if (!department) return;
    setSelectedDepartment(department);
  };

  async function onSubmit(values: any) {
    setIsLoading(true);

    const dataTOSubmit = {
      ...values,
      userId,
      department: selectedDepartment.value,
    };

    // console.log('Data To Submit ✅:', dataTOSubmit);

    try {
      const result = await updateProfile(dataTOSubmit);

      if (result.success) {
        toast.success(
          'Profile updated!',
          'Your company profile has been updated successfully.',
        );
        router.push('/dashboard');
      } else {
        toast.error(
          'Error',
          result.error || 'Something went wrong. Please try again.',
        );
      }
    } catch (error) {
      toast.error('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <CustomText
            label="Street Address"
            register={register}
            name="streetAddress"
            type="text"
            errors={errors}
            placeholder="123 Main St"
            className="w-full"
          />
          <CustomText
            label="City"
            register={register}
            name="city"
            type="text"
            errors={errors}
            placeholder="San Francisco"
            className="w-full"
          />
          <CustomText
            label="State/Province"
            register={register}
            name="state"
            type="text"
            errors={errors}
            placeholder="California"
            className="w-full"
          />
          <CustomText
            label="Country"
            register={register}
            name="country"
            type="text"
            errors={errors}
            placeholder="United States"
            className="w-full"
          />
          <CustomText
            label="Postal Code"
            register={register}
            name="postCode"
            type="text"
            errors={errors}
            placeholder="94103"
            className="w-full"
          />
          <CustomText
            label="Phone Number"
            register={register}
            name="phoneNumber"
            type="text"
            errors={errors}
            placeholder="+1 (555) 123-4567"
            className="w-full"
          />
        </div>
        <div className="">
          <h2 className="pb-2 block text-sm font-medium leading-6">
            Primary Department
          </h2>
          <Select
            value={department}
            onChange={(option) => {
              setDepartment(option as Option);
              handleDepartmentChange(option);
            }}
            options={departments}
            isClearable={true}
            primaryColor="emerald"
            isSearchable={false}
            placeholder="                Select the primary department for your company
"
          />
        </div>

        <CustomTextArea
          label="Additional Notes"
          register={register}
          name="notes"
          errors={errors}
          height={8}
          isRequired={false}
          placeholder="Any additional information about your company"
        />

        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            Skip for now
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Complete Setup'}
          </Button>
        </div>
      </form>
    </>
  );
}
