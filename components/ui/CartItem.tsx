// components/CartItem.tsx
"use client";

import { X, Minus, Plus } from "lucide-react";

type CartItemProps = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
};

export default function CartItem({
  id,
  name,
  price,
  quantity,
  image_url,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemProps) {
  return (
    <div className="flex items-center gap-3 border-b pb-3">
      {image_url && (
        <img
          src={image_url}
          alt={name}
          className="w-16 h-16 object-cover rounded"
        />
      )}
      <div className="flex-1">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-gray-500">
          ${price.toFixed(2)} each
        </p>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onDecrease(id)}
            className="p-1 rounded bg-gray-100 hover:bg-gray-200"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold">{quantity}</span>
          <button
            onClick={() => onIncrease(id)}
            className="p-1 rounded bg-gray-100 hover:bg-gray-200"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Line Total + Remove */}
      <div className="flex flex-col items-end">
        <span className="text-sm font-semibold">
          ${(price * quantity).toFixed(2)}
        </span>
        <button
          onClick={() => onRemove(id)}
          className="text-xs text-red-500 hover:underline mt-1 flex items-center"
        >
          <X className="w-3 h-3 mr-1" /> Remove
        </button>
      </div>
    </div>
  );
}
