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
            const url = await uploadCardImage(file)
            onChange(url)
        } catch (err) {
            setError(err.message)
        } finally {
            setUploading(false)
        }
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