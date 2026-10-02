// src/components/LanguageSwitcher/LanguageModal.tsx
import LanguageModalList from './LanguageModalList';

type Props = {
    title: string;
};

export default function LanguageModal({ title }: Props) {
    return (
        <div className="text_center pd-20">
            <div className='mb-15'>
                <h2>{title}</h2>
            </div>
            <LanguageModalList />
        </div>
    );
}
