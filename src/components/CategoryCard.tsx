import { Link } from 'react-router-dom';
import { ArrowRight, Layers, Palette, Wrench, DoorOpen, Cog } from 'lucide-react';
import { Category } from '@/lib/data';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Layers,
  Palette,
  Wrench,
  DoorOpen,
  Cog,
};

interface CategoryCardProps {
  category: Category;
  delay?: number;
}

export function CategoryCard({ category, delay = 0 }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Layers;

  return (
    <Link
      to={`/products?category=${category.id}`}
      className="block group opacity-0 animate-reveal"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative h-72 rounded-2xl overflow-hidden bg-charcoal">
        {/* Background image */}
        <img
          src={category.image}
          alt={category.name}
          className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          {/* Icon badge */}
          <div className="absolute top-6 left-6">
            <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center shadow-accent group-hover:scale-110 transition-transform duration-300">
              <Icon className="h-6 w-6 text-accent-foreground" />
            </div>
          </div>

          {/* Text content */}
          <div className="text-primary-foreground">
            <h3 className="font-display text-2xl md:text-3xl mb-2 group-hover:text-accent transition-colors">
              {category.name}
            </h3>
            <p className="text-sm opacity-70 mb-4 line-clamp-2">
              {category.description}
            </p>
            
            {/* CTA */}
            <div className="flex items-center gap-2 text-accent font-medium">
              <span>Explore</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </div>
        </div>

        {/* Hover border accent */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-accent/30 rounded-2xl transition-colors duration-300" />
      </div>
    </Link>
  );
}
