import React, { useMemo } from 'react';
import { useGetAllStudentsQuery } from '../../Api/studentApi';
import { useGetAllTeachersQuery } from '../../Api/teacherApi';
import { useGetAllCoursesQuery } from '../../Api/courseApi';
import Kpi from '../../Components/UI/Kpi';
import { LoadingState, ErrorState, EmptyState } from '../../Components/UI/States';

const EMPTY = [];

const AdminDashboard = () => {
    const { data: studentsRes, isLoading: loadingStudents, error: studentsError } = useGetAllStudentsQuery();
    const { data: teachersRes, isLoading: loadingTeachers, error: teachersError } = useGetAllTeachersQuery();
    const { data: coursesRes, isLoading: loadingCourses, error: coursesError } = useGetAllCoursesQuery();

    const students = studentsRes?.result || EMPTY;
    const teachers = teachersRes?.result || EMPTY;
    const courses = coursesRes?.result || EMPTY;

    const teacherNameById = useMemo(() => {
        const map = {};
        teachers.forEach((t) => { map[t.id] = t.fullName; });
        return map;
    }, [teachers]);

    const totalEnrollments = courses.reduce((sum, c) => sum + (c.totalStudents || 0), 0);

    const topCourses = useMemo(
        () => [...courses].sort((a, b) => (b.totalStudents || 0) - (a.totalStudents || 0)).slice(0, 6),
        [courses]
    );

    const teacherLoad = useMemo(() => {
        const counts = {};
        courses.forEach((c) => {
            if (!c.teacherId) return;
            counts[c.teacherId] = (counts[c.teacherId] || 0) + 1;
        });
        return Object.entries(counts)
            .map(([teacherId, count]) => ({ teacherId, count, name: teacherNameById[teacherId] || 'Bilinmeyen öğretmen' }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);
    }, [courses, teacherNameById]);

    const isLoading = loadingStudents || loadingTeachers || loadingCourses;
    const error = studentsError || teachersError || coursesError;

    return (
        <div>
            <div className="ax-page-top">
                <div><h1>Yönetim Paneli</h1></div>
            </div>

            {isLoading && <LoadingState />}
            {!isLoading && error && <ErrorState />}

            {!isLoading && !error && (
                <>
                    <div className="ax-kpi-row">
                        <Kpi label="Toplam Öğrenci" value={students.length} />
                        <Kpi label="Toplam Öğretmen" value={teachers.length} />
                        <Kpi label="Aktif Ders" value={courses.length} />
                        <Kpi label="Toplam Kayıt" value={totalEnrollments} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 'var(--space-5)' }}>
                        <div className="ax-card">
                            <div className="ax-card-head"><h3>Kayıt sayısına göre dersler</h3></div>
                            <div className="ax-card-body ax-table-wrap">
                                {topCourses.length === 0 ? (
                                    <EmptyState icon="📚" title="Henüz ders yok" subtitle="Bir ders eklendiğinde burada listelenecek." />
                                ) : (
                                    <table className="ax-table">
                                        <thead><tr><th>Kod</th><th>Ders</th><th>Öğretmen</th><th>Öğrenci</th></tr></thead>
                                        <tbody>
                                            {topCourses.map((c) => (
                                                <tr key={c.courseId}>
                                                    <td className="tabular">{c.code}</td>
                                                    <td>{c.name}</td>
                                                    <td>{teacherNameById[c.teacherId] || '—'}</td>
                                                    <td className="tabular">{c.totalStudents}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        <div className="ax-card">
                            <div className="ax-card-head"><h3>Öğretmen başına ders yükü</h3></div>
                            <div className="ax-card-body">
                                {teacherLoad.length === 0 ? (
                                    <EmptyState icon="👩‍🏫" title="Veri yok" />
                                ) : (
                                    teacherLoad.map((t) => (
                                        <div className="ax-list-row" key={t.teacherId} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderTop: '1px solid var(--line-soft)' }}>
                                            <span style={{ fontSize: 'var(--text-sm)' }}>{t.name}</span>
                                            <span className="ax-chip ax-chip-purple tabular">{t.count} ders</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
