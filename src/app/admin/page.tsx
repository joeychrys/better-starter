"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient as client } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
    AlertCircle,
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Key,
    Loader2,
    LockIcon,
    MoreHorizontal,
    Plus,
    RefreshCw,
    Search,
    Shield,
    ShieldAlert,
    Trash,
    UserCircle,
    User as UserIcon,
    Users,
    X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";

interface User {
    id: string;
    email: string;
    name: string;
    role?: string;
    banned?: boolean | null;
}

interface UsersResponse {
    users: User[];
    total: number;
    limit?: number;
    offset?: number;
}

type UserRole = "admin" | "user";

type SearchParams = {
    field: "email" | "name";
    operator: "contains" | "starts_with" | "ends_with";
    value: string;
};

export default function AdminDashboard() {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newUser, setNewUser] = useState({
        email: "",
        password: "",
        name: "",
        role: "user" as UserRole,
    });
    const [isLoading, setIsLoading] = useState<string | undefined>();
    const [isBanDialogOpen, setIsBanDialogOpen] = useState(false);
    const [banForm, setBanForm] = useState({
        userId: "",
        reason: "",
        expirationDate: undefined as Date | undefined,
    });
    const [activeTab, setActiveTab] = useState("users");

    // Pagination state
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    // Search state
    const [searchTerm, setSearchTerm] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    // Debounce search term
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    // Reset to first page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm]);

    const { data: usersData, isLoading: isUsersLoading } = useQuery<UsersResponse>({
        queryKey: ["users", currentPage, pageSize, debouncedSearchTerm],
        queryFn: async () => {
            try {
                setIsSearching(!!debouncedSearchTerm);

                const queryParams: any = {
                    limit: pageSize,
                    offset: (currentPage - 1) * pageSize,
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
                    setTotalPages(Math.ceil((data.total || 0) / pageSize));
                }

                return data as UsersResponse;
            } catch (error: any) {
                toast.error(error.message || "Failed to fetch users");
                return { users: [], total: 0 } as UsersResponse;
            } finally {
                setIsSearching(false);
            }
        },
    });

    const users = usersData?.users || [];

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
        } catch (error: any) {
            toast.error(error.message || "Failed to create user");
        } finally {
            setIsLoading(undefined);
        }
    };

    const handleDeleteUser = async (id: string) => {
        setIsLoading(`delete-${id}`);
        try {
            await client.admin.removeUser({ userId: id });
            toast.success("User deleted successfully");
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });
        } catch (error: any) {
            toast.error(error.message || "Failed to delete user");
        } finally {
            setIsLoading(undefined);
        }
    };

    const handleRevokeSessions = async (id: string) => {
        setIsLoading(`revoke-${id}`);
        try {
            await client.admin.revokeUserSessions({ userId: id });
            toast.success("Sessions revoked for user");
        } catch (error: any) {
            toast.error(error.message || "Failed to revoke sessions");
        } finally {
            setIsLoading(undefined);
        }
    };

    const handleImpersonateUser = async (id: string) => {
        setIsLoading(`impersonate-${id}`);
        try {
            await client.admin.impersonateUser({ userId: id });
            toast.success("Impersonated user");
            router.push("/");
        } catch (error: any) {
            toast.error(error.message || "Failed to impersonate user");
        } finally {
            setIsLoading(undefined);
        }
    };

    const handleBanUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(`ban-${banForm.userId}`);
        try {
            if (!banForm.expirationDate) {
                throw new Error("Expiration date is required");
            }
            await client.admin.banUser({
                userId: banForm.userId,
                banReason: banForm.reason,
                banExpiresIn: banForm.expirationDate.getTime() - new Date().getTime(),
            });
            toast.success("User banned successfully");
            setIsBanDialogOpen(false);
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });
        } catch (error: any) {
            toast.error(error.message || "Failed to ban user");
        } finally {
            setIsLoading(undefined);
        }
    };

    const handleUnbanUser = async (id: string) => {
        setIsLoading(`ban-${id}`);
        try {
            await client.admin.unbanUser({
                userId: id,
            });
            queryClient.invalidateQueries({
                queryKey: ["users"],
            });
            toast.success("User unbanned successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to unban user");
        } finally {
            setIsLoading(undefined);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    const handleClearSearch = () => {
        setSearchTerm("");
    };

    const adminCount = users.filter(user => user.role === "admin").length;
    const bannedCount = users.filter(user => user.banned).length;

    return (
        <div className="container mx-auto p-6 space-y-8 max-w-7xl">
            <Toaster richColors />

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
                                                <UserIcon className="h-4 w-4" />
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
                            <LockIcon className="h-8 w-8 text-destructive" />
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
                        <ShieldAlert className="h-4 w-4" />
                        <span className="hidden md:inline">System Settings</span>
                        <span className="md:hidden">Settings</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="users" className="space-y-4">
                    <Card>
                        <CardHeader className="pb-0">
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <CardTitle>User Management</CardTitle>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => queryClient.invalidateQueries({ queryKey: ["users"] })}
                                    >
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Refresh
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            {/* Search bar */}
                            <div className="relative">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search by email..."
                                        className="pl-8 pr-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    {searchTerm && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0 h-9 w-9"
                                            onClick={handleClearSearch}
                                        >
                                            <X className="h-4 w-4" />
                                            <span className="sr-only">Clear search</span>
                                        </Button>
                                    )}
                                </div>
                                {isSearching && (
                                    <div className="absolute right-12 top-2.5">
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    </div>
                                )}
                            </div>

                            {isUsersLoading ? (
                                <div className="space-y-3">
                                    {Array(3).fill(0).map((_, i) => (
                                        <div key={i} className="flex items-center space-x-4">
                                            <Skeleton className="h-12 w-full" />
                                        </div>
                                    ))}
                                </div>
                            ) : users.length === 0 ? (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        {debouncedSearchTerm
                                            ? `No users found matching "${debouncedSearchTerm}". Try a different search term.`
                                            : "No users found. Create a new user to get started."}
                                    </AlertDescription>
                                </Alert>
                            ) : (
                                <>
                                    <div className="overflow-x-auto rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>User</TableHead>
                                                    <TableHead className="hidden md:table-cell">Email</TableHead>
                                                    <TableHead className="hidden md:table-cell">Role</TableHead>
                                                    <TableHead className="hidden md:table-cell">Status</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {users.map((user) => (
                                                    <TableRow key={user.id} className={cn(
                                                        user.banned && "bg-destructive/5"
                                                    )}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                                                    <UserIcon className="h-5 w-5 text-primary" />
                                                                </div>
                                                                <div className="flex flex-col">
                                                                    <div className="font-medium">{user.name}</div>
                                                                    <div className="text-sm text-muted-foreground md:hidden">
                                                                        {user.email}
                                                                    </div>
                                                                    <div className="md:hidden flex items-center gap-2 mt-1">
                                                                        <Badge variant={user.role === "admin" ? "default" : "outline"}>
                                                                            {user.role || "user"}
                                                                        </Badge>
                                                                        {user.banned && (
                                                                            <Badge variant="destructive">Banned</Badge>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                                                        <TableCell className="hidden md:table-cell">
                                                            <Badge variant={user.role === "admin" ? "default" : "outline"}>
                                                                {user.role || "user"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="hidden md:table-cell">
                                                            {user.banned ? (
                                                                <Badge variant="destructive">Banned</Badge>
                                                            ) : (
                                                                <Badge variant="outline">Active</Badge>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                        <span className="sr-only">Open menu</span>
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleImpersonateUser(user.id)}
                                                                        disabled={isLoading?.startsWith("impersonate")}
                                                                    >
                                                                        <UserCircle className="h-4 w-4 mr-2" />
                                                                        Impersonate
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleRevokeSessions(user.id)}
                                                                        disabled={isLoading?.startsWith("revoke")}
                                                                    >
                                                                        <Key className="h-4 w-4 mr-2" />
                                                                        Revoke Sessions
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            if (user.banned) {
                                                                                handleUnbanUser(user.id);
                                                                            } else {
                                                                                setBanForm({
                                                                                    userId: user.id,
                                                                                    reason: "",
                                                                                    expirationDate: undefined,
                                                                                });
                                                                                setIsBanDialogOpen(true);
                                                                            }
                                                                        }}
                                                                        disabled={isLoading?.startsWith("ban")}
                                                                        className={user.banned ? "text-green-600" : "text-amber-600"}
                                                                    >
                                                                        {user.banned ? (
                                                                            <>
                                                                                <Shield className="h-4 w-4 mr-2" />
                                                                                Unban User
                                                                            </>
                                                                        ) : (
                                                                            <>
                                                                                <LockIcon className="h-4 w-4 mr-2" />
                                                                                Ban User
                                                                            </>
                                                                        )}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleDeleteUser(user.id)}
                                                                        disabled={isLoading?.startsWith("delete")}
                                                                        className="text-destructive focus:text-destructive"
                                                                    >
                                                                        <Trash className="h-4 w-4 mr-2" />
                                                                        Delete User
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {/* Pagination */}
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-muted-foreground">
                                            Showing {users.length > 0 ? ((currentPage - 1) * pageSize) + 1 : 0}-
                                            {Math.min(currentPage * pageSize, totalUsers)} of {totalUsers} users
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                                disabled={currentPage === 1 || isUsersLoading}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                <span className="sr-only">Previous page</span>
                                            </Button>

                                            <div className="flex items-center text-sm gap-1">
                                                <span className="font-medium">{currentPage}</span>
                                                <span className="text-muted-foreground">of</span>
                                                <span className="font-medium">{totalPages || 1}</span>
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                                disabled={currentPage >= totalPages || isUsersLoading}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                                <span className="sr-only">Next page</span>
                                            </Button>

                                            <Select
                                                value={pageSize.toString()}
                                                onValueChange={(value) => {
                                                    setPageSize(Number(value));
                                                    setCurrentPage(1);
                                                }}
                                            >
                                                <SelectTrigger className="w-[110px]">
                                                    <SelectValue placeholder="10 per page" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="5">5 per page</SelectItem>
                                                    <SelectItem value="10">10 per page</SelectItem>
                                                    <SelectItem value="25">25 per page</SelectItem>
                                                    <SelectItem value="50">50 per page</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </>
                            )}
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

            <Dialog open={isBanDialogOpen} onOpenChange={setIsBanDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ban User</DialogTitle>
                        <DialogDescription>
                            Set a ban period and reason for this user.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleBanUser} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="reason">Reason for ban</Label>
                            <Input
                                id="reason"
                                placeholder="Violation of terms..."
                                value={banForm.reason}
                                onChange={(e) =>
                                    setBanForm({ ...banForm, reason: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="expirationDate">Ban Expiration Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="expirationDate"
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !banForm.expirationDate && "text-muted-foreground",
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {banForm.expirationDate ? (
                                            format(banForm.expirationDate, "PPP")
                                        ) : (
                                            <span>Select ban expiration date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={banForm.expirationDate}
                                        onSelect={(date) =>
                                            setBanForm({ ...banForm, expirationDate: date })
                                        }
                                        initialFocus
                                        disabled={(date) => date < new Date()}
                                    />
                                </PopoverContent>
                            </Popover>
                            {!banForm.expirationDate && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Select a future date when the ban will expire
                                </p>
                            )}
                        </div>
                        <DialogFooter className="mt-6">
                            <Button
                                type="submit"
                                variant="destructive"
                                className="w-full"
                                disabled={isLoading === `ban-${banForm.userId}`}
                            >
                                {isLoading === `ban-${banForm.userId}` ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Banning...
                                    </>
                                ) : (
                                    "Ban User"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
