import { SignIn } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#894DEF] to-[#F2EBFD] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-[#894DEF] font-bold text-xl">N</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Nextoria</h1>
          <p className="text-white/80">Sign in to access your marketing dashboard</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <SignIn 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-[#894DEF] hover:bg-[#894DEF]/90',
                card: 'shadow-none',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'border-gray-200 hover:bg-gray-50',
                formFieldInput: 'border-gray-200 focus:border-[#894DEF] focus:ring-[#894DEF]',
                footerActionLink: 'text-[#894DEF] hover:text-[#894DEF]/80',
              },
            }}
          />
        </div>
        
        <div className="text-center mt-6">
          <p className="text-white/60 text-sm">
            Secure authentication powered by Clerk
          </p>
        </div>
      </div>
    </div>
  );
}