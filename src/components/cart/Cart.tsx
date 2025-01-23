"use client";

import { formatPrice } from "@/lib/utils";
import { useCartStore, type CartItem as CartItemType } from "@/stores/cart-store";
import { ShoppingCart, X, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/shallow";
import { useRouter } from "next/navigation";

const freeShippingAmount = 15; // $15 for free shipping

const CartItem = ({ item }: { item: CartItemType }) => {
  const { removeItem, updateQuantity } = useCartStore(
    useShallow((state) => ({
      removeItem: state.removeItem,
      updateQuantity: state.updateQuantity,
    }))
  );

  const isFreeItem = item.price === 0;

  return (
    <div key={`cart-item-${item.id}`} className="flex gap-4 p-4 hover:bg-gray-50">
      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900 truncate">{item.title}</h3>
        <div className="text-sm text-gray-500 mt-1">
          {isFreeItem ? (
            <span className="text-emerald-600 font-medium">FREE</span>
          ) : (
            formatPrice(item.price)
          )}
        </div>
        <div className="flex items-center gap-3 mt-2">
          {isFreeItem ? (
            <div className="text-sm text-emerald-600 font-medium">
              Prize Item
            </div>
          ) : (
            <>
              <select
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.id, Number(e.target.value))
                }
                className="border rounded-md px-2 py-1 text-sm bg-white"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option
                    key={`cart-qty-slct-${item.id}-${num}`}
                    value={num}
                  >
                    {num}
                  </option>
                ))}
              </select>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 text-sm hover:text-red-600"
              >
                Remove
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Cart = () => {
  const {
    items,
    close,
    isOpen,
    syncWithUser,
    setLoaded,
    getTotalPrice,
    getTotalItems,
    clearCart,
  } = useCartStore(
    useShallow((state) => ({
      items: state.items,
      close: state.close,
      isOpen: state.isOpen,
      syncWithUser: state.syncWithUser,
      setLoaded: state.setLoaded,
      getTotalPrice: state.getTotalPrice,
      getTotalItems: state.getTotalItems,
      clearCart: state.clearCart,
    }))
  );

  const router = useRouter();
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  useEffect(() => {
    const initCart = async () => {
      await useCartStore.persist.rehydrate();
      await syncWithUser();
      setLoaded(true);
    };

    initCart();
  }, [setLoaded, syncWithUser]);

  const handleConfirmOrder = () => {
    setOrderConfirmed(true);
    clearCart(); // Clear the cart after confirmation

    setTimeout(() => {
      setOrderConfirmed(false);
      close();
      router.push("/"); // Redirect to home page
    }, 3000); // 3-second delay before redirect
  };

  const totalPrice = getTotalPrice();

  const remainingForFreeShipping = useMemo(() => {
    return Math.max(0, freeShippingAmount - totalPrice);
  }, [totalPrice]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity backdrop-blur-sm"
          onClick={close}
        />
      )}

      {/* Cart Drawer */}
      <div
        className={`
          fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-2xl
          transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          {orderConfirmed ? (
            // Confirmation message
            <div className="flex flex-col items-center justify-center h-full p-8 bg-green-50">
              <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-green-800">
                Order Confirmed!
              </h3>
              <p className="text-gray-700 mt-2">
                Thank you for shopping with us. You will be redirected to the
                home page shortly.
              </p>
            </div>
          ) : (
            <>
              {/* Cart Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  <h2 className="text-lg font-semibold">Shopping Cart</h2>
                  <span className="bg-gray-200 px-2 py-1 rounded-full text-sm font-medium">
                    {getTotalItems()}
                  </span>
                </div>
                <button
                  onClick={close}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <ShoppingCart className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Looks like you have not added any items to your cart yet!
                    </p>
                    <Link
                      href="/"
                      onClick={close}
                      className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-900 transition-colors"
                    >
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y">
                    {items.map((item) => (
                      <CartItem key={`cart-item-${item.id}`} item={item} />
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {items.length > 0 && (
                <div className="border-t">
                  <div className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="font-medium">{formatPrice(totalPrice)}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Shipping</span>
                        <span className="font-medium">
                          {remainingForFreeShipping > 0
                            ? "Calculated at checkout"
                            : "FREE"}
                        </span>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-lg">Total</span>
                        <span className="font-bold text-lg">{formatPrice(totalPrice)}</span>
                      </div>
                      <button
                        onClick={handleConfirmOrder}
                        className="w-full bg-black text-white py-3 rounded-full font-bold hover:bg-gray-900 transition-colors"
                      >
                        Confirm Order
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
