import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';

export function RegisterDialog() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !phone) {
            toast.error('Please fill all fields');
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            toast.error('Phone number must be exactly 10 digits');
            return;
        }

        setIsLoading(true);

        try {
            // Get existing users from localStorage
            const existingUsersJson = localStorage.getItem('registeredUsers');
            const existingUsers = existingUsersJson ? JSON.parse(existingUsersJson) : [];

            // Check if phone already registered
            const phoneExists = existingUsers.some((user: any) => user.phone === phone);
            if (phoneExists) {
                toast.error('Phone number already registered');
                setIsLoading(false);
                return;
            }

            // Create new user
            const newUser = {
                id: Date.now(),
                name,
                phone,
                created_at: new Date().toISOString()
            };

            // Add to users list
            existingUsers.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

            // Set as current user
            localStorage.setItem('user', JSON.stringify({ name, phone }));

            toast.success('Registration Successful', { description: `Welcome, ${name}!` });
            setOpen(false);
            setName('');
            setPhone('');
            window.location.reload(); // Refresh to show user in header
        } catch (error) {
            toast.error('Registration Failed', { description: 'Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Account</DialogTitle>
                    <DialogDescription>
                        Enter your details to register
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleRegister}>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="register-name">Full Name</Label>
                            <Input
                                id="register-name"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="register-phone">Phone Number</Label>
                            <Input
                                id="register-phone"
                                type="tel"
                                placeholder="Enter your phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isLoading} className="w-full">
                            {isLoading ? 'Registering...' : 'Register'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
