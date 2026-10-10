// Разметка schema.org. `<` экранируем, чтобы данные не могли закрыть тег <script>
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
    return (
        <script
            type="application/ld+json"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD вставляется только так; данные свои, `<` экранирован
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
        />
    );
}
