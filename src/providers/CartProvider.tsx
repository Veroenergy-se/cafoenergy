import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import { products, getSubscriptionPrice, type Product } from '@/lib/products'

export interface CartItem {
  productId: string
  quantity: number
  subscription: boolean
  monthlyPlan?: number[] // [month1_boxes, month2_boxes, month3_boxes]
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; productId: string; subscription: boolean; monthlyPlan?: number[] }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'TOGGLE_CART' }
  | { type: 'SET_OPEN'; isOpen: boolean }
  | { type: 'HYDRATE'; items: CartItem[] }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.productId === action.productId)
      if (existing) {
        return {
          ...state,
          isOpen: true,
          items: state.items.map(i =>
            i.productId === action.productId
              ? { ...i, quantity: i.quantity + 1, subscription: action.subscription, monthlyPlan: action.monthlyPlan }
              : i
          ),
        }
      }
      return {
        ...state,
        isOpen: true,
        items: [...state.items, { productId: action.productId, quantity: 1, subscription: action.subscription, monthlyPlan: action.monthlyPlan }],
      }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.productId !== action.productId) }
    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter(i => i.productId !== action.productId) }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.productId === action.productId ? { ...i, quantity: action.quantity } : i
        ),
      }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    case 'SET_OPEN':
      return { ...state, isOpen: action.isOpen }
    case 'HYDRATE':
      return { ...state, items: action.items.map(i => ({ subscription: false, ...i })) }
    default:
      return state
  }
}

interface CartContextValue {
  items: CartItem[]
  isOpen: boolean
  addItem: (productId: string, subscription?: boolean, monthlyPlan?: number[]) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  setOpen: (open: boolean) => void
  cartCount: number
  cartTotal: (currency: 'usd' | 'sek') => number
  getProduct: (id: string) => Product | undefined
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false })

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cafo-cart')
      if (saved) dispatch({ type: 'HYDRATE', items: JSON.parse(saved) })
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('cafo-cart', JSON.stringify(state.items))
  }, [state.items])

  const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

  const cartTotal = (currency: 'usd' | 'sek') =>
    state.items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId)
      if (!product) return sum
      const unitPrice = item.subscription
        ? getSubscriptionPrice(product.price[currency])
        : product.price[currency]
      return sum + unitPrice * item.quantity
    }, 0)

  const getProduct = (id: string) => products.find(p => p.id === id)

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        addItem: (productId, subscription = false, monthlyPlan) =>
          dispatch({ type: 'ADD_ITEM', productId, subscription, monthlyPlan }),
        removeItem: (productId) => dispatch({ type: 'REMOVE_ITEM', productId }),
        updateQuantity: (productId, quantity) =>
          dispatch({ type: 'UPDATE_QUANTITY', productId, quantity }),
        clearCart: () => dispatch({ type: 'CLEAR' }),
        toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
        setOpen: (isOpen) => dispatch({ type: 'SET_OPEN', isOpen }),
        cartCount,
        cartTotal,
        getProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
