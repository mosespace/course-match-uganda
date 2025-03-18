'use client';

import { updateProfile } from '@/actions/users';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from '@mosespace/toast';
import { Upload } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from 'react-tailwindcss-select';
import { Option } from 'react-tailwindcss-select/dist/components/type';
import { z } from 'zod';
import CustomDatePicker from '../re-usable-inputs/custom-date-picker';
import CustomTextArea from '../re-usable-inputs/custom-text-area';
import CustomText from '../re-usable-inputs/text-reusable';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  personalEmail: z
    .string()
    .email({
      message: 'Please enter a valid email address.',
    })
    .optional()
    .or(z.literal('')),
  phoneNumber: z.string().optional(),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  dateOfBirth: z.date().optional(),
  bloodGroup: z.string().optional(),
  nationality: z.string().optional(),
  notes: z.string().optional(),
});

export function ProfileForm({ user }: { user: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const [gender, setGender] = useState<Option | null>(null);
  const [status, setStatus] = useState<Option | null>(null);
  const [bloodGroup, setBloodGroup] = useState<Option | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    getValues,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      ...user,
    },
  });

  const genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non-binary', label: 'Non-Binary' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' },
  ];

  const statuses = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' },
    { value: 'other', label: 'Other' },
  ];

  const blood_groups = [
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
    { value: 'other', label: 'Other' },
  ];

  async function onSubmit(values: any) {
    setIsLoading(true);
    try {
      const formData = {
        ...values,
        gender: gender?.label,
        maritalStatus: status?.label,
        bloodGroup: bloodGroup?.value,
      };

      const result = await updateProfile(formData);

      if (result.success) {
        toast.success(
          'Profile updated',
          'Your profile has been updated successfully.',
        );
      } else {
        throw new Error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  // Initialize selections based on project when component mounts
  useEffect(() => {
    if (user) {
      if (user.maritalStatus) {
        const matchedType = statuses.find(
          (opt) => opt.label === user.maritalStatus,
        );
        if (matchedType) {
          setStatus(matchedType);
        }
      }
      if (user.bloodGroup) {
        const matchedType = blood_groups.find(
          (opt) => opt.value === user.bloodGroup,
        );
        if (matchedType) {
          setBloodGroup(matchedType);
        }
      }
      if (user.gender) {
        const matchedType = genders.find((opt) => opt.label === user.gender);
        if (matchedType) {
          setGender(matchedType);
        }
      }
      // Set date values properly
      // if (payroll.paymentDate) {
      //   setValue('paymentDate', new Date(payroll.paymentDate));
      // }
      // if (payroll.payPeriodStart) {
      //   setValue('payPeriod', new Date(payroll.payPeriodStart));
      // }
      // if (payroll.payPeriodEnd) {
      //   setValue('payPeriodEnd', new Date(payroll.payPeriodEnd));
      // }
    }
  }, [user]);

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <Avatar className="w-24 h-24">
            <AvatarImage src={user?.image || ''} alt={user?.name || 'User'} />
            <AvatarFallback className="text-2xl">
              {user?.name?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h3 className="font-medium">Profile Picture</h3>
            <p className="text-sm text-muted-foreground">
              This will be displayed on your profile and in comments.
            </p>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="mt-2">
                    <Upload className="mr-2 h-4 w-4" />
                    Change
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're
                      done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4"></div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm" className="mt-2">
                Remove
              </Button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">
          <div className="grid items-center gap-4 w-full sm:grid-cols-2">
            <CustomText
              label="Full Name(s)"
              register={register}
              name="name"
              errors={errors}
              type="text"
              placeholder="John Doe"
              disabled={isLoading}
              className="w-full"
            />
            <CustomText
              label="Personal Email"
              register={register}
              name="email"
              errors={errors}
              type="text"
              placeholder="john.doe@example.com"
              disabled={isLoading}
              className="w-full"
            />
            <CustomText
              label="Phone Number"
              register={register}
              name="phoneNumber"
              errors={errors}
              type="text"
              placeholder="+1 (555) 123-4567"
              disabled={isLoading}
              className="w-full"
            />
            <CustomText
              label="Nationality"
              register={register}
              name="nationality"
              errors={errors}
              type="text"
              placeholder="Uganda"
              disabled={isLoading}
              className="w-full"
            />

            <div>
              <h2 className="pb-2 block text-sm font-medium leading-6">
                Gender
              </h2>
              <Select
                value={gender}
                onChange={(option) => setGender(option as Option)}
                options={genders}
                isClearable={true}
                primaryColor="emerald"
                isSearchable={false}
                placeholder="Select Gender"
              />
            </div>

            <div>
              <h2 className="pb-2 block text-sm font-medium leading-6">
                Marital Status
              </h2>
              <Select
                value={status}
                onChange={(option) => setStatus(option as Option)}
                options={statuses}
                isClearable={true}
                primaryColor="emerald"
                isSearchable={false}
                placeholder="Select Status"
              />
            </div>

            <CustomDatePicker
              label="Date Of Birth (D.O.B)"
              name="dateOfBirth"
              control={control}
              errors={errors}
              className=""
            />

            <div>
              <h2 className="pb-2 block text-sm font-medium leading-6">
                Blood Groups
              </h2>
              <Select
                value={bloodGroup}
                onChange={(option) => setBloodGroup(option as Option)}
                options={blood_groups}
                isClearable={true}
                primaryColor="emerald"
                isSearchable={true}
                placeholder="Blood Group"
              />
            </div>
          </div>

          <CustomTextArea
            label="Notes"
            register={register}
            name="notes"
            errors={errors}
            height={8}
            isRequired={false}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </div>
    </>
  );
}
