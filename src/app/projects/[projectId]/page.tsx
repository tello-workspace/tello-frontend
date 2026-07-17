// Board tamamen etkileşimli olacağı (dnd, Redux) için asıl bileşen
// features/board altında "use client" olarak yaşayacak; bu dosya sadece bağlayacak.
export default async function BoardPage({
  params,
}: {
  params: Promise<{ projectId: string }>
}) {
  const { projectId } = await params
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800">Board</h1>
        <p className="mt-2 text-slate-500">
          Proje: <code className="rounded bg-slate-200 px-1">{projectId}</code> — yakında inşa edilecek.
        </p>
      </div>
    </main>
  )
}
