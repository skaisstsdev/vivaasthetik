'use client';

import { useTranslations } from 'next-intl';
import ScrollExpandMedia from './ScrollExpandMedia';

import ReactDOM from 'react-dom';

export default function VideoShowcase() {
  const t = useTranslations('VideoShowcase');

  // Inject preload link into the HTML <head> for instant loading on mobile
  ReactDOM.preload('/video1_desktop.mp4', { as: 'video' });
  ReactDOM.preload('/video1_mobile.mp4', { as: 'video' });

  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc="/video1_desktop.mp4"
      mobileMediaSrc="/video1_mobile.mp4"
      bgImageSrc="/stranica1.webp"
      title={t('title')}
    />
  );
}
