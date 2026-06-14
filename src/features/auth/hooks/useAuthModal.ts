'use client'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useSearchParams } from 'next/navigation'

export type ModalType = 'login' | 'register' | null

export const useAuthModal = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentModal: ModalType =
    (searchParams.get('modal') as ModalType) ?? null

  const open = (modal: 'login' | 'register') => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('modal', modal)
    router.push(`${pathname}?${params.toString()}`)
  }

  const close = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('modal')
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  const switchTo = (modal: 'login' | 'register') => open(modal)

  return { currentModal, open, close, switchTo }
}
