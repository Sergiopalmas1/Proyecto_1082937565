import Link from 'next/link';

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5EFE0] px-4 py-20">
      <div className="max-w-xl w-full rounded-3xl border border-[#D4C7B0] bg-white p-8 text-center shadow-lg">
        <h1 className="text-3xl font-bold text-[#1F3A0D] mb-4">Algo salió mal</h1>
        <p className="text-gray-700 mb-6">Ha ocurrido un error inesperado. Intenta recargar la página o regresa al dashboard.</p>
        <pre className="text-left text-sm text-gray-500 bg-gray-50 p-4 rounded-lg overflow-auto mb-6">{error.message}</pre>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={() => reset()}
            className="px-5 py-3 rounded-lg bg-green-700 text-white font-medium hover:bg-green-800"
          >
            Reintentar
          </button>
          <Link
            href="/dashboard"
            className="px-5 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Volver al dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
