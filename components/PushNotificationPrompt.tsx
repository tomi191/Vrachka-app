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

  useEffect(() => {
    // Check if push is supported
    const supported = isPushSupported()
    setIsSupported(supported)

    if (supported) {
      // Check if already subscribed
      checkSubscribed().then(setIsSubscribed)

      // Show prompt after 10 seconds if not subscribed and permission not denied
      const permission = getNotificationPermission()
      if (!isSubscribed && permission === 'default') {
        const timer = setTimeout(() => {
          setShowPrompt(true)
        }, 10000) // Show after 10 seconds

        return () => clearTimeout(timer)
      }
    }
  }, [isSubscribed])

  const handleSubscribe = async () => {
    setLoading(true)
    setError('')

    try {
      await subscribeToPush()
      setIsSubscribed(true)
      setShowPrompt(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to subscribe'
      setError(message)
      console.error('Push subscription error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Don't render if not supported
  if (!isSupported) return null

  // Show subscription prompt
  if (showPrompt && !isSubscribed) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-fade-in">
        <Card className="glass-card border-accent-500/30">
          <CardContent className="pt-6 relative">
            <button
              onClick={() => setShowPrompt(false)}
              className="absolute top-2 right-2 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-accent-500/20 flex items-center justify-center flex-shrink-0">
                <Bell className="w-6 h-6 text-accent-400" />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-zinc-50 mb-2">
                  Получавай дневни напомняния
                </h3>
                <p className="text-sm text-zinc-400 mb-4">
                  Ще ти изпращаме напомняне всеки ден в 8:00 сутринта за твоя дневен хороскоп
                </p>

                {error && (
                  <p className="text-sm text-red-400 mb-3">{error}</p>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={handleSubscribe}
                    disabled={loading}
                    size="sm"
                    className="bg-accent-600 hover:bg-accent-700"
                  >
                    {loading ? 'Записване...' : 'Включи'}
                  </Button>
                  <Button
                    onClick={() => setShowPrompt(false)}
                    disabled={loading}
                    size="sm"
                    variant="outline"
                  >
                    По-късно
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
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
