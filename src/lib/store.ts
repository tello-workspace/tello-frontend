import { configureStore } from '@reduxjs/toolkit'
import { api } from './api'

// Next.js'te store'u modül seviyesinde tek instance yapmak yerine
// fabrika fonksiyonuyla üretiyoruz (Redux'un resmi Next.js önerisi):
// SSR sırasında istekler arası state sızmasını önler.
export const makeStore = () => {
  return configureStore({
    reducer: {
      [api.reducerPath]: api.reducer,
      // Feature slice'ları geldikçe buraya eklenecek, örn:
      // auth: authReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
  })
}

// Tip yardımcıları
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
