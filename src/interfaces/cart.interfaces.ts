
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
  image: string;
}

export interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
}