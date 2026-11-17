// Выводит разметку schema.org (JSON-LD) на странице.
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // Содержимое формируется на сервере из наших данных; "<" экранируется, чтобы нельзя было закрыть тег
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
