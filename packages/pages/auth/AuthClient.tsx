'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { signUp, signInWithEmail, requestPasswordReset } from '@tor/lib/actions/auth'
import { createClient } from '@tor/lib/supabase/client'
import { Sparkles, Loader2, Eye, EyeOff, ArrowLeft, Mail } from 'lucide-react'

interface SignUpFields {
  first_name: string
  last_name: string
  email: string
  password: string
}

interface SignInFields {
  email: string
  password: string
}

interface ForgotFields {
  email: string
}

const inputClass = 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none'

export default function AuthClient({ redirectTo }: { redirectTo?: string }) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const signUpForm = useForm<SignUpFields>()
  const signInForm = useForm<SignInFields>()
  const forgotForm = useForm<ForgotFields>()

  const loading =
    mode === 'signup' ? signUpForm.formState.isSubmitting
    : mode === 'forgot' ? forgotForm.formState.isSubmitting
    : signInForm.formState.isSubmitting

  async function onSignUp(data: SignUpFields) {
    setError('')
    const formData = new FormData()
    formData.set('first_name', data.first_name)
    formData.set('last_name', data.last_name)
    formData.set('email', data.email)
    formData.set('password', data.password)
    formData.set('redirect_to', redirectTo || '/')
    const result = await signUp(formData)
    if (result?.error) setError(result.error)
  }

  async function onSignIn(data: SignInFields) {
    setError('')
    const formData = new FormData()
    formData.set('email', data.email)
    formData.set('password', data.password)
    formData.set('redirect_to', redirectTo || '/')
    const result = await signInWithEmail(formData)
    if (result?.error) setError(result.error)
  }

  async function onForgot(data: ForgotFields) {
    setError('')
    const result = await requestPasswordReset(data.email.trim())
    if (result?.error) {
      setError(result.error)
    } else {
      setResetSent(true)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <div className="text-center mb-8">
        <Sparkles className="w-12 h-12 text-brand-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900">
          {mode === 'signup' ? 'Create Account' : mode === 'forgot' ? 'Reset Password' : 'Welcome Back'}
        </h1>
        <p className="mt-2 text-gray-500">
          {mode === 'forgot'
            ? 'Enter your email and we\'ll send you a reset link'
            : redirectTo
              ? 'Sign in to continue to checkout'
              : mode === 'signup'
                ? 'Create your account'
                : 'Sign in to your account'}
        </p>
      </div>

      {/* Forgot Password Form */}
      {mode === 'forgot' ? (
        resetSent ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8 text-brand-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Check your email</h2>
            <p className="text-sm text-gray-500">
              We&apos;ve sent a password reset link to your email address. Click the link to set a new password.
            </p>
            <button
              onClick={() => { setMode('signin'); setResetSent(false); setError('') }}
              className="inline-flex items-center gap-1.5 text-brand-600 font-semibold hover:text-brand-700 text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </button>
          </div>
        ) : (
          <>
            <form onSubmit={forgotForm.handleSubmit(onForgot)} className="space-y-3">
              <input
                {...forgotForm.register('email', { required: true })}
                type="email"
                placeholder="Email Address"
                className={inputClass}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-full transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : 'Send Reset Link'}
              </button>
            </form>
            <p className="text-center mt-4">
              <button
                onClick={() => { setMode('signin'); setError('') }}
                className="inline-flex items-center gap-1.5 text-brand-600 font-semibold hover:text-brand-700 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </button>
            </p>
          </>
        )
      ) : (
        <>
          {/* Google OAuth */}
          <button
            type="button"
            onClick={async () => {
              const supabase = createClient()
              const callbackUrl = redirectTo
                ? `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`
                : `${window.location.origin}/auth/callback`
              const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: callbackUrl },
              })
              if (error) setError(error.message)
              else if (data.url) window.location.href = data.url
            }}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3.5 rounded-full transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400">or</span>
            </div>
          </div>

          {/* Email/Password Form */}
          {mode === 'signup' ? (
            <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  {...signUpForm.register('first_name', { required: true })}
                  placeholder="First Name"
                  className={inputClass}
                />
                <input
                  {...signUpForm.register('last_name', { required: true })}
                  placeholder="Last Name"
                  className={inputClass}
                />
              </div>
              <input
                {...signUpForm.register('email', { required: true })}
                type="email"
                placeholder="Email Address"
                className={inputClass}
              />
              <div className="relative">
                <input
                  {...signUpForm.register('password', { required: true, minLength: 6 })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-full transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account...</> : 'Create Account'}
              </button>
            </form>
          ) : (
            <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-3">
              <input
                {...signInForm.register('email', { required: true })}
                type="email"
                placeholder="Email Address"
                className={inputClass}
              />
              <div className="relative">
                <input
                  {...signInForm.register('password', { required: true })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className={`${inputClass} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setError('') }}
                  className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-full transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Signing In...</> : 'Sign In'}
              </button>
            </form>
          )}

          {/* Toggle */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {mode === 'signin' ? (
              <>
                Don&apos;t have an account?{' '}
                <button onClick={() => { setMode('signup'); setError('') }} className="text-brand-600 font-semibold hover:text-brand-700">Sign Up</button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button onClick={() => { setMode('signin'); setError('') }} className="text-brand-600 font-semibold hover:text-brand-700">Sign In</button>
              </>
            )}
          </p>
        </>
      )}
    </div>
  )
}
