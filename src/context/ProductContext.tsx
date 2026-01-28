import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts, Product } from '@/lib/data';
import { toast } from 'sonner';

interface ProductContextType {
    products: Product[];
    addProduct: (product: Product) => void;
    updateProduct: (updatedProduct: Product) => void;
    deleteProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
    const [products, setProducts] = useState<Product[]>(() => {
        const savedProductsJson = localStorage.getItem('products');
        if (savedProductsJson) {
            try {
                const savedProducts = JSON.parse(savedProductsJson) as Product[];
                // Check if there are any new products in code (initialProducts) that aren't in storage
                const savedIds = new Set(savedProducts.map(p => p.id));
                const newProductsInCode = initialProducts.filter(p => !savedIds.has(p.id));

                if (newProductsInCode.length > 0) {
                    // Merge them
                    return [...savedProducts, ...newProductsInCode];
                }
                return savedProducts;
            } catch (error) {
                console.error("Error parsing saved products:", error);
                return initialProducts;
            }
        }
        return initialProducts;
    });

    useEffect(() => {
        localStorage.setItem('products', JSON.stringify(products));
    }, [products]);

    const addProduct = (product: Product) => {
        setProducts((prev) => [...prev, product]);
        toast.success('Product added successfully');
    };

    const updateProduct = (updatedProduct: Product) => {
        setProducts((prev) =>
            prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
        );
        toast.success('Product updated successfully');
    };

    const deleteProduct = (id: string) => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success('Product deleted successfully');
    };

    return (
        <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};
