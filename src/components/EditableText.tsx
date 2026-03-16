'use client'

import { useState } from 'react'
import { useAdmin } from './AdminProvider'
import { saveContent } from '@/app/actions'
import { Loader2 } from 'lucide-react'

interface EditableTextProps {
  id: string
  initialContent: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  as?: any
  className?: string
  // Determines if we display breaks for multiline support
  multiline?: boolean 
}

export function EditableText({ id, initialContent, as: Tag = 'span', className = '', multiline = false }: EditableTextProps) {
  const { isAdmin } = useAdmin()
  const [isEditing, setIsEditing] = useState(false)
  const [content, setContent] = useState(initialContent)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(false)
  
  const handleBlur = async (e: React.FocusEvent<HTMLElement>) => {
    if (!isAdmin) return
    setIsEditing(false)
    
    // We strictly use innerText so we don't accidentally save injected HTML tags
    const newContent = e.currentTarget.innerText.trim()
    
    if (newContent !== content) {
      setContent(newContent)
      setIsSaving(true)
      setError(false)
      
      try {
         await saveContent(id, newContent)
      } catch (err) {
         console.error('Failed saving content ' + id, err)
         setError(true)
      } finally {
         setIsSaving(false)
      }
    }
  }

  // Common UI logic for CMS highlighting
  const editableStyles = isAdmin && !isEditing
    ? 'cursor-text relative before:absolute before:-inset-2 before:rounded-lg before:border-2 before:border-dashed before:border-[#2c5df1]/50 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:pointer-events-none'
    : ''
    
  const editingStyles = isEditing 
    ? 'outline-none ring-4 ring-[#2c5df1]/30 bg-white/50 backdrop-blur-sm rounded-md shadow-sm p-1 z-50' 
    : ''
    
  const errorStyles = error ? 'ring-4 ring-red-500/50' : ''

  return (
    <span className="relative inline-block w-full" style={{ display: Tag === 'span' ? 'inline' : 'block' }}>
      <Tag
        suppressContentEditableWarning // React complains natively about using contentEditable with children. We silence it.
        contentEditable={isAdmin}
        onClick={(e: React.MouseEvent) => {
          if (isAdmin) {
             setIsEditing(true)
             // Stop click event propagation if needed (e.g. if it\'s inside an anchor tag)
             e.stopPropagation();
          }
        }}
        onBlur={handleBlur}
        className={`${className} ${multiline ? 'whitespace-pre-wrap' : ''} ${editableStyles} ${editingStyles} ${errorStyles} transition-all duration-300`}
      >
        {content}
      </Tag>
      
      {/* Saving State Loader */}
      {isSaving && (
        <span className="absolute top-0 right-0 -translate-y-full -translate-x-2 z-50 text-[10px] font-bold bg-[#2c5df1] text-white px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
          <Loader2 className="w-3 h-3 animate-spin" /> Сохранение...
        </span>
      )}
      
      {/* Error Badge */}
      {error && (
        <span className="absolute top-0 right-0 -translate-y-full -translate-x-2 z-50 text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded shadow-sm">
          Ошибка БД
        </span>
      )}
    </span>
  )
}
