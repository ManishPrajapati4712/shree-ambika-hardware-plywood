import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { storeInfo } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
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

    // Autofill user details
    const user = JSON.parse(userJson);
    setFormData(prev => ({
      ...prev,
      name: user.name || '',
      mobile: user.phone || ''
    }));
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const [lastOrderMessage, setLastOrderMessage] = useState('');

  const generateWhatsAppMessage = (currentItems: typeof items, data: typeof formData) => {
    const orderDetails = currentItems.map(item =>
      `• ${item.name} x ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');

    const total = currentItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    return encodeURIComponent(
      `*New Order from Website*\n\n` +
      `*Customer Details:*\n` +
      `User ID: ${user.id || 'N/A'}\n` +
      `Name: ${data.name}\n` +
      `Mobile: ${data.mobile}\n` +
      `Address: ${data.address}\n` +
      `City: ${data.city}\n\n` +
      `*Order Details:*\n${orderDetails}\n\n` +
      `*Total: ₹${total.toLocaleString()}*`
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.mobile || !formData.address || !formData.city) {
      toast.error('Please fill all required fields');
      return;
    }

    // Validate mobile number
    if (!/^[0-9]{10}$/.test(formData.mobile)) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }

    // Generate message BEFORE clearing cart
    const message = generateWhatsAppMessage(items, formData);
    setLastOrderMessage(message);

    // Open WhatsApp immediately
    window.open(`https://wa.me/${storeInfo.whatsapp}?text=${message}`, '_blank');

    setIsSubmitted(true);
    clearCart();
  };

  const handleWhatsAppOrder = () => {
    if (lastOrderMessage) {
      window.open(`https://wa.me/${storeInfo.whatsapp}?text=${lastOrderMessage}`, '_blank');
    }
  };

  if (items.length === 0 && !isSubmitted) {
    navigate('/cart');
    return null;
  }

  if (isSubmitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center animate-scale-in">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-2xl font-display font-bold mb-2">Order Confirmed!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for your order. We will contact you shortly to confirm the details.
            </p>
            <div className="space-y-3">
              <Button onClick={handleWhatsAppOrder} className="w-full bg-whatsapp hover:bg-whatsapp/90">
                <MessageCircle className="h-4 w-4 mr-2" />
                Send Order via WhatsApp Again
              </Button>
              <Link to="/products">
                <Button variant="outline" className="w-full">
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
    <div className="min-h-screen py-8">
      <div className="container max-w-4xl">
        <Link to="/cart" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-display font-bold mb-8">Checkout</h1>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Order Form */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div>
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <Input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    required
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter complete address with landmark"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city name"
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full mt-6">
                  Place Order
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 py-3 border-b last:border-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium line-clamp-1">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-primary">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-success">To be confirmed</span>
                </div>
                <div className="flex justify-between font-display font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
