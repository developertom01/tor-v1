'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import Image from 'next/image'
import { Upload, Trash2, Play, Loader2, ImageIcon, Video } from 'lucide-react'
import { ProductWithMedia } from '@tor/lib/types'
import { addProductMedia, deleteProductMedia } from '@tor/lib/actions/products'
import { MAX_MEDIA_PER_PRODUCT } from '@tor/lib/utils'
import { createClient } from '@tor/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useToast } from '@tor/ui/Toast'

interface UrlFields {
  url: string
}

export default function MediaManager({ product }: { product: ProductWithMedia }) {
  const [uploading, setUploading] = useState(false)
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const router = useRouter()
  const { toast, confirm } = useToast()
  const media = product.product_media?.sort((a, b) => a.sort_order - b.sort_order) || []
  const atLimit = media.length >= MAX_MEDIA_PER_PRODUCT

  const { register, handleSubmit, reset } = useForm<UrlFields>()

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const supabase = createClient()
      const fileType = file.type.startsWith('video') ? 'video' : 'image'
      const ext = file.name.split('.').pop()
      const fileName = `${product.id}/${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(fileName)

      await addProductMedia(product.id, publicUrl, fileType as 'image' | 'video')
      router.refresh()
    } catch {
      toast('Upload failed. Please try again.', 'error')
    }
    setUploading(false)
    e.target.value = ''
  }

  async function handleDelete(mediaId: string) {
    const ok = await confirm('Delete this media? This cannot be undone.')
    if (!ok) return
    await deleteProductMedia(mediaId, product.id)
    router.refresh()
  }

  async function onUrlSubmit(data: UrlFields) {
    if (!data.url) return
    setUploading(true)
    try {
      await addProductMedia(product.id, data.url, mediaType)
      router.refresh()
      reset()
    } catch {
      toast('Failed to add media.', 'error')
    }
    setUploading(false)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">Product Media</h2>
        <span className={`text-xs font-medium ${atLimit ? 'text-red-500' : 'text-gray-400'}`}>
          {media.length}/{MAX_MEDIA_PER_PRODUCT}
        </span>
      </div>

      {/* Existing Media */}
      {media.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {media.map((m) => (
            <div key={m.id} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {m.type === 'video' ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <Play className="w-8 h-8 text-gray-500" />
                </div>
              ) : (
                <Image src={m.url} alt="" fill className="object-cover" sizes="150px" />
              )}
              {m.is_primary && (
                <span className="absolute top-1 left-1 bg-brand-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  PRIMARY
                </span>
              )}
              <button
                onClick={() => handleDelete(m.id)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload */}
      {atLimit ? (
        <p className="text-sm text-gray-400 text-center py-4">Maximum of {MAX_MEDIA_PER_PRODUCT} media items reached. Delete one to add more.</p>
      ) : (
        <div className="space-y-3">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-1 block">Upload File</span>
            <div className="relative border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-brand-400 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleUpload}
                disabled={uploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {uploading ? (
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-500" />
              ) : (
                <>
                  <Upload className="w-6 h-6 mx-auto text-gray-400 mb-1" />
                  <p className="text-xs text-gray-500">Click to upload photo or video</p>
                </>
              )}
            </div>
          </label>

          {/* URL Input */}
          <form onSubmit={handleSubmit(onUrlSubmit)}>
            <span className="text-sm font-medium text-gray-700 mb-1 block">Or add by URL</span>
            <div className="flex gap-2 mb-2">
              <button
                type="button"
                onClick={() => setMediaType('image')}
                className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full ${mediaType === 'image' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <ImageIcon className="w-3 h-3" /> Image
              </button>
              <button
                type="button"
                onClick={() => setMediaType('video')}
                className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-full ${mediaType === 'video' ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                <Video className="w-3 h-3" /> Video
              </button>
            </div>
            <div className="flex gap-2">
              <input
                {...register('url')}
                placeholder="https://..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
              />
              <button
                type="submit"
                disabled={uploading}
                className="bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
