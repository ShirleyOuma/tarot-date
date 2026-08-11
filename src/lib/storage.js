import { generateUUID } from './uuid'

// Converts a File/Blob into a base64 string, for sending through our rate-limited API route.
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result.split(',')[1]) // strip the "data:image/jpeg;base64," prefix
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

export async function uploadCardImage(file) {
    const ext = file.name.split('.').pop()
    const fileName = `${generateUUID()}.${ext}`
    const fileBase64 = await fileToBase64(file)

    const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileBase64, fileName, contentType: file.type }),
    })

    if (!res.ok) {
        const { error } = await res.json()
        throw new Error(error)
    }

    const { url } = await res.json()
    return url
}