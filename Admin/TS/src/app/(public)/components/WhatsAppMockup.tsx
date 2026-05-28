'use client'

import { useEffect, useState } from 'react'
import { Icon as IconifyIcon } from '@iconify/react'
import { ECOEXPLORA } from '../config'
import { chatScenes } from '../data'

const SCENE_DURATION = 3500 // ms que dura cada escena
const FADE_DURATION = 600   // ms de transición

const WhatsAppMockup = () => {
  const [currentScene, setCurrentScene] = useState(0)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true)
      setTimeout(() => {
        setCurrentScene((prev) => (prev + 1) % chatScenes.length)
        setIsFading(false)
      }, FADE_DURATION)
    }, SCENE_DURATION)

    return () => clearInterval(interval)
  }, [])

  const scene = chatScenes[currentScene]

  return (
    <div className="wa-mockup mx-auto">
      <div className="wa-phone">
        <div className="wa-notch" />
        <div className="wa-screen">
          {/* Header */}
          <div className="wa-header d-flex align-items-center gap-2 px-3 py-2">
            <button type="button" className="wa-back btn btn-sm p-0">
              <IconifyIcon icon="tabler:chevron-left" />
            </button>
            <div className="wa-avatar">
              <img 
                src="/images/ecoexplora-logo.png" 
                alt="EcoExplora"
                width={36}
                height={36}
                style={{ objectFit: 'cover', borderRadius: '50%' }}
              />
            </div>
            <div className="wa-header-info">
              <div className="wa-title">{ECOEXPLORA.brand}</div>
              <div className="wa-subtitle">
                <span className="wa-dot" /> en línea
              </div>
            </div>
            <div className="wa-header-actions d-flex gap-2 ms-auto">
              <IconifyIcon icon="tabler:video" className="fs-5 opacity-75" />
              <IconifyIcon icon="tabler:phone" className="fs-5 opacity-75" />
            </div>
          </div>

          {/* Chat body con escena */}
          <div className="wa-body px-3 py-3">
            <div className={`wa-scene ${isFading ? 'wa-scene-fade-out' : 'wa-scene-fade-in'}`}>
              {/* Fecha */}
              <div className="wa-date-separator">Hoy</div>

              {scene.messages.map((msg, i) => (
                <div key={i} className={`wa-row ${msg.from === 'user' ? 'wa-row-user' : 'wa-row-bot'}`}>
                  <div className={`wa-bubble ${msg.from === 'user' ? 'wa-bubble-user' : 'wa-bubble-bot'}`}>
                    {msg.text && (
                      <p className="wa-text mb-1">
                        {msg.text.split('\n').map((line, idx) => (
                          <span key={idx}>
                            {line}
                            {idx < msg.text!.split('\n').length - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    )}

                    {msg.buttons && (
                      <div className="wa-buttons mt-2">
                        {msg.buttons.map((btn, idx) => (
                          <button key={idx} className="wa-btn">
                            {btn.icon && <IconifyIcon icon={btn.icon} width={14} className="me-1" />}
                            {btn.title}
                          </button>
                        ))}
                      </div>
                    )}

                    {msg.list && (
                      <div className="wa-list mt-2">
                        <div className="wa-list-header">{msg.listTitle || 'Opciones'}</div>
                        {msg.list.map((item, idx) => (
                          <div key={idx} className="wa-list-item">
                            <div className="wa-list-title">{item.title}</div>
                            <div className="wa-list-desc">{item.description}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <span className="wa-time">
                      {msg.time}
                      {msg.from === 'user' && <IconifyIcon icon="tabler:checks" className="ms-1" />}
                    </span>
                  </div>
                </div>
              ))}

              {/* Typing indicator al final si es escena del bot */}
              {scene.showTyping && (
                <div className="wa-row wa-row-bot">
                  <div className="wa-bubble wa-bubble-bot wa-typing">
                    <span className="wa-dot-typing" />
                    <span className="wa-dot-typing" />
                    <span className="wa-dot-typing" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Input */}
          <div className="wa-input d-flex align-items-center gap-2 px-2 py-2">
            <div className="wa-input-box flex-grow-1 d-flex align-items-center gap-2 px-3">
              <IconifyIcon icon="tabler:mood-smile" className="fs-5 opacity-50" />
              <span className="wa-placeholder">Mensaje</span>
              <IconifyIcon icon="tabler:paperclip" className="fs-5 opacity-50 ms-auto" />
              <IconifyIcon icon="tabler:camera" className="fs-5 opacity-50" />
            </div>
            <button type="button" className="wa-send" aria-label="Enviar">
              <IconifyIcon icon="tabler:microphone" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhatsAppMockup
