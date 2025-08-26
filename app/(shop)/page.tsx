'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, ShoppingCart, Star, Heart } from 'lucide-react'
import ProductList from '@/components/ui/productList'
import CartDrawer from '@/components/ui/CardDrawer'
import { useCartStore } from '@/lib/stores/cartStore'
import Link from 'next/link'
import Image from 'next/image'

// Mock data for demo - replace with actual data fetching
const mockProducts = [
  {
    id: '1',
    name: 'Premium Wireless Headphones',
    slug: 'premium-wireless-headphones',
    price: 199.99,
    compare_price: 249.99,
    images: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', alt: 'Headphones' }],
    featured: true,
    quantity: 50,
    track_quantity: true,
    short_description: 'Crystal clear sound with noise cancellation'
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    slug: 'smart-fitness-watch',
    price: 299.99,
    compare_price: null,
    images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', alt: 'Smart Watch' }],
    featured: false,
    quantity: 25,
    track_quantity: true,
    short_description: 'Track your fitness goals with precision'
  },
  {
    id: '3',
    name: 'Minimalist Desk Lamp',
    slug: 'minimalist-desk-lamp',
    price: 89.99,
    compare_price: 120.00,
    images: [{ url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500', alt: 'Desk Lamp' }],
    featured: true,
    quantity: 0,
    track_quantity: true,
    short_description: 'Perfect lighting for your workspace'
  },
  {
    id: '4',
    name: 'Ergonomic Office Chair',
    slug: 'ergonomic-office-chair',
    price: 449.99,
    compare_price: null,
    images: [{ url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500', alt: 'Office Chair' }],
    featured: false,
    quantity: 15,
    track_quantity: true,
    short_description: 'Comfort meets productivity'
  }
]

const categories = [
  { id: '1', name: 'Electronics', slug: 'electronics', count: 120 },
  { id: '2', name: 'Home & Living', slug: 'home-living', count: 85 },
  { id: '3', name: 'Fashion', slug: 'fashion', count: 200 },
  { id: '4', name: 'Sports', slug: 'sports', count: 65 },
]

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('featured')
  const [filteredProducts, setFilteredProducts] = useState(mockProducts)
  
  const { items, isOpen, toggleCart, getTotalItems } = useCartStore()

  // Filter products based on search and category
  useEffect(() => {
    let filtered = mockProducts

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.short_description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory) {
      // In real app, filter by category_id
      filtered = filtered.filter(product => product.featured) // Mock filter
    }

    // Sort products
    if (sortBy === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'featured') {
      filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }

    setFilteredProducts(filtered)
  }, [searchTerm, selectedCategory, sortBy])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DS</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                DropShop
              </span>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing Products
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Quality products from trusted vendors, delivered to your door
            </p>
            <Link
              href="#products"
              className="inline-flex items-center px-8 py-3 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )}
                className={`p-6 rounded-xl text-center transition-all ${
                  selectedCategory === category.id
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500'
                    : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                } shadow-sm hover:shadow-md`}
              >
                <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {category.count} products
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filters and Products */}
      <section id="products" className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 space-y-4 sm:space-y-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Products ({filteredProducts.length})
            </h2>
            
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="featured">Featured</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <ProductList products={filteredProducts} />
        </div>
      </section>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isOpen}
        onClose={toggleCart}
        items={items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image_url: item.image
        }))}
      />
    </div>
  )
}