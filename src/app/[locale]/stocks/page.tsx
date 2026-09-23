import type { Metadata } from 'next';

// Раздел «Акции» в разработке — пока просто заглушка с сообщением по центру,
// оформленная как обычная страница сайта (не голый <h1>, как была /a).
export const metadata: Metadata = {
    robots: { index: false, follow: false },
};

export default function StocksPage() {
    return (
        <main>
            <section>
                <div className="container h-full grid place-center text_center">
                    <div>
                        <p className="color-5-100 text-uppercase font-w-500 letter-s-8 mb-7">Акции</p>
                        <h1 className="color-2-90">В разработке</h1>
                    </div>
                </div>
            </section>
        </main>
    );
}
