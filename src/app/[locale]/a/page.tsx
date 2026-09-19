import type { Metadata } from 'next';

// Страница-заглушка: не индексируем, пока нет контента
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function Page() {
  return <h1>Hello Next.js 1</h1>
}
