'use client';

import { Auth } from '@/components/auth';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();

  const handleAuthSuccess = () => {
    router.push('/');
  };

  return <Auth onAuthSuccess={handleAuthSuccess} />;
}
