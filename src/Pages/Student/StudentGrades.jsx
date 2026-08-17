import React, { useMemo } from 'react';
import { useAuth } from '../../Hooks/useAuth';
import { useGetStudentGradesQuery } from '../../Api/studentApi';
import { LoadingState, ErrorState, EmptyState } from '../../Components/UI/States';

const EMPTY = [];

const gradeTone = (value) => {
    if (value >= 85) return 'ax-chip-sage';
    if (value >= 60) return 'ax-chip-gold';
    return 'ax-chip-brick';
};

const StudentGrades = () => {
    const { userId } = useAuth();
    const { data, isLoading, error } = useGetStudentGradesQuery(userId, { skip: !userId });
    const grades = data?.result || EMPTY;

    const average = useMemo(() => {
        if (!grades.length) return null;
        const sum = grades.reduce((s, g) => s + (g.grade || 0), 0);
        return (sum / grades.length).toFixed(1);
    }, [grades]);

    return (
        <div>
            <div className="ax-page-top">
                <div><h1>Notlarım</h1></div>
            </div>

            {isLoading && <LoadingState />}
            {!isLoading && error && <ErrorState />}

            {!isLoading && !error && (
                <>
                    {average !== null && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 'var(--space-6)',
                            background: 'linear-gradient(135deg, var(--purple-strong), var(--purple))',
                            color: '#fff', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', marginBottom: 'var(--space-5)',
                        }}>
                            <div>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: 46, lineHeight: 1 }} className="tabular">{average}</div>
                                <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.75)', marginTop: 8 }}>Ortalama not</div>
                            </div>
                            <div>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)' }} className="tabular">{grades.length}</div>
                                <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.75)', marginTop: 3 }}>Not girilen değerlendirme</div>
                            </div>
                        </div>
                    )}

                    <div className="ax-card">
                        <div className="ax-card-body ax-table-wrap">
                            {grades.length === 0 ? (
                                <EmptyState icon="📝" title="Henüz not girilmemiş" subtitle="Öğretmenin not girdiğinde burada görünecek." />
                            ) : (
                                <table className="ax-table">
                                    <thead><tr><th>Ders</th><th>Not</th></tr></thead>
                                    <tbody>
                                        {grades.map((g, i) => (
                                            <tr key={i}>
                                                <td>{g.course}</td>
                                                <td><span className={`ax-chip ${gradeTone(g.grade)} tabular`}>{g.grade}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default StudentGrades;
