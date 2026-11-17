import BookNowButton from '@/components/booking/BookNowButton';
import { btnDark, btnOutlineDark } from '@/lib/ui';

// Светлый блок записи в конце страницы: запись онлайн или сообщение в WhatsApp.
export default function BookingBand({
  loc,
  serviceSlug,
  hideBooking = false,
}: {
  loc: 'de' | 'ru';
  serviceSlug?: string;
  hideBooking?: boolean;
}) {
  return (
    <section aria-labelledby="book-title" className="bg-gray-50 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-20 md:py-24 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-20">
        <div>
          <h2 id="book-title" className="text-3xl md:text-4xl text-gray-900 leading-tight mb-5">
            {loc === 'de' ? 'Möchten Sie einen Termin in Kassel vereinbaren?' : 'Хотите записаться на приём в Касселе?'}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
            {loc === 'de'
              ? 'Wählen Sie online einen passenden Termin oder schreiben Sie uns bei WhatsApp – wir antworten persönlich.'
              : 'Выберите удобное время онлайн или напишите нам в WhatsApp — мы ответим лично.'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
          {!hideBooking && (
            <BookNowButton serviceSlug={serviceSlug} className={`${btnDark} w-full sm:w-auto`}>
              {loc === 'de' ? 'Termin buchen' : 'Записаться'}
            </BookNowButton>
          )}
          <a
            href="https://wa.me/491799004902"
            target="_blank"
            rel="noopener noreferrer"
            className={`${btnOutlineDark} w-full sm:w-auto`}
          >
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
