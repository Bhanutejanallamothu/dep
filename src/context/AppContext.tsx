
"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { Product, User, CartItem, Purchase } from "@/lib/types";
import { initialProducts, initialUsers } from "@/lib/data";

type AppContextType = {
  user: User | null;
  login: (email: string, password_hash: string) => boolean;
  logout: () => void;
  signup: (username: string, email: string, password_hash: string) => boolean;
  updateUser: (updatedUser: Partial<User>) => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'userId'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  cart: CartItem[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  purchases: Purchase[];
  checkout: () => void;
  getProductById: (productId: string) => Product | undefined;
  getUserById: (userId: string) => User | undefined;
  getProductCategories: () => string[];
};

const AppContext = createContext<AppContextType | null>(null);

const getInitialState = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") {
    return fallback;
  }
  const storedValue = localStorage.getItem(key);
  try {
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch (error) {
    console.error(`Error parsing JSON from localStorage key "${key}":`, error);
    return fallback;
  }
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const [users, setUsers] = useState(() => getInitialState<(User & { passwordHash: string })[]>('users', initialUsers));
  const [products, setProducts] = useState(() => getInitialState<Product[]>('products', initialProducts));
  const [user, setUser] = useState<User | null>(() => getInitialState<User | null>('user', null));
  const [cart, setCart] = useState<CartItem[]>(() => getInitialState<CartItem[]>('cart', []));
  const [purchases, setPurchases] = useState<Purchase[]>(() => getInitialState<Purchase[]>('purchases', []));

  useEffect(() => { try { localStorage.setItem('users', JSON.stringify(users)) } catch(e) { console.error(e)} }, [users]);
  useEffect(() => { try { localStorage.setItem('products', JSON.stringify(products)) } catch(e) { console.error(e)} }, [products]);
  useEffect(() => { try { localStorage.setItem('user', JSON.stringify(user)) } catch(e) { console.error(e)} }, [user]);
  useEffect(() => { try { localStorage.setItem('cart', JSON.stringify(cart)) } catch(e) { console.error(e)} }, [cart]);
  useEffect(() => { try { localStorage.setItem('purchases', JSON.stringify(purchases)) } catch(e) { console.error(e)} }, [purchases]);
  
  // Protect routes
  useEffect(() => {
    const protectedRoutes = ['/my-listings', '/products/new', '/dashboard', '/cart', '/purchases', '/account'];
    const authRoutes = ['/login', '/signup'];

    if (!user && protectedRoutes.some(route => pathname.startsWith(route))) {
      router.push('/login');
      toast({ title: "Please log in", description: "You need to be logged in to access this page.", variant: "destructive" });
    }
    if (user && authRoutes.includes(pathname)) {
        router.push('/');
    }
  }, [user, pathname, router, toast]);

  const login = (email: string, password_hash: string): boolean => {
    // Fake admin login for testing
    if (email === 'admin@example.com' && password_hash === 'Adminlogin@123') {
      const adminUser = {
        id: 'admin-user',
        username: 'Admin',
        email: 'admin@example.com',
      };
      setUser(adminUser);
      toast({ title: "Admin Login Successful", description: `Welcome, Admin!` });
      return true;
    }
    
    const foundUser = users.find(u => u.email === email && u.passwordHash === password_hash);
    if (foundUser) {
      const { passwordHash, ...userToSet } = foundUser;
      setUser(userToSet);
      toast({ title: "Login Successful", description: `Welcome back, ${userToSet.username}!` });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    router.push('/login');
  };

  const signup = (username: string, email: string, password_hash: string): boolean => {
    if (users.some(u => u.email === email)) {
      return false;
    }
    const newUser = { id: `user-${Date.now()}`, username, email, passwordHash: password_hash };
    setUsers(prev => [...prev, newUser]);
    const { passwordHash, ...userToSet } = newUser;
    setUser(userToSet);
    toast({ title: "Signup Successful", description: `Welcome to EcoFinds, ${username}!` });
    return true;
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (!user) return;
    const newUser = { ...user, ...updatedUser };
    setUser(newUser);
    setUsers(prev => prev.map(u => u.id === newUser.id ? { ...u, ...newUser } : u));
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
  };
  
  const addProduct = (product: Omit<Product, 'id' | 'userId'>) => {
    if (!user) return;
    const newProduct: Product = { ...product, id: `prod-${Date.now()}`, userId: user.id };
    setProducts(prev => [newProduct, ...prev]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };
  
  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };
  
  const getProductById = (productId: string) => products.find(p => p.id === productId);

  const getUserById = (userId: string) => {
    if (userId === 'admin-user') {
        return { id: 'admin-user', username: 'Admin', email: 'admin@example.com' };
    }
    return users.find(u => u.id === userId);
  }

  const getProductCategories = () => {
    const categories = Array.from(new Set(products.map(p => p.category)));
    return categories.sort();
  };

  const addToCart = (productId: string) => {
    const product = getProductById(productId);
    if (!product) return;

    if (product.quantity === 0) {
      toast({ title: "Out of Stock", description: "This item is currently unavailable.", variant: "destructive" });
      return;
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === productId);
      if (existingItem) {
        toast({ title: "Already in cart", description: `You can only have one of each item.` });
        return prevCart;
      }
      toast({ title: "Added to cart", description: `"${product.title}" has been added to your cart.` });
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const checkout = () => {
    if (!user || cart.length === 0) return;

    const newProducts = [...products];
    for (const item of cart) {
      const productIndex = newProducts.findIndex(p => p.id === item.product.id);
      if (productIndex !== -1) {
        newProducts[productIndex].quantity -= item.quantity;
      }
    }
    setProducts(newProducts);

    const newPurchase: Purchase = {
      id: `purchase-${Date.now()}`,
      userId: user.id,
      items: cart.map(item => ({...item, product: {...item.product}})), // Deep copy product
      date: new Date(),
      total: cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    };

    setPurchases(prev => [newPurchase, ...prev]);
    setCart([]);
    toast({ title: "Purchase Complete!", description: "Thank you for your order." });
    router.push('/purchases');
  };

  return (
    <AppContext.Provider value={{ 
      user, login, logout, signup, updateUser,
      products, addProduct, updateProduct, deleteProduct,
      cart, addToCart, removeFromCart, clearCart,
      purchases, checkout,
      getProductById, getUserById, getProductCategories
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
