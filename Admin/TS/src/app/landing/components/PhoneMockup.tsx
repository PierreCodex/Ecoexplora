'use client'

import { useEffect, useState } from 'react'
import { Icon as IconifyIcon } from '@iconify/react'

interface ChatMessage {
  id: number
  type: 'bot' | 'user'
  content?: string
  buttons?: { title: string; icon?: string }[]
  list?: { title: string; description: string }[]
  delay: number
}

const chatFlow: ChatMessage[] = [
  {
    id: 1,
    type: 'bot',
    content: '¡Hola! 👋 Soy el asistente de *EcoExplora Tumbes*.',
    delay: 500,
  },
  {
    id: 2,
    type: 'bot',
    content: '¿Querés ver qué tours tenemos disponibles? 🌿',
    buttons: [{ title: 'Ver tours', icon: 'tabler:map' }],
    delay: 1500,
  },
  {
    id: 3,
    type: 'user',
    content: 'Ver tours',
    delay: 2800,
  },
  {
    id: 4,
    type: 'bot',
    content: '📍 Estos son nuestros tours:',
    list: [
      { title: '🥾 Manglares de Tumbes', description: 'Desde S/ 120 · Día completo' },
      { title: '🐢 Avistamiento de Ballenas', description: 'Desde S/ 180 · 4 horas' },
      { title: '🌊 Surf en Zorritos', description: 'Desde S/ 90 · 3 horas' },
      { title: '🦜 Birdwatching', description: 'Desde S/ 100 · Medio día' },
    ],
    delay: 3500,
  },
  {
    id: 5,
    type: 'user',
    content: '🥾 Manglares de Tumbes',
    delay: 5500,
  },
  {
    id: 6,
    type: 'bot',
    content: '🌿 *Full Manglares*\n📅 Duración: Día completo\n💰 S/ 120 por persona\n\nRecorrido por los manglares con guía especializado.',
    buttons: [
      { title: 'Ver detalle', icon: 'tabler:file' },
      { title: 'Reservar', icon: 'tabler:calendar' },
    ],
    delay: 6200,
  },
  {
    id: 7,
    type: 'user',
    content: 'Reservar',
    delay: 8000,
  },
  {
    id: 8,
    type: 'bot',
    content: '¡Genial! 🎉 Vamos a reservar *Full Manglares*.\n\n¿Para cuántas personas? 👥',
    list: [
      { title: '1 persona', description: 'S/ 120' },
      { title: '2 personas', description: 'S/ 240' },
      { title: '3 personas', description: 'S/ 360' },
      { title: '4+ personas', description: 'Consultar grupo' },
    ],
    delay: 8700,
  },
  {
    id: 9,
    type: 'user',
    content: '2 personas',
    delay: 10500,
  },
  {
    id: 10,
    type: 'bot',
    content: '¡Perfecto! ¿Qué día te gustaría ir? 📅',
    list: [
      { title: 'Sábado 31 may', description: '✅ Disponible' },
      { title: 'Domingo 1 jun', description: '✅ Disponible' },
      { title: 'Lunes 2 jun', description: '⚠️ Quedan 3 cupos' },
    ],
    delay: 11200,
  },
  {
    id: 11,
    type: 'user',
    content: 'Sábado 31 may',
    delay: 13000,
  },
  {
    id: 12,
    type: 'bot',
    content: '📅 Fecha elegida: *Sábado 31 de mayo*\n\n¿Confirmamos esta fecha?',
    buttons: [
      { title: 'Confirmar', icon: 'tabler:check' },
      { title: 'Cambiar fecha', icon: 'tabler:calendar' },
    ],
    delay: 13700,
  },
]

const PhoneMockup = () => {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([])
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    chatFlow.forEach((msg) => {
      setTimeout(() => {
        if (msg.type === 'bot') {
          setIsTyping(true)
          setTimeout(() => {
            setIsTyping(false)
            setVisibleMessages((prev) => [...prev, msg.id])
          }, 800)
        } else {
          setVisibleMessages((prev) => [...prev, msg.id])
        }
      }, msg.delay)
    })
  }, [])

  const getMessage = (id: number) => chatFlow.find((m) => m.id === id)

  return (
    <div className="phone-mockup-container">
      <div className="phone-frame">
        {/* Status Bar */}
        <div className="phone-status-bar">
          <span>9:41</span>
          <div className="phone-status-icons">
            <IconifyIcon icon="tabler:signal-5g" width={14} />
            <IconifyIcon icon="tabler:wifi" width={14} />
            <IconifyIcon icon="tabler:battery-4" width={18} />
          </div>
        </div>

        {/* WhatsApp Header */}
        <div className="whatsapp-header">
          <div className="d-flex align-items-center gap-2">
            <IconifyIcon icon="tabler:arrow-left" width={20} />
            <div className="whatsapp-avatar">
              <img
                src="https://ui-avatars.com/api/?name=Eco+Explora&background=25D366&color=fff&size=80"
                alt="EcoExplora"
                width={36}
                height={36}
              />
            </div>
            <div>
              <div className="fw-semibold fs-sm text-white">EcoExplora Tumbes</div>
              <div className="fs-xs text-white opacity-75">en línea</div>
            </div>
          </div>
          <div className="d-flex gap-3 text-white">
            <IconifyIcon icon="tabler:video" width={18} />
            <IconifyIcon icon="tabler:phone" width={18} />
            <IconifyIcon icon="tabler:dots-vertical" width={18} />
          </div>
        </div>

        {/* Chat Area */}
        <div className="whatsapp-chat">
          {/* Date separator */}
          <div className="chat-date-separator">Hoy</div>

          {visibleMessages.map((msgId) => {
            const msg = getMessage(msgId)
            if (!msg) return null

            if (msg.type === 'user') {
              return (
                <div key={msg.id} className="message-wrapper user">
                  <div className="message-bubble user">
                    <div className="message-content">{msg.content}</div>
                    <div className="message-time">
                      9:42 <IconifyIcon icon="tabler:checks" width={14} className="text-info" />
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <div key={msg.id} className="message-wrapper bot">
                <div className="message-bubble bot">
                  <div className="message-sender">EcoExplora</div>
                  <div className="message-content">
                    {msg.content?.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        {i < (msg.content?.split('\n').length || 0) - 1 && <br />}
                      </span>
                    ))}
                  </div>

                  {/* Buttons */}
                  {msg.buttons && (
                    <div className="message-buttons">
                      {msg.buttons.map((btn, idx) => (
                        <button key={idx} className="msg-button">
                          {btn.icon && <IconifyIcon icon={btn.icon} width={16} />}
                          {btn.title}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* List */}
                  {msg.list && (
                    <div className="message-list">
                      <div className="list-header">Opciones</div>
                      {msg.list.map((item, idx) => (
                        <div key={idx} className="list-item">
                          <div className="list-item-title">{item.title}</div>
                          <div className="list-item-desc">{item.description}</div>
                        </div>
                      ))}
                      <div className="list-footer">
                        <IconifyIcon icon="tabler:chevron-left" width={14} />
                        <span>Atrás</span>
                      </div>
                    </div>
                  )}

                  <div className="message-time">9:42</div>
                </div>
              </div>
            )
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="message-wrapper bot">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="whatsapp-input">
          <IconifyIcon icon="tabler:mood-smile" width={22} className="text-muted" />
          <div className="input-placeholder">Escribe un mensaje</div>
          <IconifyIcon icon="tabler:paperclip" width={22} className="text-muted" />
          <IconifyIcon icon="tabler:camera" width={22} className="text-muted" />
        </div>
      </div>

      {/* Reflection effect */}
      <div className="phone-reflection"></div>
    </div>
  )
}

export default PhoneMockup
