import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const ForgotPassword = () => {
    const [step, setStep] = useState(1); // 1: Method Select, 2: OTP & New Password
    const [method, setMethod] = useState<'phone' | 'email'>('phone');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [serverOtp, setServerOtp] = useState(''); // Store the simulated OTP from server
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = method === 'phone' ? { phone } : { email };

        try {
            const response = await fetch(`/api/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('OTP Sent', { description: `Your OTP is: ${data.otp}` }); // Displaying OTP for simulation
                setServerOtp(data.otp.toString());
                setStep(2);
            } else {
                toast.error('Failed', { description: data.error });
            }
        } catch (error) {
            toast.error('Connection Error', { description: 'Could not connect to the server.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (otp !== serverOtp) {
            toast.error('Invalid OTP', { description: 'Please enter the correct OTP.' });
            return;
        }

        setIsLoading(true);
        const payload = method === 'phone' ? { phone, newPassword } : { email, newPassword };

        try {
            const response = await fetch(`/api/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success('Password Reset Successful', { description: 'You can now login with your new password.' });
                navigate('/login');
            } else {
                toast.error('Reset Failed', { description: data.error });
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
                    <CardTitle className="text-2xl font-bold tracking-tight text-center">
                        {step === 1 ? 'Forgot Password' : 'Reset Password'}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {step === 1
                            ? 'Enter your details to receive an OTP'
                            : 'Enter the OTP and your new password'}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={step === 1 ? handleSendOtp : handleResetPassword}>
                    <CardContent className="space-y-4">
                        {step === 1 ? (
                            <>
                                <div className="flex gap-2 p-1 bg-muted rounded-lg mb-4">
                                    <button
                                        type="button"
                                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${method === 'phone' ? 'bg-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                        onClick={() => setMethod('phone')}
                                    >
                                        Use Phone
                                    </button>
                                    <button
                                        type="button"
                                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${method === 'email' ? 'bg-white shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                                        onClick={() => setMethod('email')}
                                    >
                                        Use Email
                                    </button>
                                </div>

                                {method === 'phone' ? (
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
                                ) : (
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="otp">Enter OTP</Label>
                                    <Input
                                        id="otp"
                                        type="text"
                                        placeholder="Enter 4-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full bg-accent hover:bg-accent/90 text-white" type="submit" disabled={isLoading}>
                            {isLoading
                                ? 'Processing...'
                                : step === 1 ? 'Send OTP' : 'Reset Password'}
                        </Button>
                        <div className="text-center text-sm text-muted-foreground">
                            Remember your password?{' '}
                            <Link to="/login" className="font-semibold text-accent hover:text-accent/80 transition-colors">
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default ForgotPassword;
