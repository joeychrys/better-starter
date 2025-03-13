"use client"

import { TableCard } from "@/components/tables/user-table/table-card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { authClient as client } from "@/lib/auth-client"
import { User } from "@/lib/types"
import { useDebounce } from "@/lib/use-debounce"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { AlertCircle, Loader2, Plus, Shield, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface UsersResponse {
    users: User[];
    total: number;
    limit?: number;
}

type UserRole = "admin" | "user";

export default function AdminPage() {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("users");

    // Add User state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        email: "",
        password: "",
        name: "",
        role: "user" as UserRole,
    });
    const [isLoading, setIsLoading] = useState<string | undefined>();

    // Pagination state
    const [pagination, setPagination] = useState({
        pageIndex: 0, // 0-based index
        pageSize: 5,
    });

    // Derived values for convenience
    const currentPage = pagination.pageIndex + 1; // Convert to 1-based for display
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    // Search state
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [isSearching, setIsSearching] = useState(false);

    // Reset to first page when search changes
    useEffect(() => {
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, [debouncedSearchTerm]);

    // Main users query
    const { data: usersData, isLoading: isUsersLoading } = useQuery<UsersResponse>({
        queryKey: ["users", pagination.pageIndex, pagination.pageSize, debouncedSearchTerm],
        queryFn: async () => {
            try {
                setIsSearching(!!debouncedSearchTerm);

                const queryParams: any = {
                    limit: pagination.pageSize,
                    offset: pagination.pageIndex * pagination.pageSize, // 0-based index * pageSize
                    sortBy: "createdAt",
                    sortDirection: "desc",
                };

                // Add search parameters if there's a search term
                if (debouncedSearchTerm) {
                    queryParams.searchField = "email";
                    queryParams.searchOperator = "contains";
                    queryParams.searchValue = debouncedSearchTerm;
                }

                const data = await client.admin.listUsers(
                    {
                        query: queryParams
                    },
                    {
                        throw: true,
                    },
                );

                // Update pagination state
                if (data) {
                    setTotalUsers(data.total || 0);
                    setTotalPages(Math.ceil((data.total || 0) / pagination.pageSize));
                }

                return data as UsersResponse;
            } catch (error: any) {
                toast.error(error.message || "Failed to fetch users");
                return { users: [], total: 0, limit: 0 } as UsersResponse;
            } finally {
                setIsSearching(false);
            }
        },
    });

    // Admin count query
    const { data: adminCountData } = useQuery<UsersResponse>({
        queryKey: ["users-admin-count"],
        queryFn: async () => {
            try {
                const data = await client.admin.listUsers(
                    {
                        query: {
                            limit: 1,
                            filterField: "role",
                            filterOperator: "eq",
                            filterValue: "admin",
                        }
                    },
                    {
                        throw: true,
                    },
                );
                return data as UsersResponse;
            } catch (error: any) {
                console.error("Failed to fetch admin count:", error);
                return { users: [], total: 0, limit: 0 } as UsersResponse;
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Banned count query
    const { data: bannedCountData } = useQuery<UsersResponse>({
        queryKey: ["users-banned-count"],
        queryFn: async () => {
            try {
                const data = await client.admin.listUsers(
                    {
                        query: {
                            limit: 1,
                            filterField: "banned",
                            filterOperator: "eq",
                            filterValue: true,
                        }
                    },
                    {
                        throw: true,
                    },
                );
                return data as UsersResponse;
            } catch (error: any) {
                console.error("Failed to fetch banned count:", error);
                return { users: [], total: 0, limit: 0 } as UsersResponse;
            }
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    const adminCount = adminCountData?.total || 0;
    const bannedCount = bannedCountData?.total || 0;

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading("create");
        try {
            await client.admin.createUser({
                email: newUser.email,
                password: newUser.password,
                name: newUser.name,
                role: newUser.role,
            });
            toast.success("User created successfully");
            setNewUser({ email: "", password: "", name: "", role: "user" });
            setIsDialogOpen(false);
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });
            // Also invalidate our count queries
            queryClient.invalidateQueries({
                queryKey: ["users-admin-count"],
            });
            queryClient.invalidateQueries({
                queryKey: ["users-banned-count"],
            });
        } catch (error: any) {
            toast.error(error.message || "Failed to create user");
        } finally {
            setIsLoading(undefined);
        }
    };

    const handleClearSearch = () => {
        setSearchTerm("");
    }

    return (
        <div className="container mx-auto p-6 space-y-8 max-w-7xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage users and system settings</p>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create New User</DialogTitle>
                            <DialogDescription>
                                Create a new user account with specific permissions.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateUser} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="user@example.com"
                                    value={newUser.email}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, email: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={newUser.password}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, password: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    value={newUser.name}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, name: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                    value={newUser.role}
                                    onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                <span>User</span>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="admin">
                                            <div className="flex items-center gap-2">
                                                <Shield className="h-4 w-4" />
                                                <span>Admin</span>
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <DialogFooter className="mt-6">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading === "create"}
                                >
                                    {isLoading === "create" ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create User"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Total Users
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold">
                                {isUsersLoading ? (
                                    <Skeleton className="h-8 w-16" />
                                ) : (
                                    totalUsers
                                )}
                            </div>
                            <Users className="h-8 w-8 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Admin Users
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold">
                                {isUsersLoading ? (
                                    <Skeleton className="h-8 w-16" />
                                ) : (
                                    adminCount
                                )}
                            </div>
                            <Shield className="h-8 w-8 text-primary" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            Banned Users
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold">
                                {isUsersLoading ? (
                                    <Skeleton className="h-8 w-16" />
                                ) : (
                                    bannedCount
                                )}
                            </div>
                            <Shield className="h-8 w-8 text-destructive" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
                    <TabsTrigger value="users" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span className="hidden md:inline">User Management</span>
                        <span className="md:hidden">Users</span>
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        <span className="hidden md:inline">System Settings</span>
                        <span className="md:hidden">Settings</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-4">
                    <Card>
                        <CardHeader className="pb-0">
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <CardTitle>User Management</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            {/* Search bar */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            placeholder="Search users..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-[300px]"
                                        />
                                        {searchTerm && (
                                            <Button variant="ghost" onClick={handleClearSearch}>
                                                Clear
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {isUsersLoading || isSearching ? (
                                    <div className="flex justify-center items-center h-[300px]">
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                    </div>
                                ) : (
                                    <TableCard
                                        data={usersData?.users || []}
                                        totalRows={totalUsers}
                                        pagination={pagination}
                                        onPaginationChange={setPagination}
                                    />
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>System Settings</CardTitle>
                            <CardDescription>
                                Configure system-wide settings and permissions
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert>
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>
                                    System settings will be implemented in a future update.
                                </AlertDescription>
                            </Alert>
                            {/* Placeholder for future settings */}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
} 