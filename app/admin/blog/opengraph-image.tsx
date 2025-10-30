import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Vrachka Admin - Blog Management';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          position: 'relative',
        }}
      >
        <img
          src={`https://vrachka.eu/og-image-admin-blog.png`}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
