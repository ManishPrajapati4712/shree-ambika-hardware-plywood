import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Package, Users } from 'lucide-react';
import { categories, Product } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useProducts } from '@/context/ProductContext';
import { useOffer } from '@/context/OfferContext';
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const Admin = () => {
  const { products, addProduct, updateProduct, deleteProduct: removeProduct } = useProducts();
  const { offerText, setOfferText, isVisible: isOfferVisible, setIsVisible: setIsOfferVisible, backgroundColor: offerColor, setBackgroundColor: setOfferColor } = useOffer();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState("products");
  const [users, setUsers] = useState<any[]>([]);




  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    category: '',
    image: '',
    description: '',
    size: '',
    thickness: '',
    popular: false
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (activeTab === 'users' && isAuthenticated) {
      fetch(`${import.meta.env.VITE_API_URL}/api/users`)
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(err => console.error("Failed to fetch users", err));
    }
  }, [activeTab, isAuthenticated]);



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const openAddDialog = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: 0,
      category: '',
      image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop',
      description: '',
      size: '',
      thickness: '',
      popular: false
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData(product);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill all required fields');
      return;
    }

    if (editingProduct) {
      // Update existing product
      updateProduct({ ...editingProduct, ...formData } as Product);
    } else {
      // Add new product
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: formData.name!,
        price: formData.price!,
        category: formData.category!,
        image: formData.image || 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&h=400&fit=crop',
        description: formData.description || '',
        size: formData.size,
        thickness: formData.thickness,
        popular: formData.popular || false
      };
      addProduct(newProduct);
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      removeProduct(productId);
    }
  };

  const [step, setStep] = useState<'CREDENTIALS' | 'OTP'>('CREDENTIALS');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (step === 'CREDENTIALS') {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, password }),
        });

        if (!response.ok) {
          const text = await response.text();
          try {
            const json = JSON.parse(text);
            toast.error(json.error || 'Login failed');
          } catch {
            toast.error(`Server Error: ${response.status} ${response.statusText}`);
            console.error('Non-JSON response:', text);
          }
          return;
        }

        const data = await response.json();
        toast.success('Credentials Verified', { description: `OTP sent to ${phone}` });
        setStep('OTP');
        if (data.otp) console.log('Dev OTP:', data.otp);

      } else {
        // OTP Step
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/verify-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, otp }),
        });

        if (!response.ok) {
          const text = await response.text();
          try {
            const json = JSON.parse(text);
            toast.error(json.error || 'Invalid OTP');
          } catch {
            toast.error(`Server Error: ${response.status} ${response.statusText}`);
          }
          return;
        }

        const data = await response.json();
        toast.success('Login Successful');
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Connection Error: Is the server running?');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              {step === 'CREDENTIALS' ? 'Enter admin credentials' : 'Enter OTP sent to your phone'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {step === 'CREDENTIALS' ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="admin-phone">Phone Number</Label>
                    <Input
                      id="admin-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter admin phone"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="admin-otp">Enter OTP</Label>
                  <Input
                    id="admin-otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 4-digit OTP"
                    maxLength={4}
                    autoFocus
                  />
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : (step === 'CREDENTIALS' ? 'Send OTP' : 'Verify OTP')}
              </Button>

              {step === 'OTP' && (
                <Button
                  type="button"
                  variant="link"
                  className="w-full"
                  onClick={() => setStep('CREDENTIALS')}
                >
                  Back to Login
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen py-8 pt-24 bg-muted/30">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">Manage products, orders, and settings</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="products" className="flex gap-2"><Package className="h-4 w-4" /> Products</TabsTrigger>
            <TabsTrigger value="users" className="flex gap-2"><Users className="h-4 w-4" /> Users</TabsTrigger>
            <TabsTrigger value="offers" className="flex gap-2"><Badge variant="outline" className="px-1 py-0">New</Badge> Offers</TabsTrigger>
          </TabsList>

          <TabsContent value="offers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Festival Offer Banner</CardTitle>
                <CardDescription>Manage the banner shown at the top of the website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Switch
                    id="offer-active"
                    checked={isOfferVisible}
                    onCheckedChange={setIsOfferVisible}
                  />
                  <Label htmlFor="offer-active">Show Offer Banner</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offer-text">Offer Text</Label>
                  <Input
                    id="offer-text"
                    value={offerText}
                    onChange={(e) => setOfferText(e.target.value)}
                    placeholder="e.g. Big Festival Sale! Flat 50% OFF"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="offer-color">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="offer-color"
                      type="color"
                      value={offerColor}
                      onChange={(e) => setOfferColor(e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={offerColor}
                      onChange={(e) => setOfferColor(e.target.value)}
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Preview</h4>
                  <div
                    className="p-3 text-center text-white rounded text-sm"
                    style={{ backgroundColor: offerColor }}
                  >
                    {offerText}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Registered Users ({users.length})
                </CardTitle>
                <CardDescription>View all registered customer details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">ID</th>
                        <th className="text-left py-3 px-4 font-medium">Name</th>
                        <th className="text-left py-3 px-4 font-medium">Phone</th>
                        <th className="text-left py-3 px-4 font-medium">Email</th>
                        <th className="text-left py-3 px-4 font-medium">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length > 0 ? (
                        users.map((user) => (
                          <tr key={user.id} className="border-b last:border-0 hover:bg-muted/50">
                            <td className="py-3 px-4 text-muted-foreground">#{user.id}</td>
                            <td className="py-3 px-4 font-medium">{user.name}</td>
                            <td className="py-3 px-4">{user.phone}</td>
                            <td className="py-3 px-4 text-muted-foreground">{user.email || '-'}</td>
                            <td className="py-3 px-4 text-muted-foreground">
                              {new Date(user.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-muted-foreground">
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openAddDialog}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    {/* ... (Keep existing form fields exactly as they are) ... */}
                    <div>
                      <Label htmlFor="name">Product Name *</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter product name" />
                    </div>
                    <div>
                      <Label htmlFor="price">Price (₹) *</Label>
                      <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Enter price" />
                    </div>
                    <div>
                      <Label>Category *</Label>
                      <Select value={formData.category} onValueChange={handleCategoryChange}>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="image">Product Image</Label>
                      <div className="space-y-2">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="cursor-pointer"
                        />
                        {formData.image && (
                          <div className="relative w-20 h-20 rounded-md overflow-hidden border">
                            <img
                              src={formData.image}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-0 right-0 h-5 w-5 bg-black/50 hover:bg-black/70 text-white rounded-full p-0.5"
                              onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Enter product description" rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label htmlFor="size">Size</Label><Input id="size" name="size" value={formData.size} onChange={handleChange} placeholder="e.g., 8x4 feet" /></div>
                      <div><Label htmlFor="thickness">Thickness</Label><Input id="thickness" name="thickness" value={formData.thickness} onChange={handleChange} placeholder="e.g., 18mm" /></div>
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch
                        id="popular"
                        checked={formData.popular || false}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, popular: checked }))}
                      />
                      <Label htmlFor="popular">Mark as Popular Product</Label>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleSave} className="flex-1"><Save className="h-4 w-4 mr-2" />{editingProduct ? 'Update' : 'Add'} Product</Button>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}><X className="h-4 w-4 mr-2" />Cancel</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Products Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Products ({products.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Product</th>
                        <th className="text-left py-3 px-4 font-medium">Category</th>
                        <th className="text-left py-3 px-4 font-medium">Price</th>
                        <th className="text-left py-3 px-4 font-medium">Size</th>
                        <th className="text-right py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b last:border-0 hover:bg-muted/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                              <span className="font-medium">{product.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">{getCategoryName(product.category)}</td>
                          <td className="py-3 px-4 font-semibold">₹{product.price.toLocaleString()}</td>
                          <td className="py-3 px-4 text-muted-foreground">{product.size || '-'}</td>
                          <td className="py-3 px-4">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="icon" onClick={() => openEditDialog(product)}><Edit2 className="h-4 w-4" /></Button>
                              <Button variant="outline" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(product.id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>


        </Tabs>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Note: Product changes are stored locally. For persistent storage, connect to Lovable Cloud.
        </p>
      </div>
    </div >
  );
};

export default Admin;
