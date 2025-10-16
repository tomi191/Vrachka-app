'use client'

// Web Push Notification Client Utilities

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''

// Convert VAPID key from base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// Check if browser supports push notifications
export function isPushSupported() {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  )
}

// Get current notification permission
export function getNotificationPermission() {
  if (!isPushSupported()) return 'unsupported'
  return Notification.permission
}

// Request notification permission
export async function requestNotificationPermission() {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported')
  }

  const permission = await Notification.requestPermission()
  return permission
}

// Subscribe to push notifications
export async function subscribeToPush() {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported')
  }

  // Check permission
  if (Notification.permission === 'denied') {
    throw new Error('Notification permission denied')
  }

  // Request permission if not granted
  if (Notification.permission !== 'granted') {
    const permission = await requestNotificationPermission()
    if (permission !== 'granted') {
      throw new Error('Notification permission not granted')
    }
  }

  // Register service worker if not already registered
  const registration = await navigator.serviceWorker.ready

  // Check if already subscribed
  let subscription = await registration.pushManager.getSubscription()

  if (!subscription) {
    // Subscribe to push
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    })
  }

  // Send subscription to backend
  const response = await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subscription: subscription.toJSON(),
      userAgent: navigator.userAgent,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to save subscription')
  }

  return subscription
}

// Unsubscribe from push notifications
export async function unsubscribeFromPush() {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported')
  }

  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.getSubscription()

  if (subscription) {
    // Unsubscribe from browser
    await subscription.unsubscribe()

    // Remove from backend
    await fetch('/api/push/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
      }),
    })
  }

  return true
}

// Check if user is subscribed
export async function isSubscribed() {
  if (!isPushSupported()) return false

  try {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    return !!subscription
  } catch {
    return false
  }
}

// Test push notification (for debugging)
export async function sendTestNotification() {
  const response = await fetch('/api/push/test', {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Failed to send test notification')
  }

  return response.json()
}
