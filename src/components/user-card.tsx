"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Session } from "@/lib/types"
import { CalendarDays, Mail, User } from "lucide-react"
import Link from "next/link"

interface UserCardProps {
    session: Session | null
    showEditButton?: boolean
}

export function UserCard({ session, showEditButton = true }: UserCardProps) {
    if (!session) {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader className="pb-2">
                    <CardTitle>Not signed in</CardTitle>
                    <CardDescription>Sign in to view your profile</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                            <AvatarFallback>?</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="text-sm font-medium">Guest</p>
                            <p className="text-xs text-muted-foreground">Not signed in</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link href="/sign-in">Sign In</Link>
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    const user = session.user
    const userInitial = user.name ? user.name.charAt(0).toUpperCase() : '?'
    const createdAt = user.createdAt ? new Date(user.createdAt) : null

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{user.name || "User"}</CardTitle>
                        <CardDescription>{user.email}</CardDescription>
                    </div>
                    {user.role && (
                        <Badge variant={user.role === "admin" ? "destructive" : "secondary"}>
                            {user.role}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pb-2">
                <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                        <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <div className="flex items-center text-sm">
                            <User className="mr-1 h-4 w-4 opacity-70" />
                            <span className="text-xs text-muted-foreground">
                                {user.name || "No name provided"}
                            </span>
                        </div>
                        <div className="flex items-center text-sm">
                            <Mail className="mr-1 h-4 w-4 opacity-70" />
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                        {createdAt && (
                            <div className="flex items-center text-sm">
                                <CalendarDays className="mr-1 h-4 w-4 opacity-70" />
                                <span className="text-xs text-muted-foreground">
                                    Joined {createdAt.toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
            {showEditButton && (
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link href="/account/profile">Edit Profile</Link>
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
} 