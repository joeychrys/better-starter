"use client"

export default function DashboardPage() {

    return (
        <div className="container mx-auto max-w-2xl m-8 p-8 border rounded-lg">
            <h1 className="text-2xl font-bold">Dashboard Page</h1>
            <p className="text-muted-foreground">Welcome to your dashboard</p>
            <p className="text-muted-foreground">This page is protected and can only be accessed by authenticated users.</p>
        </div>
    )
}