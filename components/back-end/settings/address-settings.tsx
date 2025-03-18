'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// import { updateAddress } from '@/actions/users';
import { Button } from '@/components/ui/button';
import { toast } from '@mosespace/toast';
import CustomText from '../re-usable-inputs/text-reusable';

const formSchema = z.object({
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postCode: z.string().optional(),
});

export function AddressSettings(user: any) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      ...user,
      // streetAddress: user?.streetAddress || '',
      // city: user?.city || '',
      // state: user?.state || '',
      // country: user?.country || '',
      // postCode: user?.postCode || '',
    },
  });

  async function onSubmit(values: any) {
    setIsLoading(true);
    // try {
    //   const result = await updateAddress(values);

    //   if (result.success) {
    //     toast.success(
    //       'Address updated',
    //       'Your address has been updated successfully.',
    //     );
    //   } else {
    //     throw new Error(result.error || 'Failed to update address');
    //   }
    // } catch (error) {
    //   console.error('Error updating address:', error);
    //   toast.error('Error', 'Failed to update address. Please try again.');
    // } finally {
    //   setIsLoading(false);
    // }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Address Information</h3>
        <p className="text-sm text-muted-foreground">
          Update your address and location details.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <CustomText
            label="Street Address"
            register={register}
            name="streetAddress"
            errors={errors}
            type="text"
            placeholder="123 Main St"
            disabled={isLoading}
            className="w-full"
          />
          <CustomText
            label="City"
            register={register}
            name="city"
            errors={errors}
            type="text"
            placeholder="San Francisc"
            disabled={isLoading}
            className="w-full"
          />

          <CustomText
            label="State / Province"
            register={register}
            name="state"
            errors={errors}
            type="text"
            placeholder="California"
            disabled={isLoading}
            className="w-full"
          />

          <CustomText
            label="Country"
            register={register}
            name="country"
            errors={errors}
            type="text"
            placeholder="United States"
            disabled={isLoading}
            className="w-full"
          />

          <CustomText
            label="Postal / ZIP Code"
            register={register}
            name="postCode"
            errors={errors}
            type="text"
            placeholder="California"
            disabled={isLoading}
            className="w-full"
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Address'}
        </Button>
      </form>
    </div>
  );
}
