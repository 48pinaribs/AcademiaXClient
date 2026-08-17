import React from 'react';

/**
 * Panolarda kullanılan özet kartı. delta.tone: 'up' | 'down' | 'flat'
 */
const Kpi = ({ label, value, delta, deltaTone = 'flat' }) => (
    <div className="ax-kpi">
        <div className="ax-kpi-label">{label}</div>
        <div className="ax-kpi-value tabular">{value}</div>
        {delta && <div className={`ax-kpi-delta ${deltaTone}`}>{delta}</div>}
    </div>
);

export default Kpi;
