'use server';

import { cookies } from 'next/headers';
import { formatError } from '@/utils';
import { CustomerSignupFormData } from '@/types';
import { customerSignupSchema } from '../validators';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function customerSignup(
  values: CustomerSignupFormData
): Promise<{
  success: boolean;
  message?: string;
  user?: any;
  error?: string;
}> {
  try {
    const validated = customerSignupSchema.parse(values);

    const res = await fetch(`${BASE_URL}/signup/customer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validated)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    if (data.token) {
      const cookieStore = await cookies(); 
      cookieStore.set('token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: '/',
        sameSite: 'lax'
      });
    }

    return { 
      success: true, 
      message: 'Registration successful',
      user: data.data.user 
    };

  } catch (error) {
    return { 
      success: false, 
      error: formatError(error) 
    };
  }
}