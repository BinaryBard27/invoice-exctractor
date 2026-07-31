import { SignUp } from '@clerk/nextjs'

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center">
      <SignUp fallbackRedirectUrl="/" />
    </main>
  )
}
