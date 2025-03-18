'use server';
import ResetPasswordEmail from '@/components/emails/reset-password';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { generateToken } from '@/lib/generate-token';
import { Role } from '@prisma/client';
import bcrypt, { compare, hash } from 'bcryptjs';
import { getServerSession } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';

interface CreateCompanyAccountParams {
  name: string;
  email: string;
  password: string;
}
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetLink(email: string) {
  const baseUrl = process.env.NEXTAUTH_URL;
  const nodeEnvironment = process.env.NODE_ENV;

  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return {
        status: 404,
        error: 'We cannot associate this email with any user',
        data: null,
      };
    }
    const token = generateToken();
    const update = await db.user.update({
      where: {
        email,
      },
      data: {
        token,
      },
    });
    const name = user.name;

    const resetPasswordLink = `${baseUrl}/reset-password?token=${token}&&email=${email}`;

    if (nodeEnvironment === 'development') {
      console.log('Reset Token ✅:', resetPasswordLink);
      return null;
    }

    const { data, error } = await resend.emails.send({
      from: 'NextAdmin <info@desishub.com>',
      to: email,
      subject: 'Reset Password Request',
      react: ResetPasswordEmail({ userFirstName: name, resetPasswordLink }),
    });
    if (error) {
      return {
        status: 404,
        error: error.message,
        data: null,
      };
    }
    console.log(data);
    return {
      status: 200,
      error: null,
      data: data,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      error: 'We cannot find your email',
      data: null,
    };
  }
}

export async function resetUserPassword(
  email: string,
  token: string,
  newPassword: string
) {
  const user = await db.user.findUnique({
    where: {
      email,
      token,
    },
  });
  if (!user) {
    return {
      status: 404,
      error: 'Please use a valid reset link',
      data: null,
    };
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  try {
    const updatedUser = await db.user.update({
      where: {
        email,
        token,
      },
      data: {
        passwordHash: hashedPassword,
      },
    });
    return {
      status: 200,
      error: null,
      data: null,
    };
  } catch (error) {
    console.log(error);
  }
}

export async function deleteUser(userId: any) {
  try {
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return {
        data: null,
        message: 'User your trying to delete does not exit',
        status: 404,
      };
    }

    await db.user.delete({
      where: {
        id: userId,
      },
    });

    return {
      data: null,
      message: 'User deleted successfully',
      status: 200,
    };
  } catch (error) {
    console.log('Error;', error);
  }
}

export async function createUser({
  name,
  email,
  password,
}: CreateCompanyAccountParams) {
  try {
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        success: false,
        message: 'A user with this email already exists',
      };
    }

    // Hash the password
    const passwordHash = await hash(password, 10);

    // Create the user with ADMIN role
    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: Role.STUDENT,
      },
    });

    // Create activity log for the signup
    // const data = {
    //   userId: user.id,
    //   action: 'SIGNUP',
    //   description: 'Company account created',
    // };

    // await createActivityLog(data);

    return {
      success: true,
      userId: user.id,
    };
  } catch (error) {
    console.error('Error creating company account:', error);
    return {
      success: false,
      message: 'Failed to create account',
    };
  }
}

// Update user profile
export async function updateProfile(data: {
  name: string;
  personalEmail?: string;
  phoneNumber?: string;
  gender?: string;
  maritalStatus?: string;
  dateOfBirth?: Date;
  bloodGroup?: string;
  nationality?: string;
  notes?: string;
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }

    // Update user profile
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: data.name,
        // gender: data.gender || null,
        // maritalStatus: data.maritalStatus || null,
        // dateOfBirth: data.dateOfBirth || null,
        // bloodGroup: data.bloodGroup || null,
        // nationality: data.nationality || null,
        // notes: data.notes || null,
      },
    });

    // Create activity log
    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'PROFILE_UPDATE',
        description: 'User updated their profile',
      },
    });

    revalidatePath('/dashboard/settings');
    return {
      success: true,
    };
  } catch (error) {
    console.error('Error updating profile:', error);
    return {
      success: false,
      error: 'Failed to update profile',
    };
  }
}

// Change user password
export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'Unauthorized',
      };
    }

    // Get user with password hash
    const user = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        passwordHash: true,
      },
    });

    if (!user || !user.passwordHash) {
      return {
        success: false,
        error: 'User not found or no password set',
      };
    }

    // Verify current password
    const isValid = await compare(data.currentPassword, user.passwordHash);

    if (!isValid) {
      return {
        success: false,
        error: 'Current password is incorrect',
      };
    }

    // Hash new password
    const newPasswordHash = await hash(data.newPassword, 10);

    // Update password
    await db.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    // Create activity log
    await db.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'PASSWORD_CHANGE',
        description: 'User changed their password',
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error('Error changing password:', error);
    return {
      success: false,
      error: 'Failed to change password',
    };
  }
}
