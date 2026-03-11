import { redirect } from 'next/navigation';

export default function Home() {
  // Just direct index hit to dashboard
  redirect('/dashboard');
}
