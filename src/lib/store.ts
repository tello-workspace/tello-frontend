import { configureStore } from '@reduxjs/toolkit'
import { api } from './api'
import { authApi } from '@/features/auth/authApi'

// Next.js'te store'u modül seviyesinde tek instance yapmak yerine
// fabrika fonksiyonuyla üretiyoruz (Redux'un resmi Next.js önerisi):
// SSR sırasında istekler arası state sızmasını önler.
export const makeStore = () => {
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware, authApi.middleware),
  })
}

// Tip yardımcıları
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
