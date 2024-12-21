import { create } from 'zustand';
import { CartItem, Product } from '@/types/product';
import { supabase } from "@/integrations/supabase/client";

interface CartStore {
  items: CartItem[];
  couponCode: string | null;
  discount: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  clearCart: () => void;
  total: number;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  couponCode: null,
  discount: 0,
  total: 0,

  addItem: (product: Product) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.id === product.id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return { items: [...state.items, { ...product, quantity: 1 }] };
    });
  },

  removeItem: (productId: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== productId),
    }));
  },

  updateQuantity: (productId: string, quantity: number) => {
    set((state) => {
      if (quantity === 0) {
        return {
          items: state.items.filter((item) => item.id !== productId),
        };
      }
      return {
        items: state.items.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        ),
      };
    });
  },

  applyCoupon: async (code: string) => {
    try {
      console.log('Validating coupon:', code);
      
      const { data: coupon, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching coupon:', error);
        return { success: false, message: 'Invalid coupon code' };
      }

      if (!coupon) {
        return { success: false, message: 'Coupon not found' };
      }

      const now = new Date();
      if (coupon.expires_at && new Date(coupon.expires_at) < now) {
        return { success: false, message: 'Coupon has expired' };
      }

      set({ 
        couponCode: code, 
        discount: coupon.discount_percentage / 100 
      });
      
      return { 
        success: true, 
        message: `Coupon applied! ${coupon.discount_percentage}% discount` 
      };
    } catch (error) {
      console.error('Error applying coupon:', error);
      return { success: false, message: 'Error applying coupon' };
    }
  },

  clearCart: () => {
    set({ items: [], couponCode: null, discount: 0 });
  },
}));