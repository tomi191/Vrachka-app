'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  isPushSupported,
  getNotificationPermission,
  subscribeToPush,
  unsubscribeFromPush,
  isSubscribed as checkSubscribed,
} from '@/lib/push/client'

export function PushNotificationPrompt() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if push is supported
    const supported = isPushSupported()
    setIsSupported(supported)

    // Development mode warning
    if (process.env.NODE_ENV === 'development') {
      console.log('🔔 Push Notifications: Service worker is disabled in development mode')
      console.log('   To test push notifications, deploy to production or set disable: false in next.config.js')
      return
    }

    if (supported) {
      console.log('🔔 Push Notifications: Supported and ready')

      // Check if already subscribed
      checkSubscribed().then((subscribed) => {
        console.log('🔔 Push Notifications: Subscription status:', subscribed)
        setIsSubscribed(subscribed)
      })

      // Show prompt after 10 seconds if not subscribed and permission not denied
      const permission = getNotificationPermission()
      console.log('🔔 Push Notifications: Current permission:', permission)

      if (!isSubscribed && permission === 'default') {
        const timer = setTimeout(() => {
          console.log('🔔 Push Notifications: Showing subscription prompt')
          setShowPrompt(true)
        }, 10000) // Show after 10 seconds

        return () => clearTimeout(timer)
      }
    } else {
      console.warn('🔔 Push Notifications: Not supported in this browser')
    }
  }, [isSubscribed])

  // Trigger animation when prompt shows
  useEffect(() => {
    if (showPrompt) {
      setTimeout(() => setIsVisible(true), 50)
    } else {
      setIsVisible(false)
    }
  }, [showPrompt])

  const handleSubscribe = async () => {
    setLoading(true)
    setError('')

    console.log('🔔 Push Notifications: User clicked subscribe')

    try {
      await subscribeToPush()
      console.log('🔔 Push Notifications: Successfully subscribed!')
      setIsSubscribed(true)
      setShowPrompt(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to subscribe'
      setError(message)
      console.error('🔔 Push Notifications: Subscription error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Don't render if not supported
  if (!isSupported) return null

  // Show subscription prompt
  if (showPrompt && !isSubscribed) {
    return (
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setShowPrompt(false)}
        />

        {/* Centered Modal */}
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
          <Card className={`glass-card border-accent-500/30 w-full max-w-sm pointer-events-auto transition-all duration-300 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            <CardContent className="p-6 relative">
              <button
                onClick={() => setShowPrompt(false)}
                className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-300 transition-colors"
                aria-label="Затвори"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-500/20 to-purple-500/20 flex items-center justify-center">
                  <Bell className="w-8 h-8 text-accent-400" />
                </div>
              </div>

              {/* Content */}
              <div className="text-center space-y-3">
                <h3 className="text-lg font-semibold text-zinc-50">
                  Получавай дневни напомняния
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  Ще ти изпращаме напомняне всеки ден в 8:00 сутринта за твоя дневен хороскоп
                </p>

                {error && (
                  <p className="text-sm text-red-400 bg-red-950/20 rounded-lg px-3 py-2">{error}</p>
                )}

                {/* Buttons */}
                <div className="flex flex-col gap-2 pt-2">
                  <Button
                    onClick={handleSubscribe}
                    disabled={loading}
                    className="w-full bg-accent-600 hover:bg-accent-700"
                  >
                    {loading ? 'Записване...' : '🔔 Включи напомняния'}
                  </Button>
                  <Button
                    onClick={() => setShowPrompt(false)}
                    disabled={loading}
                    variant="ghost"
                    className="w-full text-zinc-400 hover:text-zinc-200"
                  >
                    По-късно
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  // Show toggle button when subscribed (in settings)
  return null
}

// Settings component for managing notifications
export function PushNotificationSettings() {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supported = isPushSupported()
    setIsSupported(supported)

    if (supported) {
      checkSubscribed().then(setIsSubscribed)
    }
  }, [])

  const handleSubscribe = async () => {
    setLoading(true)
    setError('')

    try {
      await subscribeToPush()
      setIsSubscribed(true)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to subscribe'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleUnsubscribe = async () => {
    setLoading(true)
    setError('')

    try {
      await unsubscribeFromPush()
      setIsSubscribed(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to unsubscribe'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async () => {
    if (isSubscribed) {
      await handleUnsubscribe()
    } else {
      await handleSubscribe()
    }
  }

  if (!isSupported) {
    return (
      <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
        <p className="text-sm text-zinc-500">
          Push нотификациите не се поддържат от този браузър
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isSubscribed ? (
            <Bell className="w-5 h-5 text-accent-400" />
          ) : (
            <BellOff className="w-5 h-5 text-zinc-500" />
          )}
          <div>
            <h3 className="font-medium text-zinc-50">Дневни напомняния</h3>
            <p className="text-sm text-zinc-400">
              Получавай нотификация всяка сутрин
            </p>
          </div>
        </div>

        <Button
          onClick={handleToggle}
          disabled={loading}
          size="sm"
          variant={isSubscribed ? 'outline' : 'default'}
        >
          {loading ? 'Обработка...' : isSubscribed ? 'Изключи' : 'Включи'}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      {isSubscribed && (
        <p className="text-xs text-zinc-500">
          🔔 Нотификациите са активни. Ще получаваш напомняния всеки ден в 8:00 сутринта.
        </p>
      )}
    </div>
  )
}
