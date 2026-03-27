'use client'

import { useForm, Controller } from 'react-hook-form'
import { createProduct, updateProduct } from '@tor/lib/actions/products'
import { MAX_MEDIA_PER_PRODUCT, MAX_MEDIA_PER_VARIANT } from '@tor/lib/utils'
import { createClient } from '@tor/lib/supabase/client'
import { ProductWithMedia } from '@tor/lib/types'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Upload, X, Play, ImageIcon, Video, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import Select from '@tor/ui/Select'
import Image from 'next/image'
import { useToast } from '@tor/ui/Toast'
import { useStore } from '@tor/store/context'

interface MediaItem {
  url: string
  type: 'image' | 'video'
}

interface VariantRow {
  name: string
  price: string
  compare_at_price: string
  stock_quantity: string
  is_default: boolean
  media: MediaItem[]
}

interface ProductFields {
  name: string
  description: string
  price: string
  compare_at_price: string
  category: string
  stock_quantity: string
  featured: boolean
}

export default function ProductForm({ product }: { product?: ProductWithMedia }) {
  const store = useStore()
  const [uploading, setUploading] = useState(false)
  const [media, setMedia] = useState<MediaItem[]>([])
  const [urlType, setUrlType] = useState<'image' | 'video'>('image')
  const urlInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()
  const isEdit = !!product

  // Variants
  const existingVariants = product?.product_variants?.sort((a, b) => a.sort_order - b.sort_order) || []
  const existingMedia = product?.product_media || []
  const [variants, setVariants] = useState<VariantRow[]>(
    existingVariants.map(v => ({
      name: v.name,
      price: String(v.price),
      compare_at_price: v.compare_at_price ? String(v.compare_at_price) : '',
      stock_quantity: String(v.stock_quantity),
      is_default: v.is_default,
      media: existingMedia
        .filter(m => m.variant_id === v.id)
        .map(m => ({ url: m.url, type: m.type })),
    }))
  )
  const [variantUploading, setVariantUploading] = useState<number | null>(null)
  const [showVariants, setShowVariants] = useState(variants.length > 0)
  const hasVariants = variants.length > 0

  const atLimit = media.length >= MAX_MEDIA_PER_PRODUCT

  const { register, handleSubmit, control, formState: { isSubmitting } } = useForm<ProductFields>({
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price ? String(product.price) : '',
      compare_at_price: product?.compare_at_price ? String(product.compare_at_price) : '',
      category: product?.category || store.categories[0]?.slug || '',
      stock_quantity: product?.stock_quantity ? String(product.stock_quantity) : '0',
      featured: product?.featured || false,
    },
  })

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    const supabase = createClient()
    const remaining = MAX_MEDIA_PER_PRODUCT - media.length

    for (const file of Array.from(files).slice(0, remaining)) {
      try {
        const fileType = file.type.startsWith('video') ? 'video' : 'image'
        const ext = file.name.split('.').pop()
        const fileName = `new/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(fileName)

        setMedia(prev => [...prev, { url: publicUrl, type: fileType as 'image' | 'video' }])
      } catch {
        toast(`Failed to upload ${file.name}`, 'error')
      }
    }

    setUploading(false)
    e.target.value = ''
  }

  function handleUrlAdd() {
    if (atLimit) return
    const url = urlInputRef.current?.value?.trim()
    if (!url) return
    setMedia(prev => [...prev, { url, type: urlType }])
    if (urlInputRef.current) urlInputRef.current.value = ''
  }

  function removeMedia(index: number) {
    setMedia(prev => prev.filter((_, i) => i !== index))
  }

  function addVariant() {
    setVariants(prev => [...prev, { name: '', price: '', compare_at_price: '', stock_quantity: '0', is_default: prev.length === 0, media: [] }])
  }

  async function handleVariantFileUpload(variantIndex: number, e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    setVariantUploading(variantIndex)
    const supabase = createClient()
    const currentMedia = variants[variantIndex].media
    const remaining = MAX_MEDIA_PER_VARIANT - currentMedia.length

    const newMedia: MediaItem[] = []
    for (const file of Array.from(files).slice(0, remaining)) {
      try {
        const fileType = file.type.startsWith('video') ? 'video' : 'image'
        const ext = file.name.split('.').pop()
        const fileName = `new/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('products')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('products')
          .getPublicUrl(fileName)

        newMedia.push({ url: publicUrl, type: fileType as 'image' | 'video' })
      } catch {
        toast(`Failed to upload ${file.name}`, 'error')
      }
    }

    if (newMedia.length > 0) {
      setVariants(prev => prev.map((v, i) =>
        i === variantIndex ? { ...v, media: [...v.media, ...newMedia] } : v
      ))
    }

    setVariantUploading(null)
    e.target.value = ''
  }

  function removeVariantMedia(variantIndex: number, mediaIndex: number) {
    setVariants(prev => prev.map((v, i) =>
      i === variantIndex ? { ...v, media: v.media.filter((_, mi) => mi !== mediaIndex) } : v
    ))
  }

  function updateVariant(index: number, field: keyof VariantRow, value: string | boolean) {
    setVariants(prev => prev.map((v, i) => {
      if (i !== index) {
        // If setting a new default, unset others
        if (field === 'is_default' && value === true) return { ...v, is_default: false }
        return v
      }
      return { ...v, [field]: value }
    }))
  }

  function removeVariant(index: number) {
    setVariants(prev => {
      const next = prev.filter((_, i) => i !== index)
      // Ensure at least one default if variants remain
      if (next.length > 0 && !next.some(v => v.is_default)) {
        next[0].is_default = true
      }
      return next
    })
  }

  // Auto-sort media so images come first (primary must be an image)
  const sortedMedia = [...media].sort((a, b) => {
    if (a.type === 'image' && b.type === 'video') return -1
    if (a.type === 'video' && b.type === 'image') return 1
    return 0
  })

  const hasImage = media.some(m => m.type === 'image')

  async function onSubmit(data: ProductFields) {
    if (!isEdit && !hasImage) {
      toast('Please add at least one image for the product.', 'error')
      return
    }

    const formData = new FormData()
    formData.set('name', data.name)
    formData.set('description', data.description)
    if (!hasVariants) {
      formData.set('price', data.price)
      formData.set('compare_at_price', data.compare_at_price)
      formData.set('stock_quantity', data.stock_quantity)
    }
    formData.set('category', data.category)
    formData.set('featured', data.featured ? 'on' : '')

    // Append media to form data (sorted so images come first — primary must be an image)
    for (const item of sortedMedia) {
      formData.append('media_urls', item.url)
      formData.append('media_types', item.type)
    }

    // Append variants as JSON (including media)
    if (hasVariants) {
      const variantData = variants
        .filter(v => v.name.trim() && v.price)
        .map(v => ({
          name: v.name.trim(),
          price: parseFloat(v.price),
          compare_at_price: v.compare_at_price ? parseFloat(v.compare_at_price) : null,
          stock_quantity: parseInt(v.stock_quantity) || 0,
          is_default: v.is_default,
          media: v.media,
        }))
      formData.set('variants', JSON.stringify(variantData))
    } else {
      formData.set('variants', JSON.stringify([]))
    }

    try {
      if (isEdit) {
        await updateProduct(product!.id, formData)
      } else {
        await createProduct(formData)
      }
      router.push('/admin/products')
    } catch {
      toast('Error saving product. Please try again.', 'error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
        <input
          {...register('name', { required: true })}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
          placeholder="e.g. Brazilian Body Wave Wig"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none"
          placeholder="Describe the product..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (GHS)
            {hasVariants && <span className="text-gray-400 font-normal ml-1">(auto from variants)</span>}
          </label>
          <input
            {...register('price', { required: !hasVariants })}
            type="number"
            step="0.01"
            disabled={hasVariants}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-400"
            placeholder={hasVariants ? 'Set by variants' : '0.00'}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Compare Price (GHS)</label>
          <input
            {...register('compare_at_price')}
            type="number"
            step="0.01"
            disabled={hasVariants}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-400"
            placeholder={hasVariants ? 'Set per variant' : 'Original price (optional)'}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <Controller
            name="category"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                options={store.categories.map((cat) => ({
                  value: cat.slug,
                  label: cat.name,
                }))}
              />
            )}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock Quantity
            {hasVariants && <span className="text-gray-400 font-normal ml-1">(per variant)</span>}
          </label>
          <input
            {...register('stock_quantity', { required: !hasVariants })}
            type="number"
            disabled={hasVariants}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          {...register('featured')}
          id="featured"
          className="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500"
        />
        <label htmlFor="featured" className="text-sm font-medium text-gray-700">
          Featured product (shown on homepage)
        </label>
      </div>

      {/* Media Upload Section — only for new products */}
      {!isEdit && (
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">Product Images & Videos</label>
            <span className={`text-xs font-medium ${atLimit ? 'text-red-500' : 'text-gray-400'}`}>
              {media.length}/{MAX_MEDIA_PER_PRODUCT}
            </span>
          </div>

          {/* Preview */}
          {media.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {media.map((item, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 group">
                  {item.type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Play className="w-6 h-6 text-gray-500" />
                    </div>
                  ) : (
                    <Image src={item.url} alt="" fill className="object-cover" sizes="80px" />
                  )}
                  {i === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-brand-600 text-white text-[9px] font-bold text-center py-0.5">
                      PRIMARY
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => removeMedia(i)}
                    className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* File Upload */}
          <div className="relative border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-brand-400 transition-colors cursor-pointer mb-3">
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto text-brand-500" />
            ) : (
              <>
                <Upload className="w-5 h-5 mx-auto text-gray-400 mb-1" />
                <p className="text-xs text-gray-500">Click to upload photos or videos (multiple allowed)</p>
              </>
            )}
          </div>

          {/* URL Input */}
          <div>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setUrlType('image')}
                className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full ${urlType === 'image' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <ImageIcon className="w-3 h-3" /> Image
              </button>
              <button
                type="button"
                onClick={() => setUrlType('video')}
                className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full ${urlType === 'video' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <Video className="w-3 h-3" /> Video
              </button>
            </div>
            <div className="flex gap-2">
              <input
                ref={urlInputRef}
                placeholder="Or paste image/video URL..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              />
              <button
                type="button"
                onClick={handleUrlAdd}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Variants Section */}
      <div className="border-t border-gray-100 pt-4">
        <button
          type="button"
          onClick={() => setShowVariants(!showVariants)}
          className="flex items-center justify-between w-full text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 transition-colors group"
        >
          <div>
            <span className="text-sm font-semibold text-gray-800">
              Variants
              {hasVariants && <span className="ml-2 text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">{variants.length}</span>}
            </span>
            <p className="text-xs text-gray-400 mt-0.5">Add size, length, or style options with separate pricing</p>
          </div>
          {showVariants ? <ChevronUp className="w-5 h-5 text-gray-400 group-hover:text-gray-600" /> : <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />}
        </button>

        {showVariants && (
          <div className="mt-3 space-y-3">
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5">
              <p className="text-xs text-blue-700 leading-relaxed">
                Does this product come in different sizes, lengths, or styles? Add variants so each option has its own price and stock.
                <span className="block mt-1 text-blue-500">Example: &quot;5x5 Closure 22in&quot; at GHS 150, &quot;13x4 Frontal 26in&quot; at GHS 280</span>
              </p>
            </div>

            {variants.map((v, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={v.is_default}
                      onChange={() => updateVariant(i, 'is_default', true)}
                      className="w-3.5 h-3.5 text-brand-600 border-gray-300 focus:ring-brand-500"
                    />
                    <span className={`text-xs font-medium ${v.is_default ? 'text-brand-600' : 'text-gray-400'}`}>
                      {v.is_default ? 'Default variant' : 'Set as default'}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Variant Name</label>
                  <input
                    value={v.name}
                    onChange={e => updateVariant(i, 'name', e.target.value)}
                    placeholder="e.g. 5x5 Closure 22in"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-white"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Price (GHS)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={v.price}
                      onChange={e => updateVariant(i, 'price', e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Compare Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={v.compare_at_price}
                      onChange={e => updateVariant(i, 'compare_at_price', e.target.value)}
                      placeholder="Optional"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Stock</label>
                    <input
                      type="number"
                      value={v.stock_quantity}
                      onChange={e => updateVariant(i, 'stock_quantity', e.target.value)}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none bg-white"
                    />
                  </div>
                </div>

                {/* Variant Media */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-gray-500">Variant Images</label>
                    <span className={`text-[10px] font-medium ${v.media.length >= MAX_MEDIA_PER_VARIANT ? 'text-red-500' : 'text-gray-400'}`}>
                      {v.media.length}/{MAX_MEDIA_PER_VARIANT}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {v.media.map((m, mi) => (
                      <div key={mi} className="relative w-14 h-14 rounded-md overflow-hidden bg-gray-100 group">
                        {m.type === 'video' ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <Play className="w-4 h-4 text-gray-500" />
                          </div>
                        ) : (
                          <Image src={m.url} alt="" fill className="object-cover" sizes="56px" />
                        )}
                        <button
                          type="button"
                          onClick={() => removeVariantMedia(i, mi)}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}

                    {v.media.length < MAX_MEDIA_PER_VARIANT && (
                      <label className="relative w-14 h-14 rounded-md border-2 border-dashed border-gray-200 hover:border-brand-400 flex items-center justify-center cursor-pointer transition-colors">
                        <input
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          onChange={e => handleVariantFileUpload(i, e)}
                          disabled={variantUploading === i}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {variantUploading === i ? (
                          <Loader2 className="w-4 h-4 animate-spin text-brand-500" />
                        ) : (
                          <Upload className="w-4 h-4 text-gray-300" />
                        )}
                      </label>
                    )}
                  </div>
                  {v.media.length === 0 && (
                    <p className="text-[10px] text-gray-400 mt-1">Optional — falls back to main product images</p>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addVariant}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 border border-dashed border-brand-300 py-3 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Variant
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting || uploading}
        className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-semibold py-3 rounded-full transition-colors flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          isEdit ? 'Update Product' : 'Create Product'
        )}
      </button>
    </form>
  )
}
