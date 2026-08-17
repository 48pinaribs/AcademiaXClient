import React, { useMemo } from 'react';
import { useAuth } from '../../Hooks/useAuth';
import { useGetStudentAttendanceQuery } from '../../Api/studentApi';
import { LoadingState, ErrorState, EmptyState } from '../../Components/UI/States';

const EMPTY = [];

const StudentAttendance = () => {
    const { userId } = useAuth();
    const { data, isLoading, error } = useGetStudentAttendanceQuery(userId, { skip: !userId });
    const records = data?.result || EMPTY;

    const byCourse = useMemo(() => {
        const map = {};
        records.forEach((r) => {
            if (!map[r.course]) map[r.course] = { total: 0, present: 0 };
            map[r.course].total += 1;
            if (r.isPresent) map[r.course].present += 1;
        });
        return Object.entries(map)
            .map(([course, v]) => ({ course, pct: Math.round((v.present / v.total) * 100), ...v }))
            .sort((a, b) => a.pct - b.pct);
    }, [records]);

    const overallPct = useMemo(() => {
        if (!records.length) return null;
        const present = records.filter((r) => r.isPresent).length;
        return Math.round((present / records.length) * 100);
    }, [records]);

    return (
        <div>
            <div className="ax-page-top">
                <div><h1>Yoklamam</h1><div className="meta">{overallPct !== null ? `Genel devam oranı: %${overallPct}` : ''}</div></div>
            </div>

            {isLoading && <LoadingState />}
            {!isLoading && error && <ErrorState />}

            {!isLoading && !error && (
                <div className="ax-card">
                    <div className="ax-card-head"><h3>Derse göre devam oranı</h3></div>
                    <div className="ax-card-body">
                        {byCourse.length === 0 ? (
                            <EmptyState icon="🗓️" title="Henüz yoklama kaydı yok" />
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                {byCourse.map((c) => (
                                    <div key={c.course} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                                        <span style={{ width: 200, flex: 'none', fontSize: 'var(--text-sm)' }}>{c.course}</span>
                                        <div className="ax-fill-track" style={{ width: 'auto', flex: 1, height: 8 }}>
                                            <div className={`ax-fill-bar${c.pct < 70 ? ' hot' : ''}`} style={{ width: `${c.pct}%` }} />
                                        </div>
                                        <span className="tabular" style={{ width: 44, textAlign: 'right', fontSize: 12, color: 'var(--ink-soft)' }}>%{c.pct}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentAttendance;
