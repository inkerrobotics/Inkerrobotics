import type { ImgHTMLAttributes } from 'react';

/**
 * An <img> that prefers the WebP twin sitting next to the original.
 *
 * Every JPG/PNG under public/ has a same-named .webp beside it (95 MB of
 * originals → 6.7 MB of derivatives). This emits a <picture> so the
 * browser takes the WebP when it can and falls back to the untouched
 * original when it can't — nothing is deleted, and anything that only
 * understands JPEG still gets a JPEG.
 *
 * `picture { display: contents }` in inker.css keeps the wrapper out of
 * the layout entirely, so existing CSS that targets the <img> directly
 * (object-fit, sizing, the WebGL layer's querySelector) is unaffected.
 */
export default function AutoImg({
  src = '',
  alt = '',
  loading = 'lazy',
  decoding = 'async',
  ...rest
}: ImgHTMLAttributes<HTMLImageElement>) {
  const webp = typeof src === 'string' ? src.replace(/\.(jpe?g|png)$/i, '.webp') : src;
  const hasTwin = webp !== src;

  return (
    <picture>
      {hasTwin && <source srcSet={webp} type="image/webp" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading={loading} decoding={decoding} {...rest} />
    </picture>
  );
}
