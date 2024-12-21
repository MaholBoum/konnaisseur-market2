export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  is_new?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}