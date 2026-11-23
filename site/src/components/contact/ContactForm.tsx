'use client';

import { FormEvent, useState } from 'react';
import { submitContact } from '@/app/actions/contact';
import { Link } from '@/i18n/routing';
import { btnDark } from '@/lib/ui';
import { track } from '@/lib/analytics';

type Labels = { title: string; name: string; email: string; message: string; submit: string };
type Status = 'idle' | 'sending' | 'success' | 'error';

const copy = {
  de: {
    consentPre: 'Ich habe die ',
    consentLink: 'Datenschutzerklärung',
    consentPost: ' gelesen und bin damit einverstanden, dass meine Angaben zur Beantwortung meiner Anfrage verwendet werden.',
    sending: 'Wird gesendet …',
    successTitle: 'Vielen Dank für Ihre Nachricht!',
    successText: 'Wir haben Ihre Anfrage erhalten und melden uns so bald wie möglich bei Ihnen.',
    again: 'Weitere Nachricht senden',
    errorText: 'Die Nachricht konnte leider nicht gesendet werden. Bitte versuchen Sie es erneut oder schreiben Sie uns direkt:',
    required: 'Pflichtfeld',
  },
  ru: {
    consentPre: 'Я прочитал(а) ',
    consentLink: 'политику конфиденциальности',
    consentPost: ' и согласен(на) с тем, что мои данные будут использованы для ответа на моё обращение.',
    sending: 'Отправляется …',
    successTitle: 'Спасибо за ваше сообщение!',
    successText: 'Мы получили ваше обращение и свяжемся с вами в ближайшее время.',
    again: 'Отправить ещё одно сообщение',
    errorText: 'К сожалению, сообщение не удалось отправить. Попробуйте ещё раз или напишите нам напрямую:',
    required: 'Обязательное поле',
  },
};

const field =
  'w-full bg-white border border-gray-200 text-gray-900 placeholder:text-gray-500 px-4 py-3 outline-none focus:border-gray-900 transition-colors';

export default function ContactForm({ loc, labels }: { loc: 'de' | 'ru'; labels: Labels }) {
  const c = copy[loc];
  const [status, setStatus] = useState<Status>('idle');

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;
    const form = e.currentTarget;
    const data = new FormData(form);

    setStatus('sending');
    try {
      const res = await submitContact({
        name: String(data.get('name') || ''),
        email: String(data.get('email') || ''),
        message: String(data.get('message') || ''),
        website: String(data.get('website') || ''), // скрытая ловушка для ботов, проверяется на сервере
        locale: loc,
      });
      if (!res.ok) throw new Error(res.reason);
      form.reset();
      track('contact_submitted');
      setStatus('success');
    } catch (error) {
      console.error('Contact form failed:', error);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="mt-8 p-8 bg-gray-50 border border-gray-100" role="status">
        <h2 className="text-2xl font-light text-gray-900 mb-4">{c.successTitle}</h2>
        <p className="text-gray-600 leading-relaxed mb-6">{c.successText}</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="text-xs md:text-sm uppercase tracking-[0.2em] font-medium text-gray-800 hover:text-[#8a6327] transition-colors"
        >
          {c.again}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 p-8 bg-gray-50 border border-gray-100">
      <h2 className="text-2xl font-light text-gray-900 mb-6">{labels.title}</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        <label className="flex flex-col gap-2">
          <span className="sr-only">{labels.name}</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder={labels.name}
            maxLength={120}
            className={field}
            required
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="sr-only">{labels.email}</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            placeholder={labels.email}
            maxLength={160}
            className={field}
            required
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="sr-only">{labels.message}</span>
          <textarea
            name="message"
            placeholder={labels.message}
            rows={5}
            minLength={10}
            maxLength={3000}
            className={`${field} resize-none`}
            required
          />
        </label>

        {/* Ловушка для ботов */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <label className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed cursor-pointer">
          <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 flex-shrink-0 accent-[#8a6327]" />
          <span>
            {c.consentPre}
            <Link href="/datenschutz" className="underline hover:text-gray-900" target="_blank">
              {c.consentLink}
            </Link>
            {c.consentPost}
          </span>
        </label>

        {status === 'error' && (
          <div role="alert" className="border-l-2 border-[#c9a84c] bg-[#faf6ea] p-4 text-sm text-gray-700 leading-relaxed">
            <p className="mb-2">{c.errorText}</p>
            <p>
              <a href="mailto:vivaasthetik@gmail.com" className="underline">vivaasthetik@gmail.com</a>
              {' · '}
              <a href="tel:+491799004902" className="underline">+49 179 9004902</a>
              {' · '}
              <a href="https://wa.me/491799004902" target="_blank" rel="noopener noreferrer" className="underline">WhatsApp</a>
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className={`${btnDark} w-full sm:w-auto sm:self-start disabled:opacity-60 disabled:cursor-wait`}
        >
          {status === 'sending' ? c.sending : labels.submit}
        </button>
      </form>
    </div>
  );
}
