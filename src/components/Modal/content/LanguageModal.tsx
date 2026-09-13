// app/src/components/Modal/content/LanguageModal.tsx
import LanguageModalList from './LanguageModalList';

type Props = {
    title: string;
};

export default function LanguageModal({ title }: Props) {
    return (
        <main className="text_center pd-20">
            <header className='mb-15'>
                <h2>{title}</h2>
            </header>
            <LanguageModalList />
        </main>
    );
}