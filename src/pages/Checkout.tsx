import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Copy, Loader2, MapPin, CreditCard, ChevronRight, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { storeInfo } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(1); // 1: Delivery, 2: Payment
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminUpi, setAdminUpi] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    address: '',
    city: ''
  });

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }

    const user = JSON.parse(userJson);
    setFormData(prev => ({
      ...prev,
      name: user.name || '',
      mobile: user.phone || ''
    }));

    // Fetch Admin UPI ID
    fetch(`${import.meta.env.VITE_API_URL}/api/admin/upi`)
      .then(res => res.json())
      .then(data => {
        if (data.upiId) setAdminUpi(data.upiId);
      })
      .catch(err => console.error("Failed to fetch UPI ID", err));

  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(adminUpi);
    toast.success("UPI ID copied to clipboard!");
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.mobile || !formData.address || !formData.city) {
      toast.error('Please fill all required delivery fields');
      return false;
    }
    if (!/^[0-9]{10}$/.test(formData.mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return false;
    }
    return true;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      handleNextStep(e);
      return;
    }

    // Payment Step Validation
    if (paymentMethod === 'UPI') {
      if (!transactionId || transactionId.length < 12) {
        toast.error("Please enter a valid 12-digit Transaction ID/UTR");
        return;
      }
    }

    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const orderData = {
        user_id: user.id,
        items: items,
        total_amount: totalPrice,
        shipping_address: formData.address,
        city: formData.city,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'UPI' ? 'Success' : 'Pending', // Verified by UTR
        transaction_id: paymentMethod === 'UPI' ? transactionId : null
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setIsSubmitted(true);
        clearCart();
        toast.success("Order placed successfully!");
      } else {
        const error = await response.json();
        // Specific error handling for Payment Verification
        if (error.error && error.error.includes("Payment")) {
          toast.error("Payment Verification Failed", {
            description: error.error
          });
        } else {
          throw new Error(error.error || 'Failed to place order');
        }
      }
    } catch (error: any) {
      // Don't toast effectively if we already toasted specific payment error above
      if (!error.message || !error.message.includes("Payment")) {
        toast.error(error.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  // Construct UPI URL for intent
  const upiUrl = `upi://pay?pa=${adminUpi}&pn=${encodeURIComponent(storeInfo.name)}&am=${totalPrice}&tn=Order Payment`;

  if (items.length === 0 && !isSubmitted) {
    navigate('/products');
    return null;
  }

  if (isSubmitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 bg-muted/30">
        <Card className="max-w-md w-full text-center animate-scale-in border-success/50">
          <CardContent className="pt-8 pb-8">
            <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-6">
              Your order has been placed successfully.
            </p>
            <div className="bg-muted p-4 rounded-lg mb-6 text-sm">
              <div className="flex justify-between mb-2">
                <span>Payment Method:</span>
                <span className="font-medium">{paymentMethod}</span>
              </div>
              {paymentMethod === 'UPI' && (
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-mono">{transactionId}</span>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <Link to="/products">
                <Button className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-muted/30">
      <div className="container max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/products" className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-display font-bold">Checkout</h1>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-primary bg-primary text-primary-foreground' : 'border-current'}`}>
              1
            </div>
            <span className="font-medium">Details</span>
          </div>
          <div className="flex-1 h-[2px] bg-border" />
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-primary bg-primary text-primary-foreground' : 'border-current'}`}>
              2
            </div>
            <span className="font-medium">Payment</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Delivery Details */}
          {step === 1 && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleChange} required disabled className="bg-muted" />
                </div>
                <div>
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <Input id="mobile" name="mobile" type="tel" value={formData.mobile} onChange={handleChange} maxLength={10} required disabled className="bg-muted" />
                </div>
                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Textarea id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Enter complete address (House No, Street, Landmark)" rows={3} required />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" name="city" value={formData.city} onChange={handleChange} required placeholder="Enter City" />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" size="lg">
                  Proceed to Payment <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup defaultValue={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <RadioGroupItem value="UPI" id="upi" className="peer sr-only" />
                    <Label htmlFor="upi" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all">
                      <span className="text-3xl mb-2">📱</span>
                      <span className="font-semibold">UPI Payment</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="Cash" id="cash" className="peer sr-only" />
                    <Label htmlFor="cash" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all">
                      <span className="text-3xl mb-2">💵</span>
                      <span className="font-semibold">Cash on Delivery</span>
                    </Label>
                  </div>
                </RadioGroup>

                {/* UPI Payment Section */}
                {paymentMethod === 'UPI' && (
                  <div className="bg-muted/30 p-6 rounded-lg border border-border animate-in fade-in slide-in-from-top-2">
                    <Alert className="mb-6 bg-blue-50 border-blue-200">
                      <AlertCircle className="h-4 w-4 text-blue-600" />
                      <AlertTitle className="text-blue-800">Payment Instructions</AlertTitle>
                      <AlertDescription className="text-blue-700">
                        Scan QR or use buttons below. After payment, <strong>you MUST enter the Transaction ID</strong> to confirm your order.
                      </AlertDescription>
                    </Alert>

                    <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-8">
                      {/* QR Code */}
                      <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
                        {adminUpi ? (
                          <QRCodeSVG value={upiUrl} size={160} level="H" />
                        ) : (
                          <div className="w-[160px] h-[160px] flex items-center justify-center text-muted-foreground">Loading...</div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">Scan with any UPI App</p>
                      </div>

                      {/* App Buttons */}
                      <div className="space-y-3 w-full max-w-xs">
                        <p className="text-sm font-medium text-center mb-2">Tap to Pay with:</p>
                        <a href={upiUrl} target="_blank" rel="noreferrer" className="block w-full">
                          <Button variant="outline" className="w-full justify-start h-12 text-blue-600 border-blue-200 hover:bg-blue-50">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/PhonePe_Logo.svg/1200px-PhonePe_Logo.svg.png" alt="PhonePe" className="h-6 object-contain mr-3" />
                            PhonePe
                          </Button>
                        </a>
                        <a href={upiUrl} target="_blank" rel="noreferrer" className="block w-full">
                          <Button variant="outline" className="w-full justify-start h-12 text-blue-600 border-blue-200 hover:bg-blue-50">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="GPay" className="h-6 object-contain mr-3" />
                            Google Pay
                          </Button>
                        </a>
                        <a href={upiUrl} target="_blank" rel="noreferrer" className="block w-full">
                          <Button variant="outline" className="w-full justify-start h-12 text-blue-600 border-blue-200 hover:bg-blue-50">
                            <span className="font-bold mr-3 text-lg">Paytm</span> Paytm
                          </Button>
                        </a>
                      </div>
                    </div>

                    {/* UPI Details & Copy */}
                    <div className="flex items-center justify-center gap-2 mb-6 bg-background p-2 rounded-md border border-dashed">
                      <span className="text-sm text-muted-foreground">UPI ID:</span>
                      <code className="font-mono font-medium">{adminUpi}</code>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyUpi}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Verification Input */}
                    <div className="space-y-2">
                      <Label htmlFor="txnId" className="text-base font-semibold">Enter Transaction ID / UTR *</Label>
                      <Input
                        id="txnId"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        placeholder="e.g. 123456789012"
                        className="h-12 text-lg tracking-wide"
                        maxLength={12}
                      />
                      <p className="text-xs text-muted-foreground">
                        Enter the 12-digit UTR number found in your payment app after successful transaction.
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-8 space-y-4">
                  <div className="flex justify-between items-center text-lg font-bold border-t pt-4">
                    <span>Total Amount</span>
                    <span className="text-primary">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

              </CardContent>
              <CardFooter className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1" type="button">
                  Change Details
                </Button>
                <Button
                  type="submit"
                  className="flex-[2]"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </form>
      </div>
    </div>
  );
};

export default Checkout;
