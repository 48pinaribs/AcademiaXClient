import React, { useState } from 'react';
import { useAuth } from '../../Hooks/useAuth';
import { useGetTeacherCoursesQuery, useGetCourseGradesQuery, useUpsertGradeMutation } from '../../Api/teacherApi';
import { useGetStudentsByCourseQuery } from '../../Api/courseApi';
import ToastrNotify from '../../Helper/ToastrNotify';
import { LoadingState, ErrorState, EmptyState } from '../../Components/UI/States';
import '../../styles/theme.css';

const EXAM_TYPES = [
    { value: 'Midterm', label: 'Vize' },
    { value: 'Final', label: 'Final' },
    { value: 'Resit', label: 'Bütünleme' },
];

// Tek bir öğrenci satırı — kendi local input state'ini tutar, "Kaydet" ile tek başına gönderilir.
// key={`${student.id}-${courseId}-${examType}`} (parent'ta) ders/sınav türü değişince bileşeni
// yeniden mount ederek local state'i sıfırlıyor; ayrı bir senkronizasyon efekti gerekmiyor.
const GradeRow = ({ student, courseId, examType, existingValue }) => {
    const [value, setValue] = useState(existingValue ?? '');
    const [upsertGrade, { isLoading }] = useUpsertGradeMutation();

    const handleSave = async () => {
        if (value === '') return;
        try {
            await upsertGrade({ studentId: student.id, courseId, examType, value: Number(value) }).unwrap();
            ToastrNotify(`${student.firstName} ${student.lastName} için not kaydedildi.`, 'success');
        } catch (err) {
            ToastrNotify(err?.data?.errorMessages?.[0] || 'Not kaydedilirken bir hata oluştu.', 'error');
        }
    };

    return (
        <tr>
            <td>{student.firstName} {student.lastName}</td>
            <td>{student.email}</td>
            <td style={{ width: 120 }}>
                <input
                    type="number"
                    min={0}
                    max={100}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    style={{ width: 90 }}
                />
            </td>
            <td style={{ textAlign: 'right' }}>
                <button className="ax-btn ax-btn-ghost" onClick={handleSave} disabled={isLoading || value === ''}>
                    {isLoading ? 'Kaydediliyor…' : 'Kaydet'}
                </button>
            </td>
        </tr>
    );
};

const TeacherGradeEntry = () => {
    const { userId } = useAuth();
    const { data: coursesData, isLoading: coursesLoading } = useGetTeacherCoursesQuery(userId, { skip: !userId });
    const courses = coursesData?.result || [];

    const [courseId, setCourseId] = useState('');
    const [examType, setExamType] = useState('Midterm');

    const { data: studentsData, isLoading: studentsLoading, error: studentsError } = useGetStudentsByCourseQuery(courseId, { skip: !courseId });
    const { data: gradesData } = useGetCourseGradesQuery(courseId, { skip: !courseId });

    const students = studentsData || [];
    const grades = gradesData?.result || [];
    const gradeFor = (studentId) => grades.find((g) => g.studentId === studentId && g.examType === examType)?.value;

    return (
        <div>
            <div className="ax-page-top">
                <div><h1>Not Girişi</h1><div className="meta">Dersinize kayıtlı öğrencilere sınav notu girin</div></div>
            </div>

            <div className="ax-card">
                <div className="ax-card-body">
                    <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-4)' }}>
                        <div className="ax-field" style={{ flex: 1, minWidth: 220 }}>
                            <label htmlFor="courseSelect">Ders</label>
                            <select id="courseSelect" value={courseId} onChange={(e) => setCourseId(e.target.value)} disabled={coursesLoading}>
                                <option value="">Ders seçin…</option>
                                {courses.map((c) => (
                                    <option key={c.courseId} value={c.courseId}>{c.code} — {c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="ax-field" style={{ minWidth: 160 }}>
                            <label htmlFor="examTypeSelect">Sınav Türü</label>
                            <select id="examTypeSelect" value={examType} onChange={(e) => setExamType(e.target.value)}>
                                {EXAM_TYPES.map((e) => (
                                    <option key={e.value} value={e.value}>{e.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {!courseId ? (
                        <EmptyState icon="📝" title="Not girmek için önce bir ders seçin" />
                    ) : studentsLoading ? (
                        <LoadingState text="Öğrenciler yükleniyor…" />
                    ) : studentsError ? (
                        <ErrorState text="Öğrenciler getirilemedi." />
                    ) : students.length === 0 ? (
                        <EmptyState icon="🎓" title="Bu derse kayıtlı öğrenci yok" />
                    ) : (
                        <div className="ax-table-wrap">
                            <table className="ax-table">
                                <thead><tr><th>Öğrenci</th><th>E-posta</th><th>Not</th><th></th></tr></thead>
                                <tbody>
                                    {students.map((s) => (
                                        <GradeRow
                                            key={`${s.id}-${courseId}-${examType}`}
                                            student={s}
                                            courseId={Number(courseId)}
                                            examType={examType}
                                            existingValue={gradeFor(s.id)}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherGradeEntry;
