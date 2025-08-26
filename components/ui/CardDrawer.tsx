"use client";

import React from "react";
import { X } from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
};

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
};

export default function CartDrawer({ isOpen, onClose, items }: CartDrawerProps) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div
      className={`fixed inset-0 z-50 transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 && (
            <p className="text-gray-500 text-sm">Your cart is empty.</p>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 border-b pb-2"
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-gray-500">
                  ${item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          <div className="flex justify-between mb-3">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <button className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
