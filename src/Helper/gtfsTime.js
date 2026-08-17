/**
 * Ring/dolmuş zaman çizelgesi ile ilgili küçük yardımcılar. Backend saatleri
 * "HH:mm:ss" string olarak dönüyor (bkz. GtfsService) — zaten sıfır dolgulu
 * olduğu için düz string karşılaştırması saat karşılaştırması için yeterli.
 */
export function nowAsHms(date = new Date()) {
    return date.toTimeString().slice(0, 8); // "HH:mm:ss"
}

/** Verilen sefer listesinden (StopTimeDTO[]), şu andan sonraki ilk kalkışı bulur. */
export function findNextDeparture(stopTimes, now = nowAsHms()) {
    if (!stopTimes || stopTimes.length === 0) return null;
    const sorted = [...stopTimes].sort((a, b) => a.departureTime.localeCompare(b.departureTime));
    return sorted.find((t) => t.departureTime >= now) || null;
}

/** "14:32:00" -> şu andan kaç dakika sonra olduğu (negatifse geçmiş). */
export function minutesUntil(hms, now = nowAsHms()) {
    const toSeconds = (s) => {
        const [h, m, sec] = s.split(':').map(Number);
        return h * 3600 + m * 60 + sec;
    };
    return Math.round((toSeconds(hms) - toSeconds(now)) / 60);
}

/** İki koordinat arası kuş uçuşu mesafe (metre) — Haversine formülü. */
export function distanceMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const toRad = (v) => (v * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
