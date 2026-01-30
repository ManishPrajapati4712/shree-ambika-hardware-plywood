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
            const response = await fetch(`/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    phone,
                    email: `${phone}@placeholder.com`, // Generate placeholder email
                    password: 'default123' // Default password since it's required by DB
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store user in localStorage
                const user = { name, phone };
                localStorage.setItem('user', JSON.stringify(user));

                toast.success('Registration Successful', { description: `Welcome, ${name}!` });
                setOpen(false);
                setName('');
                setPhone('');
                window.location.reload(); // Refresh to show user in header
            } else {
                toast.error('Registration Failed', { description: data.error });
            }
        } catch (error) {
            toast.error('Connection Error', { description: 'Could not connect to the server.' });
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
