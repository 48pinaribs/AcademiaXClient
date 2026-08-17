import React, { useMemo } from 'react';
import { useGetAllCoursesQuery, useDeleteCourseMutation } from '../Api/courseApi';
import { useGetAllTeachersQuery } from '../Api/teacherApi';
import { useNavigate } from 'react-router-dom';
import ToastrNotify from '../Helper/ToastrNotify';
import { LoadingState, ErrorState, EmptyState } from './UI/States';
import '../styles/theme.css';

const EMPTY = [];

const CourseList = ({ searchTerm }) => {
    const { data, isLoading, error } = useGetAllCoursesQuery();
    const { data: teachersRes } = useGetAllTeachersQuery();
    const [deleteCourse] = useDeleteCourseMutation();
    const navigate = useNavigate();

    const courses = data?.result || EMPTY;
    const teachers = teachersRes?.result || EMPTY;

    const teacherNameById = useMemo(() => {
        const map = {};
        teachers.forEach((t) => { map[t.id] = t.fullName; });
        return map;
    }, [teachers]);

    const filtered = searchTerm
        ? courses.filter((c) =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.code.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : courses;

    const handleEdit = (course) => navigate(`/admin/courseeditform/${course.courseId}`);

    const handleDelete = async (id) => {
        if (!window.confirm('Bu kursu silmek istediğinize emin misiniz?')) return;
        try {
            await deleteCourse(id).unwrap();
            ToastrNotify('Kurs silindi.', 'success');
        } catch (err) {
            ToastrNotify('Silme başarısız oldu.', 'error');
        }
    };

    if (isLoading) return <LoadingState text="Kurslar yükleniyor…" />;
    if (error) return <ErrorState text="Kurslar getirilemedi." />;
    if (!courses.length) return <EmptyState icon="📚" title="Henüz kurs bulunmuyor" />;

    return (
        <div className="ax-card">
            <div className="ax-card-body ax-table-wrap">
                {filtered.length === 0 ? (
                    <EmptyState icon="🔍" title="Aramanla eşleşen kurs yok" />
                ) : (
                    <table className="ax-table">
                        <thead><tr><th>Kod</th><th>Ders</th><th>Öğretmen</th><th>Öğrenci</th><th>Kredi</th><th></th></tr></thead>
                        <tbody>
                            {filtered.map((course) => (
                                <tr key={course.courseId}>
                                    <td className="tabular">{course.code}</td>
                                    <td>{course.name}</td>
                                    <td>{teacherNameById[course.teacherId] || '—'}</td>
                                    <td className="tabular">{course.totalStudents}</td>
                                    <td className="tabular">{course.credits || '—'}</td>
                                    <td style={{ whiteSpace: 'nowrap' }}>
                                        <button className="ax-btn ax-btn-ghost" onClick={() => handleEdit(course)}>Düzenle</button>{' '}
                                        <button className="ax-btn ax-btn-ghost" style={{ color: 'var(--brick)' }} onClick={() => handleDelete(course.courseId)}>Sil</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default CourseList;
