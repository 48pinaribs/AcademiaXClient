import React, { useState } from 'react';
import { useAuth } from '../../Hooks/useAuth';
import { useGetTeacherCoursesQuery, useGetCourseAttendanceQuery, useMarkAttendanceMutation } from '../../Api/teacherApi';
import { useGetStudentsByCourseQuery } from '../../Api/courseApi';
import ToastrNotify from '../../Helper/ToastrNotify';
import { LoadingState, ErrorState, EmptyState } from '../../Components/UI/States';
import '../../styles/theme.css';

const STATUS_OPTIONS = [
    { value: 'Present', label: 'Var' },
    { value: 'Absent', label: 'Yok' },
    { value: 'Excused', label: 'Mazeretli' },
];

const todayIso = () => new Date().toISOString().slice(0, 10);

// courseId+date için roster yüklendikten SONRA mount edilir (bkz. parent) — bu sayede
// başlangıç statusMap'i o günün var olan kayıtlarını doğru şekilde yansıtır.
const AttendanceTable = ({ courseId, date, students, existingRecords }) => {
    const [statusMap, setStatusMap] = useState(() => {
        const map = {};
        students.forEach((s) => {
            map[s.id] = existingRecords.find((r) => r.studentId === s.id)?.status || 'Present';
        });
        return map;
    });
    const [markAttendance, { isLoading }] = useMarkAttendanceMutation();

    const setStatus = (studentId, status) => setStatusMap((m) => ({ ...m, [studentId]: status }));

    const handleSaveAll = async () => {
        try {
            await markAttendance({
                courseId,
                date,
                records: Object.entries(statusMap).map(([studentId, status]) => ({ studentId, status })),
            }).unwrap();
            ToastrNotify('Yoklama kaydedildi.', 'success');
        } catch (err) {
            ToastrNotify(err?.data?.errorMessages?.[0] || 'Yoklama kaydedilirken bir hata oluştu.', 'error');
        }
    };

    return (
        <>
            <div className="ax-table-wrap">
                <table className="ax-table">
                    <thead><tr><th>Öğrenci</th><th>E-posta</th><th style={{ width: 160 }}>Durum</th></tr></thead>
                    <tbody>
                        {students.map((s) => (
                            <tr key={s.id}>
                                <td>{s.firstName} {s.lastName}</td>
                                <td>{s.email}</td>
                                <td>
                                    <select value={statusMap[s.id]} onChange={(e) => setStatus(s.id, e.target.value)}>
                                        {STATUS_OPTIONS.map((o) => (
                                            <option key={o.value} value={o.value}>{o.label}</option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div style={{ marginTop: 'var(--space-4)', textAlign: 'right' }}>
                <button className="ax-btn ax-btn-primary" onClick={handleSaveAll} disabled={isLoading}>
                    {isLoading ? 'Kaydediliyor…' : 'Tümünü Kaydet'}
                </button>
            </div>
        </>
    );
};

const TeacherAttendanceTaking = () => {
    const { userId } = useAuth();
    const { data: coursesData, isLoading: coursesLoading } = useGetTeacherCoursesQuery(userId, { skip: !userId });
    const courses = coursesData?.result || [];

    const [courseId, setCourseId] = useState('');
    const [date, setDate] = useState(todayIso());

    const { data: studentsData, isLoading: studentsLoading, error: studentsError } = useGetStudentsByCourseQuery(courseId, { skip: !courseId });
    const { data: attendanceData, isLoading: attendanceLoading, isFetching: attendanceFetching } = useGetCourseAttendanceQuery(
        { courseId, date },
        { skip: !courseId }
    );

    const students = studentsData || [];
    const existingRecords = attendanceData?.result || [];

    const isPreparing = studentsLoading || attendanceLoading || attendanceFetching;

    return (
        <div>
            <div className="ax-page-top">
                <div><h1>Yoklama Al</h1><div className="meta">Dersinize kayıtlı öğrencilerin günlük yoklamasını işaretleyin</div></div>
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
                        <div className="ax-field" style={{ minWidth: 170 }}>
                            <label htmlFor="dateInput">Tarih</label>
                            <input id="dateInput" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                    </div>

                    {!courseId ? (
                        <EmptyState icon="🗓️" title="Yoklama almak için önce bir ders seçin" />
                    ) : isPreparing ? (
                        <LoadingState text="Yükleniyor…" />
                    ) : studentsError ? (
                        <ErrorState text="Öğrenciler getirilemedi." />
                    ) : students.length === 0 ? (
                        <EmptyState icon="🎓" title="Bu derse kayıtlı öğrenci yok" />
                    ) : (
                        <AttendanceTable
                            key={`${courseId}-${date}`}
                            courseId={Number(courseId)}
                            date={date}
                            students={students}
                            existingRecords={existingRecords}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeacherAttendanceTaking;
