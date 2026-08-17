import React, { useEffect, useMemo, useRef, useState } from "react";
import axiosClient from "../Api/axiosClient";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LoadingState } from "./UI/States";
import { distanceMeters } from "../Helper/gtfsTime";
import { useAuth } from "../Hooks/useAuth";
import { useGetStudentProfileQuery, useSetFavoriteStopMutation } from "../Api/studentApi";
import { useLazyGetRoutePlanQuery } from "../Api/gtfsApi";
import ToastrNotify from "../Helper/ToastrNotify";
import "../styles/theme.css";

// Yurt ve kampüs kapısı, kampüs haritasında diğer duraklardan (kütüphane, fakülte, şehir
// merkezi gibi) görsel olarak ayrışsın diye ayrı ikon/renk alıyor.
const pinIcon = (emoji, color) =>
    L.divIcon({
        className: "",
        html: `<div style="background:${color};width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(43,36,56,0.35);border:2px solid #fff;">
                 <span style="transform:rotate(45deg);font-size:15px;line-height:1;">${emoji}</span>
               </div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
        popupAnchor: [0, -32],
    });

const userIcon = L.divIcon({
    className: "",
    html: `<div style="width:18px;height:18px;border-radius:50%;background:#2F6D4F;border:3px solid #fff;box-shadow:0 0 0 4px rgba(47,109,79,0.25);"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
});

const ICONS = {
    YURT: pinIcon("🏠", "#6E3F92"),
    KAMPUS: pinIcon("🎓", "#8A56AE"),
    DEFAULT: pinIcon("📍", "#5B6B7A"),
};

const FAVORITE_ICON = pinIcon("⭐", "#D9A441");

const DIRECTIONS = [
    { id: 0, label: "Gidiş", hint: "Yurt → Şehir Merkezi" },
    { id: 1, label: "Dönüş", hint: "Şehir Merkezi → Yurt" },
];

const formatDistance = (m) => (m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`);

const MapView = () => {
    const mapRef = useRef(null);
    const [stops, setStops] = useState([]);
    const [loadingStops, setLoadingStops] = useState(true);
    const [selectedStop, setSelectedStop] = useState(null);
    const [direction, setDirection] = useState(0);
    const [stopTimes, setStopTimes] = useState([]);
    const [loadingTimes, setLoadingTimes] = useState(false);

    // "En yakın durak" — kampüs içinde her noktadan kolay ulaşım vurgusu: öğrenci
    // konumunu paylaşırsa en yakın durağı otomatik bulup gösteriyoruz.
    const [userPos, setUserPos] = useState(null);
    const [nearestStop, setNearestStop] = useState(null);
    const [locating, setLocating] = useState(false);
    const [locateError, setLocateError] = useState('');

    // Favori durak — bkz. StudentService.SetFavoriteStop.
    const { userId } = useAuth();
    const { data: profileData } = useGetStudentProfileQuery(userId, { skip: !userId });
    const [setFavoriteStop, { isLoading: isSavingFavorite }] = useSetFavoriteStopMutation();
    const favoriteStopId = profileData?.result?.favoriteStopId;

    // Rota planlayıcı — bkz. GtfsService.GetRoutePlan.
    const [fromStopId, setFromStopId] = useState('');
    const [toStopId, setToStopId] = useState('');
    const [triggerPlan, { data: planData, isFetching: isPlanning, error: planError }] = useLazyGetRoutePlanQuery();

    const handleToggleFavorite = (stopId) => {
        const nextValue = favoriteStopId === stopId ? null : stopId;
        setFavoriteStop({ studentId: userId, stopId: nextValue })
            .unwrap()
            .then(() => ToastrNotify(nextValue ? 'Favori durak olarak ayarlandı.' : 'Favori durak kaldırıldı.', 'success'))
            .catch(() => ToastrNotify('Favori durak güncellenirken bir hata oluştu.', 'error'));
    };

    const handlePlanRoute = () => {
        if (!fromStopId || !toStopId) return;
        triggerPlan({ fromStopId, toStopId });
    };

    useEffect(() => {
        axiosClient.get("/Gtfs/stops")
            .then((res) => setStops(res.data.result || []))
            .finally(() => setLoadingStops(false));
    }, []);

    useEffect(() => {
        if (!selectedStop) return;
        setLoadingTimes(true);
        axiosClient
            .get(`/Gtfs/timetable?stopId=${selectedStop.stopId}&directionId=${direction}`)
            .then((res) => setStopTimes(res.data.result || []))
            .finally(() => setLoadingTimes(false));
    }, [selectedStop, direction]);

    const activeDirection = useMemo(() => DIRECTIONS.find((d) => d.id === direction), [direction]);

    const handleLocate = () => {
        if (!navigator.geolocation) {
            setLocateError('Tarayıcın konum özelliğini desteklemiyor.');
            return;
        }
        setLocating(true);
        setLocateError('');
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setUserPos([latitude, longitude]);

                if (stops.length) {
                    const nearest = stops
                        .map((s) => ({ ...s, dist: distanceMeters(latitude, longitude, s.stopLat, s.stopLon) }))
                        .sort((a, b) => a.dist - b.dist)[0];
                    setNearestStop(nearest);
                    mapRef.current?.flyTo([latitude, longitude], 16);
                }
                setLocating(false);
            },
            (err) => {
                setLocateError(err.code === 1 ? 'Konum izni reddedildi.' : 'Konum alınamadı, tekrar dener misin?');
                setLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    return (
        <div>
            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', fontSize: 'var(--text-sm)', color: 'var(--ink-soft)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ fontSize: 16 }}>🏠</span> Öğrenci Yurdu</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ fontSize: 16 }}>🎓</span> Üniversite Ana Kapısı</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ fontSize: 16 }}>📍</span> Diğer duraklar</span>
                </div>
                <button className="ax-btn ax-btn-primary" onClick={handleLocate} disabled={locating}>
                    {locating ? 'Konum bulunuyor…' : '📍 En Yakın Durağı Bul'}
                </button>
            </div>

            {locateError && <div className="ax-error" style={{ marginBottom: 'var(--space-3)' }}>{locateError}</div>}

            {nearestStop && (
                <div className="ax-card" style={{ marginBottom: 'var(--space-3)', background: 'var(--purple-tint)', border: '1px solid var(--purple)' }}>
                    <div className="ax-card-body" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 12, color: 'var(--purple-strong)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Sana en yakın durak</div>
                            <div style={{ fontSize: 'var(--text-lg)', fontFamily: 'var(--font-display)', marginTop: 2 }}>{nearestStop.stopName} · {formatDistance(nearestStop.dist)}</div>
                        </div>
                        <button className="ax-btn ax-btn-ghost" onClick={() => setSelectedStop(nearestStop)}>Sefer Saatlerini Gör</button>
                    </div>
                </div>
            )}

            <div className="ax-card" style={{ marginBottom: 'var(--space-3)' }}>
                <div className="ax-card-head"><h3>🧭 Rota Planlayıcı</h3></div>
                <div className="ax-card-body" style={{ paddingTop: 0 }}>
                    <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div className="ax-field" style={{ flex: 1, minWidth: 180 }}>
                            <label htmlFor="fromStop">Nereden</label>
                            <select id="fromStop" value={fromStopId} onChange={(e) => setFromStopId(e.target.value)}>
                                <option value="">Durak seçin…</option>
                                {stops.map((s) => (
                                    <option key={s.stopId} value={s.stopId}>{s.stopName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="ax-field" style={{ flex: 1, minWidth: 180 }}>
                            <label htmlFor="toStop">Nereye</label>
                            <select id="toStop" value={toStopId} onChange={(e) => setToStopId(e.target.value)}>
                                <option value="">Durak seçin…</option>
                                {stops.map((s) => (
                                    <option key={s.stopId} value={s.stopId}>{s.stopName}</option>
                                ))}
                            </select>
                        </div>
                        <button className="ax-btn ax-btn-primary" onClick={handlePlanRoute} disabled={!fromStopId || !toStopId || isPlanning}>
                            {isPlanning ? 'Aranıyor…' : 'Rotayı Bul'}
                        </button>
                    </div>

                    {planError && (
                        <div className="ax-error" style={{ marginTop: 'var(--space-3)' }}>
                            {planError?.data?.errorMessages?.[0] || 'Bu duraklar arasında bir güzergah bulunamadı.'}
                        </div>
                    )}

                    {planData?.result && (
                        <div style={{ marginTop: 'var(--space-3)', border: '1px solid var(--purple)', background: 'var(--purple-tint)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                            <div style={{ flex: 1, minWidth: 200 }}>
                                <div style={{ fontSize: 12, color: 'var(--purple-strong)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                    {planData.result.fromStopName} → {planData.result.toStopName}
                                </div>
                                <div style={{ fontSize: 'var(--text-lg)', fontFamily: 'var(--font-display)', marginTop: 2 }} className="tabular">
                                    {planData.result.departureTime.slice(0, 5)} kalkış · {planData.result.arrivalTime.slice(0, 5)} varış · {planData.result.durationMinutes} dk
                                </div>
                                <div style={{ fontSize: 12.5, color: 'var(--ink-faint)', marginTop: 2 }}>
                                    {planData.result.isNextDay
                                        ? 'Bugün için sefer kalmadı — bu, yarının ilk seferi.'
                                        : planData.result.waitMinutes <= 1
                                            ? 'Kalkışa az kaldı'
                                            : `Kalkışa ${planData.result.waitMinutes} dakika var`}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {loadingStops ? (
                <LoadingState text="Kampüs haritası yükleniyor…" />
            ) : (
                <MapContainer ref={mapRef} center={[39.929, 32.851]} zoom={15} style={{ height: 480, width: "100%", borderRadius: 'var(--radius-md)' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {stops.map((stop) => (
                        <Marker
                            key={stop.stopId}
                            position={[stop.stopLat, stop.stopLon]}
                            icon={stop.stopId === favoriteStopId ? FAVORITE_ICON : (ICONS[stop.stopId] || ICONS.DEFAULT)}
                            eventHandlers={{ click: () => setSelectedStop(stop) }}
                        >
                            <Popup>{stop.stopName}</Popup>
                        </Marker>
                    ))}
                    {userPos && (
                        <Marker position={userPos} icon={userIcon}>
                            <Popup>Buradasın</Popup>
                        </Marker>
                    )}
                </MapContainer>
            )}

            {selectedStop && (
                <div className="ax-card" style={{ marginTop: 'var(--space-5)' }}>
                    <div className="ax-card-head">
                        <h3>{selectedStop.stopName} — Dolmuş Saatleri</h3>
                        <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                            <button
                                className="ax-btn ax-btn-ghost"
                                onClick={() => handleToggleFavorite(selectedStop.stopId)}
                                disabled={isSavingFavorite || !userId}
                                title={favoriteStopId === selectedStop.stopId ? 'Favorilerden kaldır' : 'Favori durak yap'}
                            >
                                {favoriteStopId === selectedStop.stopId ? '⭐ Favori' : '☆ Favori Yap'}
                            </button>
                            {DIRECTIONS.map((d) => (
                                <button
                                    key={d.id}
                                    className="ax-btn ax-btn-ghost"
                                    style={direction === d.id ? { background: 'var(--purple-tint)', borderColor: 'var(--purple)', color: 'var(--purple-strong)' } : undefined}
                                    onClick={() => setDirection(d.id)}
                                >
                                    {d.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="ax-card-body ax-table-wrap">
                        <div style={{ fontSize: 12.5, color: 'var(--ink-faint)', marginBottom: 'var(--space-3)' }}>{activeDirection.hint}</div>
                        {loadingTimes ? (
                            <LoadingState text="Sefer bilgisi yükleniyor…" />
                        ) : stopTimes.length === 0 ? (
                            <div style={{ color: 'var(--ink-faint)', fontSize: 'var(--text-sm)' }}>Bu yönde bu durak için sefer bulunamadı.</div>
                        ) : (
                            <table className="ax-table">
                                <thead><tr><th>Sefer</th><th>Varış</th><th>Kalkış</th></tr></thead>
                                <tbody>
                                    {stopTimes.map((t, i) => (
                                        <tr key={i}>
                                            <td className="tabular">{t.tripId}</td>
                                            <td className="tabular">{t.arrivalTime}</td>
                                            <td className="tabular">{t.departureTime}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapView;
