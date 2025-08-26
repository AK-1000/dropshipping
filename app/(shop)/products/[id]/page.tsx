'use client'

import { useState } from 'react'
import { Heart, Share2, Star, Minus, Plus, ShoppingCart, ArrowLeft, Truck, Shield, RotateCcw } from 'lucide-react'
import { useCartStore } from '@/lib/stores/cartStore'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'

// Mock product data - replace with actual data fetching
const mockProduct = {
  id: '1',
  name: 'Premium Wireless Headphones',
  slug: 'premium-wireless-headphones',
  description: 'Experience superior sound quality with our premium wireless headphones. Featuring advanced noise cancellation technology, these headphones deliver crystal-clear audio whether you\'re listening to music, taking calls, or enjoying your favorite podcasts. With up to 30 hours of battery life and quick charge capability, these headphones are perfect for all-day use.',
  short_description: 'Crystal clear sound with noise cancellation',
  price: 199.99,
  compare_price: 249.99,
  images: [
    { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', alt: 'Headphones Front' },
    { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800', alt: 'Headphones Side' },
    { url: 'https://images.unsplash.com/photo-1524678714210-9917a6c619c2?w=800', alt: 'Headphones Detail' },
  ],
  quantity: 50,
  track_quantity: true,
  featured: true,
  sku: 'PWH-001',
  weight: 0.8,
  variants: [
    { id: 1, name: 'Color', options: ['Black', 'White', 'Silver'] },
    { id: 2, name: 'Size', options: ['Standard', 'Large'] }
  ],
  specifications: [
    { name: 'Driver Size', value: '40mm' },
    { name: 'Frequency Response', value: '20Hz - 20kHz' },
    { name: 'Battery Life', value: '30 hours' },
    { name: 'Charging Time', value: '2 hours' },
    { name: 'Weight', value: '280g' },
    { name: 'Connectivity', value: 'Bluetooth 5.0, 3.5mm' }
  ],
  reviews: [
    {
      id: 1,
      rating: 5,
      comment: 'Amazing sound quality and comfort!',
      user: { full_name: 'John Doe' },
      created_at: '2024-01-15'
    },
    {
      id: 2,
      rating: 4,
      comment: 'Great headphones, worth the price.',
      user: { full_name: 'Jane Smith' },
      created_at: '2024-01-10'
    }
  ]
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  const { addItem } = useCartStore()

  const product = mockProduct // In real app, fetch based on params.id

  const handleAddToCart = () => {
    const cartItem = {
      id: `${product.id}-${JSON.stringify(selectedVariants)}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0]?.url,
      variant: selectedVariants
    }

    addItem(cartItem)
    toast.success(`Added ${quantity} ${product.name} to cart!`)
  }

  const handleVariantChange = (variantName: string, option: string) => {
    setSelectedVariants(prev => ({
      ...prev,
      [variantName]: option
    }))
  }

  const discountPercent = product.compare_price 
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0

  const averageRating = product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            <Link href="/shop" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">DS</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                DropShop
              </span>
            </Link>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-2 rounded-lg transition-colors ${
                  isWishlisted 
                    ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-red-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
              <Image
                src={product.images[selectedImage]?.url || '/vercel.svg'}
                alt={product.images[selectedImage]?.alt || product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index 
                      ? 'border-indigo-500' 
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(averageRating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    ({product.reviews.length} reviews)
                  </span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  SKU: {product.sku}
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.compare_price && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ${product.compare_price.toFixed(2)}
                  </span>
                  <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-full text-sm font-semibold">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="text-gray-600 dark:text-gray-400">
              {product.short_description}
            </p>

            {/* Variants */}
            {product.variants.map((variant) => (
              <div key={variant.id} className="space-y-3">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {variant.name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {variant.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleVariantChange(variant.name, option)}
                      className={`px-4 py-2 border rounded-lg transition-colors ${
                        selectedVariants[variant.name] === option
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                          : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900 dark:text-white">Quantity</h3>
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {product.quantity} in stock
                </span>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center">
                <Truck className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-gray-500">On orders over $50</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-sm font-medium">2 Year Warranty</p>
                <p className="text-xs text-gray-500">Full protection</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-sm font-medium">30 Day Returns</p>
                <p className="text-xs text-gray-500">Easy returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {spec.name}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {review.user.full_name}
                      </h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {review.comment}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}