import { redirect } from 'next/navigation'

// Ana sayfa şimdilik proje listesine yönlendiriyor.
// Auth eklenince: token yoksa /login'e yönlendirme mantığı buraya gelecek.
export default function Home() {
  redirect('/projects')
}
