import React from 'react';
import { useGetTimetableQuery } from '../../Api/gtfsApi';
import { findNextDeparture, minutesUntil } from '../../Helper/gtfsTime';

const Row = ({ label, hint, stopId, directionId }) => {
    const { data, isLoading } = useGetTimetableQuery({ stopId, directionId });
    const next = !isLoading ? findNextDeparture(data?.result) : null;
    const mins = next ? minutesUntil(next.departureTime) : null;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '10px 0', borderTop: '1px solid var(--line-soft)' }}>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{hint}</div>
            </div>
            {isLoading ? (
                <span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>…</span>
            ) : next ? (
                <div style={{ textAlign: 'right' }}>
                    <div className="tabular" style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-lg)' }}>{next.departureTime.slice(0, 5)}</div>
                    <div className="ax-chip ax-chip-purple tabular" style={{ marginTop: 2 }}>{mins <= 1 ? 'şimdi' : `${mins} dk sonra`}</div>
                </div>
            ) : (
                <span className="ax-chip ax-chip-slate">Bugün sefer kalmadı</span>
            )}
        </div>
    );
};

/**
 * Öğrenci panosundaki "Sıradaki Sefer" kartı — uygulamanın öne çıkan özelliği
 * (kampüs içi ring ile kolay ulaşım) panoda ilk bakışta görünsün diye.
 */
const NextDeparture = () => (
    <div className="ax-card">
        <div className="ax-card-head"><h3>🚐 Sıradaki Sefer — Yurt</h3></div>
        <div className="ax-card-body" style={{ paddingTop: 0 }}>
            <Row label="Yurttan kampüse" hint="Yurt durağından kalkış" stopId="YURT" directionId={0} />
            <Row label="Kampüsten yurda" hint="Üniversite Ana Kapısı durağından kalkış" stopId="KAMPUS" directionId={1} />
        </div>
    </div>
);

export default NextDeparture;
