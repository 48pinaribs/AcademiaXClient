import React, { useState } from 'react';
import { useGetStudentsByCourseQuery } from '../Api/courseApi';
import { useGetAllStudentsQuery } from '../Api/studentApi';
import { useAssignStudentToCourseMutation } from '../Api/teacherApi';
import { useAuth } from '../Hooks/useAuth';
import ToastrNotify from '../Helper/ToastrNotify';
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
    const { role } = useAuth();
    const canManage = role === 'Teacher' || role === 'Administrator';

    const { data: students, isLoading, error, refetch } = useGetStudentsByCourseQuery(courseId, { skip: !courseId });
    const { data: allStudentsData } = useGetAllStudentsQuery(undefined, { skip: !canManage });
    const [assignStudent, { isLoading: isAssigning }] = useAssignStudentToCourseMutation();
    const [selected, setSelected] = useState('');

    const enrolledIds = new Set((students || []).map((s) => s.id));
    const availableStudents = (allStudentsData?.result || []).filter((s) => !enrolledIds.has(s.id));

    const handleAdd = async () => {
        if (!selected) return;
        try {
            await assignStudent({ studentId: selected, courseId: Number(courseId) }).unwrap();
            ToastrNotify('Öğrenci derse eklendi.', 'success');
            setSelected('');
            refetch();
        } catch (err) {
            const msg = err?.data?.errorMessages?.[0] || 'Öğrenci eklenirken bir hata oluştu.';
            ToastrNotify(msg, 'error');
        }
    };

    if (isLoading) return <LoadingState text="Öğrenciler yükleniyor…" />;
    if (error) return <ErrorState text="Öğrenciler getirilemedi." />;

    return (
        <div>
            {canManage && (
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
                    <div className="ax-field" style={{ flex: 1, minWidth: 220 }}>
                        <label htmlFor="addStudentSelect">Derse öğrenci ekle</label>
                        <select id="addStudentSelect" value={selected} onChange={(e) => setSelected(e.target.value)}>
                            <option value="">Öğrenci seçin…</option>
                            {availableStudents.map((s) => (
                                <option key={s.id} value={s.id}>{s.fullName}</option>
                            ))}
                        </select>
                    </div>
                    <button className="ax-btn ax-btn-primary" onClick={handleAdd} disabled={!selected || isAssigning}>
                        {isAssigning ? 'Ekleniyor…' : '+ Ekle'}
                    </button>
                </div>
            )}

            {!students?.length ? (
                <EmptyState icon="🎓" title="Bu derse kayıtlı öğrenci yok" />
            ) : (
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
            )}
        </div>
    );
};

export default CourseStudents;
