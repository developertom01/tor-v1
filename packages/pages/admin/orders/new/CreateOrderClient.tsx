'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Search, Plus, Trash2, User, UserPlus, Loader2, ChevronRight, ChevronLeft, Package, AlertTriangle } from 'lucide-react'
import { searchCustomersForOrder, createAdminOrder } from '@tor/lib/actions/orders'
import { saveFormDraft, closeFormDraft } from '@tor/lib/actions/drafts'
import { formatPrice } from '@tor/lib/utils'
import Image from 'next/image'
import ProductPicker from './ProductPicker'
import type { CustomerSummary } from '@tor/lib/types'

interface Product {
  id: string
  name: string
  price: number
  product_variants: Array<{ id: string; name: string; price: number; stock_quantity: number }>
  product_media: Array<{ url: string; is_primary: boolean }>
}

interface CreateOrderClientProps {
  products: Product[]
  sessionId: string
  initialData: Record<string, unknown>
}

type SearchResult = {
  userId: string
  fullName: string
  email: string
  phone: string | null
  shippingAddress: string | null
  city: string | null
  region: string | null
}

type OrderItem = {
  productId: string
  productName: string
  productDescription: string | null
  productImage: string | null
  variantId: string | null
  variantName: string | null
  quantity: number
  unitPrice: number
}

// All form fields in one flat shape
interface OrderFormFields {
  // Step 1 — new customer
  customerName: string
  customerEmail: string
  // Step 3 — shipping
  customerPhone: string
  shippingAddress: string
  city: string
  region: string
}

// Fields to validate per step
const STEP_FIELDS: Record<number, (keyof OrderFormFields)[]> = {
  1: ['customerName', 'customerEmail'],
  3: ['customerPhone', 'shippingAddress', 'city', 'region'],
}

const STEPS = ['Customer', 'Products', 'Shipping', 'Review'] as const

const inputClass =
  'w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-sm'

const errorClass = 'text-xs text-red-500 mt-1'

export default function CreateOrderClient({ products, sessionId }: CreateOrderClientProps) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormFields>({ mode: 'onTouched' })

  // Step
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)

  // Customer mode
  const [isNewCustomer, setIsNewCustomer] = useState(true)

  // Customer search
  const [customerSearchQuery, setCustomerSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<SearchResult | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Products
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [selectedProductId, setSelectedProductId] = useState('')
  const [selectedVariantId, setSelectedVariantId] = useState('')
  const [selectedQty, setSelectedQty] = useState(1)
  const [itemsError, setItemsError] = useState('')

  // Submission error
  const [submitError, setSubmitError] = useState('')

  // Existing customer conflict — set when server finds a match on "new customer" email
  const [foundCustomer, setFoundCustomer] = useState<CustomerSummary | null>(null)

  const totalAmount = orderItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
  const selectedProduct = products.find((p) => p.id === selectedProductId)

  // Watched for review display
  const watchedName = watch('customerName')
  const watchedEmail = watch('customerEmail')

  async function handleCustomerSearch(value: string) {
    setCustomerSearchQuery(value)
    if (value.length < 2) { setSearchResults([]); setShowDropdown(false); return }
    if (isNewCustomer || selectedCustomer) return

    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current)
    searchDebounceRef.current = setTimeout(async () => {
      setSearchLoading(true)
      try {
        const results = await searchCustomersForOrder(value)
        setSearchResults(results)
        setShowDropdown(true)
      } catch {
        setSearchResults([])
      }
      setSearchLoading(false)
    }, 300)
  }

  function selectCustomer(result: SearchResult) {
    setSelectedCustomer(result)
    setShowDropdown(false)
    setIsNewCustomer(false)
    // Pre-fill shipping fields from customer's last known address
    setValue('customerPhone', result.phone ?? '', { shouldValidate: false })
    setValue('shippingAddress', result.shippingAddress ?? '', { shouldValidate: false })
    setValue('city', result.city ?? '', { shouldValidate: false })
    setValue('region', result.region ?? '', { shouldValidate: false })
  }

  function clearSelectedCustomer() {
    setSelectedCustomer(null)
    setCustomerSearchQuery('')
    setSearchResults([])
    reset()
  }

  function addItem() {
    const product = products.find((p) => p.id === selectedProductId)
    if (!product) return

    const variant = product.product_variants?.find((v) => v.id === selectedVariantId)
    const unitPrice = variant?.price ?? product.price ?? 0
    const primaryMedia =
      product.product_media?.find((m) => m.is_primary) ?? product.product_media?.[0]

    const newItem: OrderItem = {
      productId: product.id,
      productName: product.name,
      productDescription: null,
      productImage: primaryMedia?.url ?? null,
      variantId: variant?.id ?? null,
      variantName: variant?.name ?? null,
      quantity: selectedQty,
      unitPrice,
    }

    const existingIndex = orderItems.findIndex(
      (i) => i.productId === newItem.productId && i.variantId === newItem.variantId
    )
    if (existingIndex >= 0) {
      setOrderItems((prev) =>
        prev.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + selectedQty } : item
        )
      )
    } else {
      setOrderItems((prev) => [...prev, newItem])
    }

    setItemsError('')
    setSelectedProductId('')
    setSelectedVariantId('')
    setSelectedQty(1)
  }

  function removeItem(index: number) {
    setOrderItems((prev) => prev.filter((_, i) => i !== index))
  }

  async function goNext() {
    const formValues = watch()
    if (step === 1) {
      if (isNewCustomer) {
        const valid = await trigger(STEP_FIELDS[1])
        if (!valid) return
      } else if (!selectedCustomer) {
        return
      }
    } else if (step === 2) {
      if (orderItems.length === 0) {
        setItemsError('Add at least one product.')
        return
      }
    } else if (step === 3) {
      const valid = await trigger(STEP_FIELDS[3])
      if (!valid) return
    }
    const nextStep = (step + 1) as 1 | 2 | 3 | 4
    setStep(nextStep)
    saveFormDraft(sessionId, {
      step: nextStep,
      isNewCustomer,
      selectedCustomer,
      orderItems,
      formValues,
    }).catch(() => {})
  }

  function goBack() {
    setStep((s) => (s - 1) as 1 | 2 | 3 | 4)
  }

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError('')
    setFoundCustomer(null)
    try {
      const result = await createAdminOrder({
        customerEmail: isNewCustomer ? data.customerEmail : selectedCustomer!.email,
        customerName: isNewCustomer ? data.customerName : selectedCustomer!.fullName,
        customerPhone: data.customerPhone,
        shippingAddress: data.shippingAddress,
        city: data.city,
        region: data.region,
        items: orderItems,
        totalAmount,
        isNewCustomer,
      })
      if ('existingCustomer' in result) {
        setFoundCustomer(result.existingCustomer)
        return
      }
      await closeFormDraft(sessionId)
      router.push(`/admin/orders/${result.orderId}`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create order')
    }
  })

  async function proceedWithFoundCustomer() {
    if (!foundCustomer) return
    setSubmitError('')
    try {
      const data = { customerPhone: watch('customerPhone'), shippingAddress: watch('shippingAddress'), city: watch('city'), region: watch('region') }
      const result = await createAdminOrder({
        customerEmail: foundCustomer.email,
        customerName: foundCustomer.fullName,
        customerPhone: data.customerPhone,
        shippingAddress: data.shippingAddress,
        city: data.city,
        region: data.region,
        items: orderItems,
        totalAmount,
        isNewCustomer: false,
      })
      if ('orderId' in result) {
        await closeFormDraft(sessionId)
        router.push(`/admin/orders/${result.orderId}`)
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to create order')
    }
  }

  const reviewName = isNewCustomer ? watchedName : selectedCustomer?.fullName ?? ''
  const reviewEmail = isNewCustomer ? watchedEmail : selectedCustomer?.email ?? ''

  return (
    <form onSubmit={onSubmit} noValidate>
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8 max-w-2xl">
        {STEPS.map((label, i) => {
          const stepNum = (i + 1) as 1 | 2 | 3 | 4
          const isCurrent = step === stepNum
          const isCompleted = step > stepNum
          return (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    isCurrent
                      ? 'bg-brand-600 text-white'
                      : isCompleted
                      ? 'bg-brand-100 text-brand-700'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {stepNum}
                </div>
                <span
                  className={`text-sm font-medium truncate ${
                    isCurrent ? 'text-brand-700' : isCompleted ? 'text-brand-600' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-px flex-1 ml-2 ${isCompleted ? 'bg-brand-300' : 'bg-gray-200'}`} />
              )}
            </div>
          )
        })}
      </div>

      <div className="max-w-2xl">
        {/* Step 1 — Customer */}
        {step === 1 && (
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Customer Details</h2>

            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
              <button
                type="button"
                onClick={() => { setIsNewCustomer(false); clearSelectedCustomer() }}
                className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-lg transition-colors ${
                  !isNewCustomer ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <User className="w-4 h-4" />
                Existing Customer
              </button>
              <button
                type="button"
                onClick={() => { setIsNewCustomer(true); clearSelectedCustomer() }}
                className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium py-2 rounded-lg transition-colors ${
                  isNewCustomer ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                New Customer
              </button>
            </div>

            {/* Existing customer search */}
            {!isNewCustomer && (
              selectedCustomer ? (
                <div className="border border-brand-200 bg-brand-50 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{selectedCustomer.fullName}</p>
                      <p className="text-sm text-gray-500">{selectedCustomer.email}</p>
                      {selectedCustomer.phone && (
                        <p className="text-sm text-gray-500">{selectedCustomer.phone}</p>
                      )}
                      {selectedCustomer.city && (
                        <p className="text-sm text-gray-500">
                          {selectedCustomer.city}{selectedCustomer.region ? `, ${selectedCustomer.region}` : ''}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={clearSelectedCustomer}
                      className="text-xs text-brand-600 hover:text-brand-700 font-medium flex-shrink-0"
                    >
                      Change
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={customerSearchQuery}
                      onChange={(e) => handleCustomerSearch(e.target.value)}
                      onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                      className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none text-sm"
                    />
                    {searchLoading && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
                    )}
                  </div>
                  {showDropdown && searchResults.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      {searchResults.map((result) => (
                        <button
                          key={result.userId}
                          type="button"
                          onClick={() => selectCustomer(result)}
                          className="w-full text-left px-4 py-3 hover:bg-brand-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <p className="text-sm font-medium text-gray-900">{result.fullName}</p>
                          <p className="text-xs text-gray-500">{result.email}</p>
                        </button>
                      ))}
                    </div>
                  )}
                  {showDropdown && !searchLoading && searchResults.length === 0 && customerSearchQuery.length >= 2 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center">
                      <p className="text-sm text-gray-500">No customers found</p>
                    </div>
                  )}
                </div>
              )
            )}

            {/* New customer fields */}
            {isNewCustomer && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    {...register('customerName', { required: 'Full name is required' })}
                    type="text"
                    placeholder="e.g. Abena Mensah"
                    className={inputClass}
                  />
                  {errors.customerName && <p className={errorClass}>{errors.customerName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    {...register('customerEmail', {
                      required: 'Email is required',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                    })}
                    type="email"
                    placeholder="e.g. abena@example.com"
                    className={inputClass}
                  />
                  {errors.customerEmail && <p className={errorClass}>{errors.customerEmail.message}</p>}
                </div>
                <p className="text-xs text-gray-400">Phone and shipping address collected in Step 3.</p>
              </div>
            )}
          </div>
        )}

        {/* Step 2 — Products */}
        {step === 2 && (
          <div className="space-y-4">
            {/* Product picker card */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Add Product</h2>

              <ProductPicker
                products={products}
                value={selectedProductId}
                variantValue={selectedVariantId}
                onChange={(productId, variantId) => {
                  setSelectedProductId(productId)
                  setSelectedVariantId(variantId)
                  setSelectedQty(1)
                }}
                onClear={() => { setSelectedProductId(''); setSelectedVariantId(''); setSelectedQty(1) }}
              />

              {selectedProductId && (
                <div className="flex gap-3 items-end mt-4">
                  <div className="w-28">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Qty</label>
                    <input
                      type="number"
                      min={1}
                      value={selectedQty}
                      onChange={(e) => setSelectedQty(Math.max(1, parseInt(e.target.value) || 1))}
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-3 rounded-xl text-sm transition-colors h-[46px]"
                  >
                    <Plus className="w-4 h-4" />
                    Add to order
                  </button>
                </div>
              )}

              {itemsError && <p className={`${errorClass} mt-3`}>{itemsError}</p>}
            </div>

            {/* Order items list */}
            {orderItems.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Order Items <span className="text-brand-600 ml-1">{orderItems.length}</span>
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {orderItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 px-6 py-4">
                      {item.productImage ? (
                        <Image src={item.productImage} alt={item.productName} width={52} height={52} className="w-13 h-13 object-cover rounded-xl flex-shrink-0" />
                      ) : (
                        <div className="w-13 h-13 bg-gray-100 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ width: 52, height: 52 }}>
                          <Package className="w-5 h-5 text-gray-300" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.productName}</p>
                        {item.variantName && (
                          <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full mt-0.5">{item.variantName}</span>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400">{item.quantity} × {formatPrice(item.unitPrice)}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-sm font-bold text-gray-900">{formatPrice(item.unitPrice * item.quantity)}</p>
                      </div>
                      <button type="button" onClick={() => removeItem(idx)} className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 ml-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Subtotal</span>
                  <span className="text-base font-bold text-gray-900">{formatPrice(totalAmount)}</span>
                </div>
              </div>
            )}

            {orderItems.length === 0 && (
              <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                <Package className="w-9 h-9 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No items added yet</p>
              </div>
            )}
          </div>
        )}

        {/* Step 3 — Shipping */}
        {step === 3 && (
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Shipping Details</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  {...register('customerPhone', { required: 'Phone number is required' })}
                  type="tel"
                  placeholder="e.g. 024 000 0000"
                  className={inputClass}
                />
                {errors.customerPhone && <p className={errorClass}>{errors.customerPhone.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                <input
                  {...register('shippingAddress', { required: 'Shipping address is required' })}
                  type="text"
                  placeholder="Street address or landmark"
                  className={inputClass}
                />
                {errors.shippingAddress && <p className={errorClass}>{errors.shippingAddress.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  {...register('city', { required: 'City is required' })}
                  type="text"
                  placeholder="e.g. Accra"
                  className={inputClass}
                />
                {errors.city && <p className={errorClass}>{errors.city.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <input
                  {...register('region', { required: 'Region is required' })}
                  type="text"
                  placeholder="e.g. Greater Accra"
                  className={inputClass}
                />
                {errors.region && <p className={errorClass}>{errors.region.message}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Step 4 — Review */}
        {step === 4 && (
          <div className="space-y-4">
            {/* Existing customer conflict */}
            {foundCustomer && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <div className="flex gap-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900 text-sm">Customer already exists</p>
                    <p className="text-sm text-amber-700 mt-0.5">
                      An account with this email is already registered. Do you want to create the order for this customer instead?
                    </p>
                  </div>
                </div>
                <div className="bg-white border border-amber-100 rounded-lg p-4 mb-4 space-y-1">
                  <p className="text-sm font-semibold text-gray-900">{foundCustomer.fullName}</p>
                  <p className="text-sm text-gray-500">{foundCustomer.email}</p>
                  {foundCustomer.phone && <p className="text-sm text-gray-500">{foundCustomer.phone}</p>}
                  {foundCustomer.city && (
                    <p className="text-sm text-gray-500">
                      {foundCustomer.city}{foundCustomer.region ? `, ${foundCustomer.region}` : ''}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={proceedWithFoundCustomer}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Yes, use this customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setFoundCustomer(null)}
                    className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
                  >
                    Go back
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Customer</h2>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-brand-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-brand-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900">{reviewName}</p>
                    {isNewCustomer && (
                      <span className="text-xs font-medium bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full">
                        New customer
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{reviewEmail}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Items</h2>
              <div className="space-y-3">
                {orderItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    {item.productImage ? (
                      <Image src={item.productImage} alt={item.productName} width={44} height={44} className="w-11 h-11 object-cover rounded-lg flex-shrink-0" />
                    ) : (
                      <div className="w-11 h-11 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                        <Package className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                      {item.variantName && <p className="text-xs text-gray-500">{item.variantName}</p>}
                      <p className="text-xs text-gray-400">{item.quantity} × {formatPrice(item.unitPrice)}</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <span className="font-semibold text-gray-700">Total</span>
                <span className="text-lg font-bold text-gray-900">{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Shipping</h2>
              <dl className="space-y-1.5 text-sm">
                {(
                  [
                    ['Phone', watch('customerPhone')],
                    ['Address', watch('shippingAddress')],
                    ['City', watch('city')],
                    ['Region', watch('region')],
                  ] as [string, string][]
                ).map(([label, value]) => (
                  <div key={label} className="flex gap-2">
                    <dt className="text-gray-500 w-28 flex-shrink-0">{label}</dt>
                    <dd className="text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              disabled={isSubmitting}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 px-4 py-2.5 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 px-5 py-2.5 rounded-xl transition-colors"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 px-5 py-2.5 rounded-xl transition-colors"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Creating...</>
              ) : (
                <>Create Order<ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          )}
        </div>
      </div>
    </form>
  )
}
