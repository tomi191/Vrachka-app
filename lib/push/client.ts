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
  console.log('🔔 [Client] Starting push subscription flow...')

  if (!isPushSupported()) {
    console.error('🔔 [Client] Push notifications not supported')
    throw new Error('Push notifications are not supported')
  }

  // Check permission
  if (Notification.permission === 'denied') {
    console.error('🔔 [Client] Notification permission denied by user')
    throw new Error('Notification permission denied')
  }

  // Request permission if not granted
  if (Notification.permission !== 'granted') {
    console.log('🔔 [Client] Requesting notification permission...')
    const permission = await requestNotificationPermission()
    console.log('🔔 [Client] Permission result:', permission)
    if (permission !== 'granted') {
      throw new Error('Notification permission not granted')
    }
  }

  console.log('🔔 [Client] Waiting for service worker to be ready...')

  // Check if service worker is registered at all
  const registrations = await navigator.serviceWorker.getRegistrations()
  console.log('🔔 [Client] Service worker registrations:', registrations.length)

  registrations.forEach((reg, index) => {
    console.log(`🔔 [Client] Registration ${index}:`, {
      scope: reg.scope,
      installing: reg.installing?.state,
      waiting: reg.waiting?.state,
      active: reg.active?.state,
      updateViaCache: reg.updateViaCache
    })
  })

  // Cleanup old service workers from /worker/ path (migration fix)
  const oldWorkers = registrations.filter(reg =>
    reg.active?.scriptURL.includes('/worker/index.js') ||
    reg.waiting?.scriptURL.includes('/worker/index.js') ||
    reg.installing?.scriptURL.includes('/worker/index.js')
  )

  if (oldWorkers.length > 0) {
    console.log('🔔 [Client] Found old service workers from /worker/ path, removing...')
    for (const reg of oldWorkers) {
      console.log('🔔 [Client] Unregistering:', reg.scope, reg.active?.scriptURL)
      await reg.unregister()
    }

    // Wait a bit for cleanup to complete
    await new Promise(resolve => setTimeout(resolve, 500))

    // Register new service worker from correct path
    console.log('🔔 [Client] Registering new service worker from /sw.js...')
    const newReg = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
    console.log('🔔 [Client] New service worker registered:', newReg.scope)

    // Wait for it to activate using navigator.serviceWorker.ready
    console.log('🔔 [Client] Waiting for new service worker to activate...')
    await navigator.serviceWorker.ready
    console.log('🔔 [Client] New service worker activated successfully!')
  }

  if (registrations.length === 0) {
    console.error('🔔 [Client] No service worker registered! Attempting manual registration...')
    try {
      // next-pwa generates sw.js in public root by default
      const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
      console.log('🔔 [Client] Service worker registered manually:', reg.scope)

      // Wait for service worker to become active
      // Use navigator.serviceWorker.ready instead of tracking state changes
      // to avoid race conditions
      console.log('🔔 [Client] Waiting for service worker to activate...')
      await navigator.serviceWorker.ready
      console.log('🔔 [Client] Service worker activated successfully')
    } catch (error) {
      console.error('🔔 [Client] Manual registration failed:', error)
      throw new Error('Service worker registration failed. Please refresh the page.')
    }
  }

  // Wait for service worker to be ready with timeout
  const registration = await Promise.race([
    navigator.serviceWorker.ready,
    new Promise<ServiceWorkerRegistration>((_, reject) =>
      setTimeout(() => reject(new Error('Service worker timeout')), 10000)
    )
  ]).catch(error => {
    console.error('🔔 [Client] Service worker not ready:', error)
    throw new Error('Service worker failed to initialize. Please refresh the page.')
  })

  console.log('🔔 [Client] Service worker ready:', registration.active?.scriptURL)

  // Check if already subscribed
  let subscription = await registration.pushManager.getSubscription()
  console.log('🔔 [Client] Existing subscription:', subscription ? 'Found' : 'None')

  if (!subscription) {
    console.log('🔔 [Client] Creating new push subscription...')
    console.log('🔔 [Client] VAPID key:', VAPID_PUBLIC_KEY ? 'Present' : 'MISSING!')

    // Subscribe to push
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    })
    console.log('🔔 [Client] Push subscription created:', subscription.endpoint)
  }

  // Send subscription to backend
  console.log('🔔 [Client] Sending subscription to backend...')
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
    const error = await response.text()
    console.error('🔔 [Client] Backend save failed:', error)
    throw new Error('Failed to save subscription')
  }

  const result = await response.json()
  console.log('🔔 [Client] Subscription saved successfully:', result)

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
