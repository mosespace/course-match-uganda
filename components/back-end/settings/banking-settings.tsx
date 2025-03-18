'use client';

import { CreditCard, Lock } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from '@mosespace/toast';
import Select from 'react-tailwindcss-select';
import { Option } from 'react-tailwindcss-select/dist/components/type';
import CustomText from '../re-usable-inputs/text-reusable';

const bankDetailsFormSchema = z.object({
  bankName: z.string().min(1, {
    message: 'Bank name is required.',
  }),
  accountNumber: z.string().min(1, {
    message: 'Account number is required.',
  }),
  accountName: z.string().min(1, {
    message: 'Account name is required.',
  }),
  branchName: z.string().optional(),
  accountType: z.string().optional(),
  swiftCode: z.string().optional(),
  ibanNumber: z.string().optional(),
  routingNumber: z.string().optional(),
});

export function BankingSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasBankDetails, setHasBankDetails] = useState(false);
  const [accountType, setAccountType] = useState<Option | null>(null);

  // In a real app, you would fetch the bank details from the API
  const bankDetails = {
    bankName: '',
    accountNumber: '',
    accountName: '',
    branchName: '',
    accountType: '',
    swiftCode: '',
    ibanNumber: '',
    routingNumber: '',
  };

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm<z.infer<typeof bankDetailsFormSchema>>({
    defaultValues: bankDetails,
  });

  const accountTypes = [
    { value: 'savings', label: 'Savings' },
    { value: 'current', label: 'Current' },
    { value: 'other', label: 'Other' },
  ];

  async function onSubmit(values: any) {
    setIsLoading(true);
    // try {
    //   const result = await updateBankDetails(values);

    //   if (result.success) {
    //     toast.success(
    //       'Bank details updated',
    //       'Your banking information has been updated successfully.',
    //     );
    //     setHasBankDetails(true);
    //   } else {
    //     throw new Error(result.error || 'Failed to update bank details');
    //   }
    // } catch (error) {
    //   console.error('Error updating bank details:', error);
    //   toast.error('Error', 'Failed to update bank details. Please try again.');
    // } finally {
    //   setIsLoading(false);
    // }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Banking Information
          </CardTitle>
          <CardDescription>
            Update your banking details for salary payments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <CustomText
                  label="Bank Name"
                  register={register}
                  name="bankName"
                  errors={errors}
                  type="text"
                  placeholder="Enter bank name"
                  disabled={isLoading}
                  className="w-full"
                />

                <CustomText
                  label="Branch Name"
                  register={register}
                  name="branchName"
                  errors={errors}
                  type="text"
                  placeholder="Enter bank name"
                  disabled={isLoading}
                  className="w-full"
                />

                <CustomText
                  label="Account Holder Name Name"
                  register={register}
                  name="accountName"
                  errors={errors}
                  type="text"
                  placeholder="Enter account holder name"
                  disabled={isLoading}
                  className="w-full"
                />

                <CustomText
                  label="Account Number"
                  register={register}
                  name="accountNumber"
                  errors={errors}
                  type="text"
                  placeholder="Enter account number"
                  disabled={isLoading}
                  className="w-full"
                />

                <div>
                  <h2 className="pb-2 block text-sm font-medium leading-6">
                    Account Types Optional
                  </h2>
                  <Select
                    value={accountType}
                    onChange={(option) => setAccountType(option as Option)}
                    options={accountTypes}
                    isClearable={true}
                    primaryColor="emerald"
                    isSearchable={false}
                    placeholder="Select Status"
                  />
                </div>

                <CustomText
                  label="Routing Number"
                  register={register}
                  name="routingNumber"
                  errors={errors}
                  type="number"
                  placeholder="Enter routing number"
                  disabled={isLoading}
                  className="w-full"
                />

                <CustomText
                  label="SWIFT Code (Optional)"
                  register={register}
                  name="swiftCode"
                  errors={errors}
                  type="number"
                  placeholder="Enter SWIFT code"
                  disabled={isLoading}
                  className="w-full"
                />

                <CustomText
                  label="IBAN Number (Optional)"
                  register={register}
                  name="ibanNumber"
                  errors={errors}
                  type="number"
                  placeholder="Enter IBAN number"
                  disabled={isLoading}
                  className="w-full"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Your banking information is encrypted and secure
                </p>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Banking Information'}
              </Button>
            </form>
          </>
        </CardContent>
      </Card>
    </div>
  );
}
