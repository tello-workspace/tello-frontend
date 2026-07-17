'use client'

import { useRef, type ReactNode } from 'react'
import { Provider } from 'react-redux'
import { makeStore, type AppStore } from './store'

// Redux React dünyasına aittir, server component'lerde çalışmaz.
// Bu yüzden Provider'ı "use client" işaretli bu bileşene hapsediyoruz;
// layout.tsx server component olarak kalır, çocukları bununla sarar.
export default function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }
  return <Provider store={storeRef.current}>{children}</Provider>
}
