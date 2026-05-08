import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirige la raíz al login del proyecto
  redirect('/login');
}
