'use client'
import Swal from 'sweetalert2'

export interface ConfirmOptions {
  title: string
  text?: string
  confirmText?: string
  cancelText?: string
  variant?: 'warning' | 'danger' | 'success' | 'info'
  inputPlaceholder?: string
  requireReason?: boolean
}

export async function confirmAction(opts: ConfirmOptions): Promise<{ confirmed: boolean; reason?: string }> {
  const variantColor: Record<NonNullable<ConfirmOptions['variant']>, string> = {
    warning: '#f5b849',
    danger: '#dc3545',
    success: '#28a745',
    info: '#17a2b8',
  }

  const result = await Swal.fire({
    title: opts.title,
    text: opts.text,
    icon: opts.variant === 'danger' ? 'warning' : (opts.variant ?? 'question'),
    showCancelButton: true,
    confirmButtonText: opts.confirmText ?? 'Confirmar',
    cancelButtonText: opts.cancelText ?? 'Cancelar',
    confirmButtonColor: variantColor[opts.variant ?? 'warning'],
    cancelButtonColor: '#6c757d',
    input: opts.requireReason ? 'textarea' : undefined,
    inputPlaceholder: opts.inputPlaceholder ?? 'Motivo (opcional)',
    inputValidator: opts.requireReason
      ? (value: string) => (value && value.trim().length > 0 ? null : 'Debes indicar un motivo')
      : undefined,
    reverseButtons: true,
  })

  return { confirmed: result.isConfirmed, reason: result.value as string | undefined }
}

export async function notifyOk(message: string) {
  await Swal.fire({
    icon: 'success',
    title: '¡Listo!',
    text: message,
    timer: 1800,
    showConfirmButton: false,
  })
}

export async function notifyError(message: string) {
  await Swal.fire({
    icon: 'error',
    title: 'Error',
    text: message,
  })
}