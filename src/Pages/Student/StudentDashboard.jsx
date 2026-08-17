import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';
import { useGetEnrolledCoursesQuery } from '../../Api/courseApi';
import { useGetStudentAttendanceQuery, useGetStudentGradesQuery } from '../../Api/studentApi';
import Kpi from '../../Components/UI/Kpi';
import { LoadingState, ErrorState, EmptyState } from '../../Components/UI/States';
import NextDeparture from '../../Components/UI/NextDeparture';

const EMPTY = [];

const StudentDashboard = () => {
    const { userId } = useAuth();
    const navigate = useNavigate();

    const { data: coursesRes, isLoading: loadingCourses, error: coursesError } = useGetEnrolledCoursesQuery(userId, { skip: !userId });
    const { data: attendanceRes, isLoading: loadingAttendance } = useGetStudentAttendanceQuery(userId, { skip: !userId });
    const { data: gradesRes, isLoading: loadingGrades } = useGetStudentGradesQuery(userId, { skip: !userId });

    const courses = coursesRes?.result || EMPTY;
    const attendance = attendanceRes?.result || EMPTY;
    const grades = gradesRes?.result || EMPTY;

    const attendancePct = useMemo(() => {
        if (!attendance.length) return null;
        const present = attendance.filter((a) => a.isPresent).length;
        return Math.round((present / attendance.length) * 100);
    }, [attendance]);

    const avgGrade = useMemo(() => {
        if (!grades.length) return null;
        const sum = grades.reduce((s, g) => s + (g.grade || 0), 0);
        return (sum / grades.length).toFixed(1);
    }, [grades]);

    const isLoading = loadingCourses || loadingAttendance || loadingGrades;

    return (
        <div>
            <div className="ax-page-top">
                <div><h1>Merhaba</h1><div className="meta">Bu dönem kayıtlı olduğun dersler ve genel durumun</div></div>
            </div>

            {isLoading && <LoadingState />}
            {!isLoading && coursesError && <ErrorState />}

            {!isLoading && !coursesError && (
                <>
                    <div className="ax-kpi-row">
                        <Kpi label="Kayıtlı Ders" value={courses.length} />
                        <Kpi label="Genel Devam Oranı" value={attendancePct !== null ? `%${attendancePct}` : '—'} />
                        <Kpi label="Ortalama Not" value={avgGrade !== null ? avgGrade : '—'} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 'var(--space-5)', alignItems: 'start' }}>
                        <NextDeparture />

                        <div className="ax-card">
                            <div className="ax-card-head"><h3>Derslerim</h3><button className="ax-btn ax-btn-ghost" onClick={() => navigate('/enrolledcourse')}>Tümü</button></div>
                            <div className="ax-card-body">
                                {courses.length === 0 ? (
                                    <EmptyState icon="📚" title="Henüz kayıtlı dersin yok" subtitle="Ders Seç sayfasından derse kayıt olabilirsin." />
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                                        {courses.map((c) => (
                                            <div key={c.courseId} style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)' }}>
                                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--purple-strong)', fontWeight: 700 }}>{c.code}</div>
                                                <div style={{ fontWeight: 600 }}>{c.name}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default StudentDashboard;
