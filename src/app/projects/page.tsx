import Link from 'next/link';

const mockProjects = [
  { id: '1', name: 'Web Sitesi Yenileme', description: 'Kurumsal sitenin yeniden tasarımı' },
  { id: '2', name: 'Mobil Uygulama', description: 'iOS ve Android için görev takip uygulaması' },
];

export default function ProjectsPage() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Projelerim</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
          + Yeni Proje
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mockProjects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="block p-5 bg-white rounded-lg shadow border border-gray-100 hover:shadow-md transition"
          >
            <h2 className="font-semibold text-slate-800">{project.name}</h2>
            <p className="text-sm text-slate-500 mt-1">{project.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
