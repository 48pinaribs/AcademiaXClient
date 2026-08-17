import React from 'react';

/**
 * Liste/tablo sayfalarında tekrarlayan yükleniyor / hata / boş durumları için
 * ortak, tutarlı bileşenler. Önceden her sayfa kendi "Yükleniyor..." metnini yazıyordu.
 */
export const LoadingState = ({ text = 'Yükleniyor…' }) => (
    <div className="ax-loading">{text}</div>
);

export const ErrorState = ({ text = 'Veriler alınamadı. Lütfen daha sonra tekrar deneyin.' }) => (
    <div className="ax-error">{text}</div>
);

export const EmptyState = ({ icon = '—', title, subtitle }) => (
    <div className="ax-empty">
        <div className="ic">{icon}</div>
        <div className="t">{title}</div>
        {subtitle && <div className="s">{subtitle}</div>}
    </div>
);
