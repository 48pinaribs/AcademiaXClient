import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetCourseByIdQuery } from '../Api/courseApi';
import CourseStudents from './CourseStudents';
import { useAuth } from '../Hooks/useAuth';
import { LoadingState, ErrorState } from './UI/States';
import '../styles/theme.css';

const CourseDetail = () => {
    const { id: courseId } = useParams();
    const { role } = useAuth();
    const { data, isLoading, error } = useGetCourseByIdQuery(courseId, { skip: !courseId });
    const course = data?.result;
    // Öğrenci listesi PII içerdiği için backend'de sadece Teacher/Administrator'a açık
    // (bkz. CourseController.GetStudentsByCourse) — Student bu sayfaya girebilir ama
    // roster bölümünü görmemeli, yoksa 403 hatası gösterilirdi.
    const canSeeRoster = role === 'Teacher' || role === 'Administrator';

    if (isLoading) return <LoadingState text="Ders yükleniyor…" />;
    if (error || !course) return <ErrorState text="Ders bulunamadı." />;

    return (
        <div>
            <div className="ax-page-top"><div><h1>Ders Detayı</h1></div></div>

            <div className="ax-card" style={{ marginBottom: 'var(--space-5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-5)', padding: 'var(--space-5)', flexWrap: 'wrap' }}>
                    <div>
                        <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--purple-strong)', fontWeight: 700, fontSize: 'var(--text-sm)' }}>{course.code}</div>
                        <h2 style={{ fontSize: 'var(--text-2xl)', marginTop: 4 }}>{course.name}</h2>
                        {course.description && (
                            <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-3)', maxWidth: '60ch' }}>{course.description}</p>
                        )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', minWidth: 180 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}><span style={{ color: 'var(--ink-faint)' }}>Kredi</span><span className="tabular" style={{ fontWeight: 600 }}>{course.credits}</span></div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)' }}><span style={{ color: 'var(--ink-faint)' }}>Öğrenci</span><span className="tabular" style={{ fontWeight: 600 }}>{course.totalStudents ?? '—'}</span></div>
                    </div>
                </div>
            </div>

            {canSeeRoster && (
                <div className="ax-card">
                    <div className="ax-card-head"><h3>Kayıtlı Öğrenciler</h3></div>
                    <div className="ax-card-body">
                        <CourseStudents courseId={courseId} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDetail;
