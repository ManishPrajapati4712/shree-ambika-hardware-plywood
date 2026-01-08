import { ShoppingCart, MessageCircle, Phone } from 'lucide-react';
import { Product } from '@/lib/data';
import { storeInfo } from '@/lib/data';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWhatsAppOrder = () => {
    const message = encodeURIComponent(
      `Hi! I'm interested in ordering:\n\n*${product.name}*\nPrice: ₹${product.price.toLocaleString()}\n${product.size ? `Size: ${product.size}` : ''}\n\nPlease share more details.`
    );
    window.open(`https://wa.me/${storeInfo.whatsapp}?text=${message}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${storeInfo.phone}`, '_self');
  };

  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-500 border border-border hover:border-accent/30">
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full ${product.imageFit === 'contain' ? 'object-contain p-4' : 'object-cover'} group-hover:scale-110 transition-transform duration-700`}
        />

        {/* Thickness badge */}
        {product.thickness && (
          <span className="absolute top-4 right-4 bg-charcoal text-primary-foreground text-xs font-display tracking-wider px-3 py-1.5 rounded-lg">
            {product.thickness}
          </span>
        )}

        {/* Quick action overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
          <div className="flex gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <Button
              size="sm"
              onClick={handleWhatsAppOrder}
              className="bg-whatsapp hover:bg-whatsapp/90 text-white"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              WhatsApp
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCall}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <Phone className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-display text-xl text-foreground line-clamp-2 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          {product.size && (
            <p className="text-xs text-muted-foreground mt-1">{product.size}</p>
          )}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>

        {/* Price and CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div>
            <span className="text-xs text-muted-foreground">Price</span>
            <div className="text-2xl font-display text-accent">
              ₹{product.price.toLocaleString()}
            </div>
          </div>
          <Button
            onClick={handleAddToCart}
            className="bg-gradient-accent text-accent-foreground font-display shadow-accent hover:scale-105 transition-transform"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
