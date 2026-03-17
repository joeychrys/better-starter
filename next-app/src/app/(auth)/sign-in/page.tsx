"use client"

import { useForm } from "@tanstack/react-form"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { GoogleIcon } from "@/components/icons/google-icon"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { authClient } from "@/lib/auth-client"
import { SignInFormSchema } from "@/lib/schemas"

export default function SignInPage() {
  const [loading, setLoading] = useState(false)
  const [googleSignInPending, setGoogleSignInPending] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: SignInFormSchema,
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email({
        email: value.email,
        password: value.password,
        callbackURL: callbackUrl,
        fetchOptions: {
          onResponse: () => {
            setLoading(false)
          },
          onRequest: () => {
            setLoading(true)
          },
          onError: (ctx) => {
            toast.error(`Uh Oh! ${ctx.error.message}`)
          },
          onSuccess: async () => {
            router.push(callbackUrl)
          },
        },
      })
    },
  })

  async function handleGoogleSignIn() {
    try {
      await authClient.signIn.social({
        provider: "google",
        fetchOptions: {
          onRequest: () => setGoogleSignInPending(true),
          onResponse: () => setGoogleSignInPending(false),
          onError: (ctx) => {
            toast.error(`Uh Oh! ${ctx.error.message}`)
          },
        },
      })
    } catch (error: unknown) {
      let errorMessage = "Failed to sign in with Google"
      if (error instanceof Error) {
        errorMessage = error.message
      }
      toast.error(`Error: ${errorMessage}`)
    } finally {
      setGoogleSignInPending(false)
    }
  }

  return (
    <>
      <section className="mx-auto max-w-md p-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Enter the following information to sign in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              {/* Sign In Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  form.handleSubmit()
                }}
                className="flex flex-col gap-6"
              >
                <FieldGroup>
                  <form.Field name="email">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="better@auth.com"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      )
                    }}
                  </form.Field>

                  <form.Field name="password">
                    {(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                          <PasswordInput
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            autoComplete="current-password"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      )
                    }}
                  </form.Field>
                </FieldGroup>

                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Social Sign In */}
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
              <Button
                onClick={handleGoogleSignIn}
                variant={"outline"}
                disabled={googleSignInPending}
              >
                <div className="flex h-4 w-4 items-center justify-center">
                  {googleSignInPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <GoogleIcon />
                  )}
                </div>
                <span className="text-sm">Sign in with Google</span>
              </Button>

              {/* Sign Up Link */}
              <div className="flex w-full justify-center space-x-2">
                <span>Don&apos;t have an account?</span>
                <Link
                  className="underline"
                  href={
                    callbackUrl !== "/"
                      ? `/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`
                      : "/sign-up"
                  }
                >
                  Sign up
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  )
}
