import { notFound } from 'next/navigation';

// Любой неизвестный путь внутри локали рендерит локализованный not-found.tsx
export default function CatchAll() {
    notFound();
}
