"use client"

import ProductCard from "@/components/ui/productCard"


interface ProductListProps {
  products: any[]
}

export default function ProductList({ products }: ProductListProps) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm">Try adjusting your filters or check back later.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}