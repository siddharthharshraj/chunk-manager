'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewPost() {
  const router = useRouter()
  const [heading, setHeading] = useState("")
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addTag = () => {
    if (currentTag.trim() !== "" && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          heading,
          code,
          language,
          tags,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create post')
      }

      const data = await response.json()
      console.log('Post created:', data)

      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-4xl p-8">
        <h1 className="text-4xl font-semibold text-center text-indigo-700 mb-8">Create a Code Snippet</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Heading */}
          <div>
            <label htmlFor="heading" className="block text-lg font-medium text-gray-700 mb-2">
              Heading
            </label>
            <input
              id="heading"
              type="text"
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder="Enter snippet title"
              className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Code */}
          <div>
            <label htmlFor="code" className="block text-lg font-medium text-gray-700 mb-2">
              Code
            </label>
            <textarea
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here"
              className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 min-h-[200px]"
              required
            />
          </div>

          {/* Language */}
          <div>
            <label htmlFor="language" className="block text-lg font-medium text-gray-700 mb-2">
              Programming Language
            </label>
            <input
              id="language"
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="e.g., JavaScript, Python"
              className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-lg font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-3 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full shadow-sm">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-red-500 hover:text-red-700">
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <input
                id="tags"
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={handleTagInputKeyPress}
                placeholder="Add a tag and press Enter"
                className="flex-1 px-4 py-3 border rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700">
                Add Tag
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 text-white rounded-lg shadow-lg ${
              isSubmitting ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
            }`}>
            {isSubmitting ? "Submitting..." : "Create Snippet"}
          </button>
        </form>
      </div>
    </div>
  )
}
