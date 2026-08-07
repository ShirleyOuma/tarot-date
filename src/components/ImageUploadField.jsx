import { useState } from 'react'
import { uploadCardImage } from '../lib/storage'

function ImageUploadField({ value, onChange }) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)

    async function handleFileChange(e) {
        const file = e.target.files[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            setError('Please choose an image file.')
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            setError('Image must be under 5MB.')
            return
        }

        setError(null)
        setUploading(true)
        try {
            const compressed = await compressImage(file)
            const url = await uploadCardImage(compressed)
            onChange(url)
        } catch (err) {
            setError(err.message)
        } finally {
            setUploading(false)
        }
    }

    function compressImage(file, maxWidth = 800, quality = 0.8) {
        return new Promise((resolve, reject) => {
            const img = new Image()
            const url = URL.createObjectURL(file)

            img.onload = () => {
                URL.revokeObjectURL(url)

                const scale = Math.min(1, maxWidth / img.width)
                const canvas = document.createElement('canvas')
                canvas.width = img.width * scale
                canvas.height = img.height * scale

                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Could not compress image'))
                            return
                        }
                        resolve(new File([blob], file.name, { type: 'image/jpeg' }))
                    },
                    'image/jpeg',
                    quality
                )
            }

            img.onerror = () => {
                URL.revokeObjectURL(url)
                reject(new Error('Could not read image'))
            }

            img.src = url
        })
    }

    return (
        <div className="flex flex-col gap-2">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Card image URL (or upload below)"
                className="bg-white/10 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-amber-400"
            />
            <label className="text-xs text-amber-400 cursor-pointer hover:text-amber-300 w-fit">
                {uploading ? 'Uploading...' : 'Or upload an image from your device'}
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
            </label>
            {value && (
                <img src={value} alt="Preview" className="w-24 aspect-2/3 object-cover rounded-lg border border-white/20" />
            )}
            {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>
    )
}

export default ImageUploadField