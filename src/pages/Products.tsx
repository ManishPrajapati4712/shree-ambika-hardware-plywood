import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Grid, List } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { categories } from '@/lib/data';
import { useProducts } from '@/context/ProductContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Products = () => {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');

  const selectedCategory = searchParams.get('category') || 'all';

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };

  const currentCategory = categories.find(c => c.id === selectedCategory);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container">
        {/* Header */}
        <div className="mb-12">
          <div className="industrial-border pl-6">
            <p className="text-sm uppercase tracking-widest text-accent font-medium mb-2">
              {currentCategory ? currentCategory.name : 'All Categories'}
            </p>
            <h1 className="text-3xl md:text-4xl font-display mb-4">Our Products</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Browse our complete range of hardware and plywood products.
            Quality materials for every project, big or small.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-card border border-border rounded-2xl p-4 mb-8 shadow-card">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-10 text-base border-0 bg-muted/50"
              />
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px bg-border" />

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 flex-1">
              <Filter className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleCategoryChange('all')}
                className={selectedCategory === 'all' ? 'bg-gradient-accent text-accent-foreground font-display' : 'font-display'}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleCategoryChange(category.id)}
                  className={`whitespace-nowrap ${selectedCategory === category.id
                    ? 'bg-gradient-accent text-accent-foreground font-display'
                    : 'font-display'
                    }`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing <span className="font-display text-foreground">{filteredProducts.length}</span> products
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="opacity-0 animate-reveal"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-2xl">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="font-display text-2xl mb-2">No products found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
            <Button
              onClick={() => {
                setSearchQuery('');
                handleCategoryChange('all');
              }}
              className="font-display"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
