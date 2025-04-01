"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail, ArrowRight } from "lucide-react"

// Test user credentials - defined here to ensure consistency
const TEST_USER = {
  email: "test@example.com",
  password: "password123",
  name: "Test User",
  hasData: true,
}

// Admin credentials for demo purposes
const ADMIN_EMAIL = "admin@m8bs.com"

export default function AuthPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [animateForm, setAnimateForm] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: TEST_USER.email,
    password: TEST_USER.password,
    rememberMe: true,
  })

  // Add animation class after a short delay
  useEffect(() => {
    setTimeout(() => {
      setAnimateForm(true)
    }, 100)
  }, [])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setLoginError(null)

    try {
      // Check if this is an admin login
      if (loginForm.email === ADMIN_EMAIL) {
        // Redirect to admin login page
        router.push("/admin/login")
        return
      }

      // Check if it's the test user
      if (loginForm.email === TEST_USER.email && loginForm.password === TEST_USER.password) {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Create test user data
        const testUserData = {
          email: TEST_USER.email,
          name: TEST_USER.name,
          isLoggedIn: true,
          hasData: true,
        }

        // Store user info in localStorage
        localStorage.setItem("user", JSON.stringify(testUserData))
        localStorage.setItem("hasData", "true")
        localStorage.setItem("onboardingComplete", "true")

        // Redirect to dashboard
        router.push("/dashboard")
        return
      }

      // If not test user, show error
      setLoginError("Invalid email or password")
    } catch (error) {
      console.error("Login error:", error)
      setLoginError("An error occurred during login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#050117] to-[#0a0a29] text-white">
      {/* Left side - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-[45%] xl:px-12">
        <div className="mx-auto w-full max-w-sm lg:w-[450px]">
          <div className="mb-8 flex items-center">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#2c7be5] to-[#27bcfd] flex items-center justify-center mr-3 shadow-lg shadow-[#2c7be5]/30">
              <span className="text-xl font-bold text-white">M8BS</span>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
              Marketing Dashboard
            </h1>
          </div>

          <div
            className={`mb-8 transition-all duration-500 ${animateForm ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
              Welcome back
            </h2>
            <p className="mt-2 text-base text-[#5e6e82]">Enter your credentials to access your account</p>
          </div>

          {loginError && (
            <div className="mb-6 rounded-md bg-[#e63757]/10 p-4 text-[#e63757] border border-[#e63757]/20 animate-pulse">
              {loginError}
            </div>
          )}

          <form
            onSubmit={handleLoginSubmit}
            className={`space-y-6 transition-all duration-500 ${animateForm ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <div>
              <label htmlFor="email" className="block text-sm font-bold mb-1 text-white">
                Email Address
              </label>
              <div className="relative group">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full pl-10 pr-3 py-3 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium transition-all duration-200 group-hover:border-[#2c7be5]/60"
                  placeholder="your@email.com"
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5e6e82] group-hover:text-[#2c7be5] transition-colors duration-200" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold mb-1 text-white">
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full pl-10 pr-10 py-3 bg-[#050117] border border-[#215cac]/40 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2c7be5] text-white text-base font-medium transition-all duration-200 group-hover:border-[#2c7be5]/60"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#5e6e82] group-hover:text-[#2c7be5] transition-colors duration-200" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5e6e82] hover:text-white transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={loginForm.rememberMe}
                      onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                      className="sr-only" // Hide the actual checkbox
                    />
                    <div
                      className={`w-4 h-4 rounded border ${loginForm.rememberMe ? "bg-[#2c7be5] border-[#2c7be5]" : "bg-[#050117] border-[#215cac]/40"} transition-colors duration-200`}
                    >
                      {loginForm.rememberMe && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="ml-2 text-sm text-[#5e6e82]">Remember me</span>
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-[#2c7be5] hover:text-[#27bcfd] transition-colors duration-200">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center items-center gap-2 rounded-md bg-gradient-to-r from-[#2c7be5] to-[#27bcfd] px-4 py-3 text-base font-bold text-white shadow-lg shadow-[#2c7be5]/20 hover:shadow-[#2c7be5]/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#2c7be5] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Sign in
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#27bcfd] to-[#2c7be5] opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-[#5e6e82]">
                This is a demo application. Use the pre-filled test credentials to log in.
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-[55%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2c7be5]/20 to-[#27bcfd]/20">
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
            <div className="w-full max-w-xl">
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-white mb-4">Optimize Your Marketing Performance</h2>
                <p className="text-lg text-white/80">
                  Track, analyze, and improve your marketing campaigns with our comprehensive dashboard.
                </p>
              </div>

              <div className="rounded-lg bg-[#0a0a29]/70 border border-[#215cac]/20 p-6 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#2c7be5] to-[#27bcfd] flex items-center justify-center shadow-lg shadow-[#2c7be5]/30">
                    <span className="text-xl font-bold text-white">M8BS</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Marketing Dashboard</h3>
                    <p className="text-sm text-white/70">Real-time analytics at your fingertips</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded bg-[#050117]/50 p-4 border border-[#215cac]/20 transition-all duration-300 hover:border-[#2c7be5]/40 hover:bg-[#050117]/70">
                    <h4 className="text-sm font-bold text-white mb-1">ROI</h4>
                    <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
                      274%
                    </p>
                  </div>
                  <div className="rounded bg-[#050117]/50 p-4 border border-[#215cac]/20 transition-all duration-300 hover:border-[#2c7be5]/40 hover:bg-[#050117]/70">
                    <h4 className="text-sm font-bold text-white mb-1">Conversion Rate</h4>
                    <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
                      7.1%
                    </p>
                  </div>
                  <div className="rounded bg-[#050117]/50 p-4 border border-[#215cac]/20 transition-all duration-300 hover:border-[#2c7be5]/40 hover:bg-[#050117]/70">
                    <h4 className="text-sm font-bold text-white mb-1">Annuities Sold</h4>
                    <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
                      2
                    </p>
                  </div>
                  <div className="rounded bg-[#050117]/50 p-4 border border-[#215cac]/20 transition-all duration-300 hover:border-[#2c7be5]/40 hover:bg-[#050117]/70">
                    <h4 className="text-sm font-bold text-white mb-1">Total Income</h4>
                    <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[#d8e2ef]">
                      $258,991
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>

        {/* Animated gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-tr from-[#050117]/50 via-transparent to-[#2c7be5]/30 animate-pulse"
          style={{ animationDuration: "8s" }}
        ></div>
      </div>
    </div>
  )
}

