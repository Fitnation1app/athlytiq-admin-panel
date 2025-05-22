"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real application, you would call your API to send a reset email
    // const response = await fetch('/api/reset-password', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email })
    // })

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#dbe6fb] py-12 px-4 sm:px-6 lg:px-8">
    <Card className="w-full max-w-md bg-[#f0f4ff]">
      <CardHeader className="space-y-1">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2" asChild>
            <Link href="/login">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to login</span>
            </Link>
          </Button>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
        </div>
        <CardDescription>Enter your email address and we'll send you a link to reset your password.</CardDescription>
      </CardHeader>
      <CardContent>
        {isSubmitted ? (
          <div className="space-y-4 text-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 w-12 h-12 flex items-center justify-center mx-auto">
              <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Check your email</h3>
              <p className="text-sm text-muted-foreground">
                We've sent a password reset link to <span className="font-medium">{email}</span>
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center space-y-2">
        <div className="text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
            Back to login
          </Link>
        </div>
      </CardFooter>
    </Card>
    </div>
  )
}
