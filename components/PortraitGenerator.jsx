"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const BASE_QUERY = [
  'mujer joven',
  'cabello corto casta?o rojizo',
  'mirada expresiva',
  'rasgos delicados',
  'camiseta blanca con mangas',
  'golden hour',
  'luz c?lida',
  'parque urbano',
  '?rboles difuminados',
  'fotogr?fico',
  'hiperrealista',
  'enfoque suave',
  'moderna, elegante, ligera rebeld?a',
  'segura, creativa, sofisticada'
];

function buildUnsplashSourceUrl(seed) {
  const size = '1200x1500'; // 4:5 retrato
  const query = encodeURIComponent(BASE_QUERY.join(', '));
  // source.unsplash.com redirige a images.unsplash.com; el par?metro aleatorio evita cach?
  return `https://source.unsplash.com/featured/${size}?${query}&sig=${seed}`;
}

export default function PortraitGenerator() {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const [imgUrl, setImgUrl] = useState(() => buildUnsplashSourceUrl(Math.floor(Math.random() * 1e9)));
  const [loading, setLoading] = useState(true);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const onRegenerate = useCallback(() => {
    const nextSeed = Math.floor(Math.random() * 1e9);
    setSeed(nextSeed);
    setLoading(true);
    setImgUrl(buildUnsplashSourceUrl(nextSeed));
  }, []);

  const warmInfo = useMemo(() => ({
    warmth: 0.12,
    vignette: 0.55,
    softness: 0.08,
  }), []);

  const onImageLoad = useCallback(() => {
    setLoading(false);
  }, []);

  const onDownload = useCallback(async () => {
    const imgEl = imgRef.current;
    if (!imgEl) return;

    // Crear canvas y dibujar con una gradaci?n c?lida + vi?eteado
    const canvas = canvasRef.current || document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const width = imgEl.naturalWidth || 1200;
    const height = imgEl.naturalHeight || 1500;

    canvas.width = width;
    canvas.height = height;

    // Para permitir dibujo seguro, configuramos CORS an?nimo
    const proxyImg = new Image();
    proxyImg.crossOrigin = 'anonymous';
    proxyImg.src = imgEl.currentSrc || imgEl.src;

    await new Promise((resolve, reject) => {
      proxyImg.onload = resolve;
      proxyImg.onerror = reject;
    });

    // Fondo y base
    ctx.fillStyle = '#0f1115';
    ctx.fillRect(0, 0, width, height);

    // Suavidad ligera
    ctx.filter = `saturate(1.05) contrast(1.02) blur(${warmInfo.softness * 2}px)`;
    ctx.drawImage(proxyImg, 0, 0, width, height);

    // Capa c?lida con soft-light
    ctx.save();
    ctx.globalCompositeOperation = 'soft-light';
    const gradWarm = ctx.createLinearGradient(0, 0, 0, height);
    gradWarm.addColorStop(0, `rgba(255, 185, 120, ${warmInfo.warmth})`);
    gradWarm.addColorStop(0.6, 'rgba(255, 185, 120, 0.05)');
    gradWarm.addColorStop(1, 'rgba(255, 185, 120, 0.00)');
    ctx.fillStyle = gradWarm;
    ctx.fillRect(0, 0, width, height);

    // Radial highlight desde arriba
    const gradRad = ctx.createRadialGradient(width * 0.5, height * -0.1, 0, width * 0.5, height * -0.1, width * 0.9);
    gradRad.addColorStop(0, 'rgba(255, 200, 140, 0.28)');
    gradRad.addColorStop(0.45, 'rgba(255, 200, 140, 0.12)');
    gradRad.addColorStop(1, 'rgba(255, 200, 140, 0.00)');
    ctx.fillStyle = gradRad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    // Vi?eteado
    ctx.save();
    const vignette = ctx.createRadialGradient(width/2, height/2, Math.min(width, height) * 0.35, width/2, height/2, Math.max(width, height) * 0.75);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, `rgba(0,0,0,${warmInfo.vignette})`);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `retrato_golden_hour_${seed}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }, [seed, warmInfo]);

  // Preload inicial
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imgUrl;
  }, [imgUrl]);

  return (
    <section className="grid">
      <div className="card">
        <div className="frame">
          <img
            ref={imgRef}
            className="img"
            src={imgUrl}
            crossOrigin="anonymous"
            alt="Retrato hiperrealista de mujer joven moderna y elegante en golden hour"
            onLoad={onImageLoad}
          />
          <div className="overlayWarm" />
          <div className="overlayVignette" />
          {loading && (
            <div className="loader">
              <div className="badge">
                <span>Preparando luz dorada?</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="meta">
        <div className="card" style={{ display: 'grid', gap: 12 }}>
          <div className="kicker">Direcci?n art?stica</div>
          <div>
            <div className="label">Estilo</div>
            <div className="value">Fotogr?fico, hiperrealista, enfoque suave, c?lido y contempor?neo</div>
          </div>
          <div>
            <div className="label">Ambientaci?n</div>
            <div className="value">Golden hour al aire libre, parque urbano, ?rboles difuminados</div>
          </div>
          <div>
            <div className="label">Look & personalidad</div>
            <div className="value">Moderna y elegante; segura, creativa y sofisticada con toque rebelde</div>
          </div>
        </div>

        <div className="card" style={{ display: 'grid', gap: 12 }}>
          <div className="kicker">Controles</div>
          <div className="controls">
            <button className="button buttonPrimary" onClick={onRegenerate}>
              Regenerar imagen
            </button>
            <button className="button" onClick={onDownload}>
              Descargar JPG (toque c?lido)
            </button>
          </div>
          <div className="small">Las im?genes se obtienen din?micamente y se afinan con un acabado c?lido y vi?eteado suave para intensificar la golden hour.</div>
        </div>
      </div>

      {/* Canvas offscreen para exportaci?n */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </section>
  );
}
