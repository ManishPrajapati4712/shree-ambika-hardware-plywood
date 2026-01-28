import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Login = () => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Login Successful', { description: data.message });
                localStorage.setItem('user', JSON.stringify(data.user)); // Simple auth persistence
                navigate('/');
            } else {
                toast.error('Login Failed', { description: data.error });
            }
        } catch (error) {
            toast.error('Connection Error', { description: 'Could not connect to the server.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4 py-12 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md shadow-xl border-t-4 border-t-accent">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight text-center" style={{ fontFamily: 'Arial', fontWeight: 'bold' }}>WELCOM TO THE SHREE AMBIKA HARDWARE & PLYWOOD</CardTitle>
                    <CardDescription className="text-center">
                        Enter your phone number and password to access your account
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="Enter your phone number"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full bg-accent hover:bg-accent/90 text-white" type="submit" disabled={isLoading}>
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </Button>
                        <div className="text-center text-sm text-muted-foreground">
                            Don&apos;t have an account?{' '}
                            <Link to="/register" className="font-semibold text-accent hover:text-accent/80 transition-colors">
                                Register
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default Login;
