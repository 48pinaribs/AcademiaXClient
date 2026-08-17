import React, { useEffect, useMemo, useState } from 'react';
import {
    useGetStopsQuery,
    useGetTripsQuery,
    useGetAllStopTimesQuery,
    useUpsertStopMutation,
    useDeleteStopMutation,
    useRegenerateScheduleMutation,
    useDeleteTripMutation,
} from '../../Api/gtfsApi';
import ToastrNotify from '../../Helper/ToastrNotify';
import { LoadingState, ErrorState, EmptyState } from '../../Components/UI/States';
import '../../styles/theme.css';

const emptyForm = { stopId: '', stopName: '', stopLat: '', stopLon: '' };

// Hem ApiResponse tarzı ({errorMessages:[...]}) hem de ASP.NET model-validation tarzı
// ({errors:{Field:["..."]}}) hata gövdelerinden ilk anlamlı mesajı çıkarır.
const firstErrorMessage = (err, fallback) => {
    const data = err?.data;
    if (data?.errorMessages?.length) return data.errorMessages[0];
    const fieldErrors = data?.errors && Object.values(data.errors)[0];
    if (fieldErrors?.length) return fieldErrors[0];
    return fallback;
};

// Kampüs ring'i (durak/güzergah/sefer zamanlaması) yönetimi — bkz. GtfsController'daki
// [Authorize(Roles="Administrator")] uçları. Sadece admin görür (navConfig.js).
const AdminTransportPage = () => {
    const { data: stopsData, isLoading: stopsLoading, error: stopsError } = useGetStopsQuery();
    const { data: tripsData, isLoading: tripsLoading } = useGetTripsQuery();
    const { data: stopTimesData, isLoading: stopTimesLoading } = useGetAllStopTimesQuery();

    const stops = stopsData?.result || [];
    const trips = tripsData?.result || [];
    const stopTimes = stopTimesData?.result || [];

    const [upsertStop, { isLoading: isSavingStop }] = useUpsertStopMutation();
    const [deleteStop] = useDeleteStopMutation();
    const [regenerateSchedule, { isLoading: isRegenerating }] = useRegenerateScheduleMutation();
    const [deleteTrip] = useDeleteTripMutation();

    // --- Güzergah sırası: mevcut zamanlamadan (direction 0) çıkarılır, admin yeniden sıralayabilir ---
    const [routeOrder, setRouteOrder] = useState([]);
    const [initializedOrder, setInitializedOrder] = useState(false);
    const [scheduleParams, setScheduleParams] = useState({ startHour: 7, endHour: 21, intervalMinutes: 60, minutesBetweenStops: 6, dwellMinutes: 2 });

    useEffect(() => {
        // trips/stopTimes ayrı sorgular — stops yüklenip trips/stopTimes henüz yüklenmeden
        // bu efekt çalışırsa boş sonuç bulup sıralamayı yanlışlıkla kilitliyordu (durak
        // listesindeki rastgele sıraya düşüyordu). İkisi de yüklenene kadar bekle.
        if (initializedOrder || stops.length === 0 || tripsLoading || stopTimesLoading) return;
        const directionZeroTrip = trips.find((t) => t.directionId === 0);
        const order = directionZeroTrip
            ? stopTimes
                .filter((st) => st.tripId === directionZeroTrip.tripId)
                .sort((a, b) => a.stopSequence - b.stopSequence)
                .map((st) => st.stopId)
            : [];
        setRouteOrder(order.length > 0 ? order : stops.map((s) => s.stopId));
        setInitializedOrder(true);
    }, [stops, trips, stopTimes, initializedOrder, tripsLoading, stopTimesLoading]);

    // Yeni eklenen duraklar listenin sonuna eklenir, silinenler otomatik çıkar.
    useEffect(() => {
        if (!initializedOrder) return;
        setRouteOrder((order) => {
            const stopIds = stops.map((s) => s.stopId);
            const kept = order.filter((id) => stopIds.includes(id));
            const added = stopIds.filter((id) => !kept.includes(id));
            return added.length || kept.length !== order.length ? [...kept, ...added] : order;
        });
    }, [stops, initializedOrder]);

    const moveStop = (index, dir) => {
        setRouteOrder((order) => {
            const target = index + dir;
            if (target < 0 || target >= order.length) return order;
            const next = [...order];
            [next[index], next[target]] = [next[target], next[index]];
            return next;
        });
    };

    const stopName = (id) => stops.find((s) => s.stopId === id)?.stopName || id;

    // --- Durak formu (ekle/düzenle) ---
    const [form, setForm] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    const startAdd = () => { setForm(emptyForm); setEditingId(null); };
    const startEdit = (stop) => { setForm({ stopId: stop.stopId, stopName: stop.stopName, stopLat: stop.stopLat, stopLon: stop.stopLon }); setEditingId(stop.stopId); };
    const handleFormChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSaveStop = async (e) => {
        e.preventDefault();
        try {
            await upsertStop({
                stopId: form.stopId.trim(),
                stopName: form.stopName.trim(),
                stopLat: parseFloat(form.stopLat),
                stopLon: parseFloat(form.stopLon),
            }).unwrap();
            ToastrNotify(editingId ? 'Durak güncellendi.' : 'Durak eklendi.', 'success');
            startAdd();
        } catch (err) {
            ToastrNotify(firstErrorMessage(err, 'Durak kaydedilirken bir hata oluştu.'), 'error');
        }
    };

    const handleDeleteStop = async (stopId) => {
        try {
            await deleteStop(stopId).unwrap();
            ToastrNotify('Durak silindi.', 'success');
        } catch (err) {
            ToastrNotify(firstErrorMessage(err, 'Durak silinirken bir hata oluştu.'), 'error');
        }
    };

    // --- Zamanlamayı yeniden oluştur ---
    const handleRegenerate = async () => {
        if (routeOrder.length < 2) {
            ToastrNotify('Güzergahta en az 2 durak olmalı.', 'error');
            return;
        }
        try {
            const res = await regenerateSchedule({
                stopIdsInOrder: routeOrder,
                startHour: Number(scheduleParams.startHour),
                endHour: Number(scheduleParams.endHour),
                intervalMinutes: Number(scheduleParams.intervalMinutes),
                minutesBetweenStops: Number(scheduleParams.minutesBetweenStops),
                dwellMinutes: Number(scheduleParams.dwellMinutes),
            }).unwrap();
            ToastrNotify(res.result || 'Zamanlama yeniden oluşturuldu.', 'success');
        } catch (err) {
            ToastrNotify(firstErrorMessage(err, 'Zamanlama oluşturulurken bir hata oluştu.'), 'error');
        }
    };

    // --- Seferler ---
    const handleDeleteTrip = async (tripId) => {
        try {
            await deleteTrip(tripId).unwrap();
            ToastrNotify('Sefer iptal edildi.', 'success');
        } catch (err) {
            ToastrNotify(firstErrorMessage(err, 'Sefer iptal edilirken bir hata oluştu.'), 'error');
        }
    };

    const tripsByDirection = useMemo(() => {
        const groups = { 0: [], 1: [] };
        trips.forEach((t) => { (groups[t.directionId] ??= []).push(t); });
        Object.values(groups).forEach((list) => list.sort((a, b) => a.tripId.localeCompare(b.tripId)));
        return groups;
    }, [trips]);

    const firstDepartureOf = (tripId) => {
        const times = stopTimes.filter((st) => st.tripId === tripId).sort((a, b) => a.stopSequence - b.stopSequence);
        return times[0]?.departureTime?.slice(0, 5) || '—';
    };

    if (stopsLoading) return <LoadingState text="Ring verisi yükleniyor…" />;
    if (stopsError) return <ErrorState text="Ring verisi alınamadı." />;

    return (
        <div>
            <div className="ax-page-top">
                <div><h1>Kampüs Ring Yönetimi</h1><div className="meta">Durak, güzergah ve sefer zamanlaması</div></div>
            </div>

            <div className="ax-card" style={{ marginBottom: 'var(--space-5)' }}>
                <div className="ax-card-head"><h3>Duraklar</h3></div>
                <div className="ax-card-body">
                    <form onSubmit={handleSaveStop} style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: 'var(--space-4)' }}>
                        <div className="ax-field" style={{ minWidth: 140 }}>
                            <label htmlFor="stopId">Durak ID</label>
                            <input id="stopId" name="stopId" value={form.stopId} onChange={handleFormChange} disabled={!!editingId} required />
                        </div>
                        <div className="ax-field" style={{ flex: 1, minWidth: 180 }}>
                            <label htmlFor="stopName">Durak Adı</label>
                            <input id="stopName" name="stopName" value={form.stopName} onChange={handleFormChange} required />
                        </div>
                        <div className="ax-field" style={{ minWidth: 110 }}>
                            <label htmlFor="stopLat">Enlem</label>
                            <input id="stopLat" name="stopLat" type="number" step="any" value={form.stopLat} onChange={handleFormChange} required />
                        </div>
                        <div className="ax-field" style={{ minWidth: 110 }}>
                            <label htmlFor="stopLon">Boylam</label>
                            <input id="stopLon" name="stopLon" type="number" step="any" value={form.stopLon} onChange={handleFormChange} required />
                        </div>
                        <button type="submit" className="ax-btn ax-btn-primary" disabled={isSavingStop}>
                            {isSavingStop ? 'Kaydediliyor…' : editingId ? 'Güncelle' : '+ Durak Ekle'}
                        </button>
                        {editingId && <button type="button" className="ax-btn ax-btn-ghost" onClick={startAdd}>Vazgeç</button>}
                    </form>

                    {stops.length === 0 ? (
                        <EmptyState icon="🚏" title="Henüz durak yok" />
                    ) : (
                        <div className="ax-table-wrap">
                            <table className="ax-table">
                                <thead><tr><th>ID</th><th>Ad</th><th>Enlem</th><th>Boylam</th><th></th></tr></thead>
                                <tbody>
                                    {stops.map((s) => (
                                        <tr key={s.stopId}>
                                            <td className="tabular">{s.stopId}</td>
                                            <td>{s.stopName}</td>
                                            <td className="tabular">{s.stopLat}</td>
                                            <td className="tabular">{s.stopLon}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', gap: 6 }}>
                                                    <button className="ax-btn ax-btn-ghost" onClick={() => startEdit(s)}>Düzenle</button>
                                                    <button className="ax-btn ax-btn-ghost" onClick={() => handleDeleteStop(s.stopId)}>Sil</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <div className="ax-card" style={{ marginBottom: 'var(--space-5)' }}>
                <div className="ax-card-head"><h3>Güzergah ve Zamanlama</h3></div>
                <div className="ax-card-body">
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-faint)', marginBottom: 'var(--space-3)' }}>
                        Gidiş yönü durak sırası (dönüş otomatik olarak tersidir). Zamanlamayı yeniden oluşturmak
                        var olan tüm seferlerin yerine geçer.
                    </div>

                    {routeOrder.length === 0 ? (
                        <EmptyState icon="🗺️" title="Önce durak ekleyin" />
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 'var(--space-4)' }}>
                            {routeOrder.map((stopId, i) => (
                                <div key={stopId} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', padding: '8px 12px' }}>
                                    <span className="tabular" style={{ fontWeight: 700, color: 'var(--purple-strong)', width: 20 }}>{i + 1}</span>
                                    <span style={{ flex: 1 }}>{stopName(stopId)}</span>
                                    <button className="ax-btn ax-btn-ghost" onClick={() => moveStop(i, -1)} disabled={i === 0} title="Yukarı taşı">↑</button>
                                    <button className="ax-btn ax-btn-ghost" onClick={() => moveStop(i, 1)} disabled={i === routeOrder.length - 1} title="Aşağı taşı">↓</button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                        <div className="ax-field" style={{ minWidth: 110 }}>
                            <label htmlFor="startHour">Başlangıç Saati</label>
                            <input id="startHour" type="number" min={0} max={23} value={scheduleParams.startHour} onChange={(e) => setScheduleParams((p) => ({ ...p, startHour: e.target.value }))} />
                        </div>
                        <div className="ax-field" style={{ minWidth: 110 }}>
                            <label htmlFor="endHour">Bitiş Saati</label>
                            <input id="endHour" type="number" min={0} max={23} value={scheduleParams.endHour} onChange={(e) => setScheduleParams((p) => ({ ...p, endHour: e.target.value }))} />
                        </div>
                        <div className="ax-field" style={{ minWidth: 130 }}>
                            <label htmlFor="intervalMinutes">Sefer Aralığı (dk)</label>
                            <input id="intervalMinutes" type="number" min={1} value={scheduleParams.intervalMinutes} onChange={(e) => setScheduleParams((p) => ({ ...p, intervalMinutes: e.target.value }))} />
                        </div>
                        <div className="ax-field" style={{ minWidth: 150 }}>
                            <label htmlFor="minutesBetweenStops">Duraklar Arası (dk)</label>
                            <input id="minutesBetweenStops" type="number" min={1} value={scheduleParams.minutesBetweenStops} onChange={(e) => setScheduleParams((p) => ({ ...p, minutesBetweenStops: e.target.value }))} />
                        </div>
                        <div className="ax-field" style={{ minWidth: 130 }}>
                            <label htmlFor="dwellMinutes">Durakta Bekleme (dk)</label>
                            <input id="dwellMinutes" type="number" min={0} value={scheduleParams.dwellMinutes} onChange={(e) => setScheduleParams((p) => ({ ...p, dwellMinutes: e.target.value }))} />
                        </div>
                    </div>

                    <div style={{ marginTop: 'var(--space-4)', textAlign: 'right' }}>
                        <button className="ax-btn ax-btn-primary" onClick={handleRegenerate} disabled={isRegenerating || routeOrder.length < 2}>
                            {isRegenerating ? 'Oluşturuluyor…' : 'Zamanlamayı Yeniden Oluştur'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="ax-card">
                <div className="ax-card-head"><h3>Seferler</h3></div>
                <div className="ax-card-body">
                    {tripsLoading ? (
                        <LoadingState text="Seferler yükleniyor…" />
                    ) : trips.length === 0 ? (
                        <EmptyState icon="🚐" title="Henüz sefer tanımlı değil" subtitle="Yukarıdan zamanlamayı oluşturun." />
                    ) : (
                        <div style={{ display: 'flex', gap: 'var(--space-5)', flexWrap: 'wrap' }}>
                            {[0, 1].map((dir) => (
                                <div key={dir} style={{ flex: 1, minWidth: 260 }}>
                                    <div style={{ fontWeight: 700, marginBottom: 8 }}>{dir === 0 ? 'Gidiş' : 'Dönüş'} ({tripsByDirection[dir]?.length || 0})</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 320, overflowY: 'auto' }}>
                                        {(tripsByDirection[dir] || []).map((t) => (
                                            <div key={t.tripId} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-sm)', padding: '4px 0', borderBottom: '1px solid var(--line-soft)' }}>
                                                <span className="tabular" style={{ flex: 1 }}>{firstDepartureOf(t.tripId)} kalkış</span>
                                                <button className="ax-btn ax-btn-ghost" onClick={() => handleDeleteTrip(t.tripId)} style={{ padding: '2px 8px', fontSize: 12 }}>İptal Et</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminTransportPage;
