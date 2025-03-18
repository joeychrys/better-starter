import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function PasswordChangeDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"outline"}>Change Password</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Change your password to keep your account secure
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}
