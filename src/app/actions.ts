'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function saveContent(id: string, content: string) {
  const supabase = await createClient()
  
  // Verify auth strictly on the server 
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('Unauthorized: Session not found')
  }

  const { error } = await supabase
    .from('site_content')
    .upsert({ id, content, updated_at: new Date().toISOString() })

  if (error) {
    console.error('Save content error:', error.message)
    throw new Error('Failed to save content to Supabase')
  }

  // Clear server cache so next visitors see the updated content instantly
  revalidatePath('/', 'layout')
  
  return { success: true }
}
