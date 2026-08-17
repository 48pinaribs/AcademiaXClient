import React from 'react';

/**
 * Tasarımı onaylanmış ama backend'i henüz olmayan sayfalar için yer tutucu
 * (Not Girişi, Yoklama Al, Duyurular — bkz. proje notları: yazma uç noktaları eksik).
 */
const ComingSoon = ({ title, note }) => (
    <div>
        <div className="ax-page-top">
            <div><h1>{title}</h1></div>
        </div>
        <div className="ax-card">
            <div className="ax-empty">
                <div className="ic">🛠️</div>
                <div className="t">Bu sayfa yakında aktif olacak</div>
                <div className="s">{note || 'Bu özellik için backend API henüz hazır değil.'}</div>
            </div>
        </div>
    </div>
);

export default ComingSoon;
