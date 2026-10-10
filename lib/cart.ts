export interface CartItem {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: number; // major currency units
  symbol: string;
  minorUnit: number;
  quantity: number;
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
