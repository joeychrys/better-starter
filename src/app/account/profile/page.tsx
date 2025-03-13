"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { nameSchema } from "@/lib/schemas"

// Create a schema for username update
const UsernameFormSchema = z.object({
    name: nameSchema,
})

export default function ProfilePage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const { data: session } = authClient.useSession()
    const [dialogOpen, setDialogOpen] = useState(false)

    const form = useForm<z.infer<typeof UsernameFormSchema>>({
        resolver: zodResolver(UsernameFormSchema),
        defaultValues: {
            name: "",
        },
    })

    // Update form values when session data is loaded
    useEffect(() => {
        if (session?.user?.name) {
            form.setValue("name", session.user.name)
        }
    }, [session, form])

    async function onSubmit(data: z.infer<typeof UsernameFormSchema>) {
        setLoading(true)
        try {
            await authClient.updateUser({
                name: data.name,
            })
            toast.success("Profile updated successfully")
            router.refresh() // Refresh the page to show the updated profile
            setDialogOpen(false)
        } catch (error: any) {
            toast.error(`Error: ${error.message || "Failed to update profile"}`)
        } finally {
            setLoading(false)
        }
    }

    // Get user initial for avatar
    const userInitial = session?.user?.name
        ? session.user.name.charAt(0).toUpperCase()
        : '?'

    if (!session) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Profile details</h1>
                    <p className="text-sm text-muted-foreground">
                        Loading your profile information...
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Profile details</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your profile information.
                </p>
            </div>

            <div className="bg-card border rounded-lg p-4 sm:p-6 space-y-6">
                <div className="bg-background border rounded-lg p-4 sm:p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <User className="h-5 w-5" />
                        <h3 className="text-lg font-medium">Personal Information</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-6">
                        Manage your personal details and how they appear to others
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="relative">
                            <Avatar className="h-20 w-20">
                                <AvatarFallback className="text-2xl">{userInitial}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">{session.user.name}</h2>
                            {session.user.role && (
                                <Badge variant={session.user.role === "admin" ? "destructive" : "secondary"} className="mt-1">
                                    {session.user.role}
                                </Badge>
                            )}
                        </div>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="sm:ml-auto mt-2 sm:mt-0 sm:flex-shrink-0"
                                >
                                    Edit profile
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Edit Profile</DialogTitle>
                                    <DialogDescription>
                                        Make changes to your profile information here.
                                    </DialogDescription>
                                </DialogHeader>
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Full Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter your full name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <DialogFooter>
                                            <Button
                                                type="submit"
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Saving...
                                                    </>
                                                ) : (
                                                    "Save changes"
                                                )}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-3">Email addresses</h3>
                    <div className="border rounded-md divide-y">
                        <div className="flex items-center justify-between p-4">
                            <div>
                                <p className="font-medium">{session.user.email}</p>
                                <Badge variant="outline" className="mt-1">Primary</Badge>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-3">Connected accounts</h3>
                    <div className="border rounded-md p-4 text-sm text-muted-foreground">
                        No connected accounts
                    </div>
                </div>
            </div>
        </div>
    )
}
