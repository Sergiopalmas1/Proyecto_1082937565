import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5EFE0] px-4 py-20">
      <div className="max-w-xl w-full rounded-3xl border border-[#D4C7B0] bg-white p-8 text-center shadow-lg">
        <h1 className="text-4xl font-bold text-[#1F3A0D] mb-4">404</h1>
        <p className="text-gray-700 mb-6">No se encontró la página que estás buscando.</p>
        <Link
          href="/dashboard"
          className="inline-flex px-5 py-3 rounded-lg bg-green-700 text-white font-medium hover:bg-green-800"
        >
          Volver al dashboard
        </Link>
      </div>
    </div>
  );
}
