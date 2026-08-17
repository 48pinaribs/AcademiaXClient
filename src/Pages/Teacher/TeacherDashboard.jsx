import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';
import { useGetTeacherCoursesQuery } from '../../Api/teacherApi';
import Kpi from '../../Components/UI/Kpi';
import { LoadingState, ErrorState, EmptyState } from '../../Components/UI/States';

const TeacherDashboard = () => {
    const { userId } = useAuth();
    const navigate = useNavigate();
    const { data, isLoading, error } = useGetTeacherCoursesQuery(userId, { skip: !userId });
    const courses = data?.result || [];

    const totalStudents = courses.reduce((sum, c) => sum + (c.totalStudents || 0), 0);

    return (
        <div>
            <div className="ax-page-top">
                <div><h1>Panelim</h1><div className="meta">Bu dönem verdiğiniz dersler</div></div>
            </div>

            {isLoading && <LoadingState />}
            {!isLoading && error && <ErrorState />}

            {!isLoading && !error && (
                <>
                    <div className="ax-kpi-row">
                        <Kpi label="Bu Dönem Ders" value={courses.length} />
                        <Kpi label="Toplam Öğrenci" value={totalStudents} />
                    </div>

                    <div className="ax-card">
                        <div className="ax-card-head"><h3>Derslerim</h3></div>
                        <div className="ax-card-body">
                            {courses.length === 0 ? (
                                <EmptyState icon="📚" title="Henüz atanmış dersiniz yok" />
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                    {courses.map((c) => (
                                        <div key={c.courseId} style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                                            <div>
                                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--purple-strong)', fontWeight: 700 }}>{c.code}</div>
                                                <div style={{ fontWeight: 600 }}>{c.name}</div>
                                                <div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{c.totalStudents} öğrenci</div>
                                            </div>
                                            <div style={{ flex: 1 }} />
                                            <button className="ax-btn ax-btn-ghost" onClick={() => navigate('/teacher/grades')}>Not Gir</button>
                                            <button className="ax-btn ax-btn-ghost" onClick={() => navigate('/teacher/attendance')}>Yoklama</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TeacherDashboard;
