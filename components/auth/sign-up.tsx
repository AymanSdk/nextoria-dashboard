'use client';

import { SignUp as ClerkSignUp } from '@clerk/nextjs';

export function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-[#894DEF] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Join Nextoria to manage your digital marketing campaigns
          </p>
        </div>
        <div className="mt-8">
          <ClerkSignUp 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-[#894DEF] hover:bg-[#894DEF]/90',
                card: 'shadow-lg',
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}