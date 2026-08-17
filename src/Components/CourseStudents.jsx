import React from 'react';
import { useGetStudentsByCourseQuery } from '../Api/courseApi';
import { LoadingState, ErrorState, EmptyState } from './UI/States';
import '../styles/theme.css';

const initials = (firstName, lastName) => {
    const a = (firstName || '?')[0] || '?';
    const b = (lastName || '')[0] || '';
    return (a + b).toUpperCase();
};

// courseId prop ile kullanılan, tek bir dersin kayıtlı öğrenci listesini gösteren
// gömülebilir bileşen (bkz. CourseDetail.jsx).
const CourseStudents = ({ courseId }) => {
    const { data: students, isLoading, error } = useGetStudentsByCourseQuery(courseId, { skip: !courseId });

    if (isLoading) return <LoadingState text="Öğrenciler yükleniyor…" />;
    if (error) return <ErrorState text="Öğrenciler getirilemedi." />;
    if (!students?.length) return <EmptyState icon="🎓" title="Bu derse kayıtlı öğrenci yok" />;

    return (
        <div className="ax-table-wrap">
            <table className="ax-table">
                <thead><tr><th>Öğrenci</th><th>E-posta</th></tr></thead>
                <tbody>
                    {students.map((s) => (
                        <tr key={s.id}>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div className="ax-avatar">{initials(s.firstName, s.lastName)}</div>
                                    {s.firstName} {s.lastName}
                                </div>
                            </td>
                            <td>{s.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CourseStudents;
