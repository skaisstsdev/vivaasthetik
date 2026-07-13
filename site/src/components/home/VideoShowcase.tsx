'use client';

import { useTranslations } from 'next-intl';
import ScrollExpandMedia from './ScrollExpandMedia';

export default function VideoShowcase() {
  const t = useTranslations('VideoShowcase');

  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc="/video1.mov"
      bgImageSrc="/stranica1.jpg"
      title={t('title')}
    />
  );
}
