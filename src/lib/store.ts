import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '@/features/auth/authApi'; // authApi yolunuzun doğru olduğundan emin olun

// Next.js SSR (Server Side Rendering) için her istekte sıfır store oluşturacak fonksiyon
export const makeStore = () => {
  return configureStore({
    reducer: {
      // 1. authApi reducer'ını buraya ekliyoruz
      [authApi.reducerPath]: authApi.reducer,
    },
    // 2. RTK Query middleware entegrasyonu
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(authApi.middleware),
  });
};

// Tip tanımlamaları (StoreProvider veya diğer bileşenlerin hata vermemesi için)
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
