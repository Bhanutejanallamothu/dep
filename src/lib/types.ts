export type User = {
  id: string;
  username: string;
  email: string;
};

export type Product = {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'Electronics' | 'Fashion' | 'Home Goods' | 'Books' | 'Other';
  price: number;
  imageUrl: string;
  quantity: number;
  condition: 'New' | 'Used - Like New' | 'Used - Good' | 'Used - Fair';
  yearOfManufacture?: number;
  brand?: string;
  model?: string;
  dimensions?: string;
  weight?: string;
  material?: string;
  color?: string;
  originalPackaging: boolean;
  manualIncluded: boolean;
  workingCondition: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Purchase = {
  id: string;
  userId: string;
  items: CartItem[];
  date: Date;
  total: number;
};
