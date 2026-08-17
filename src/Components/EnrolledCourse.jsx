import React from 'react';
import {
    useGetEnrolledCoursesQuery,
    useUnenrollCourseMutation,
} from '../Api/courseApi';
import { useAuth } from '../Hooks/useAuth';
import ToastrNotify from '../Helper/ToastrNotify';
import { LoadingState, ErrorState, EmptyState } from './UI/States';
import '../styles/theme.css';

const EnrolledCourse = () => {
    const { userId } = useAuth();
    const { data, isLoading, error } = useGetEnrolledCoursesQuery(userId, { skip: !userId });
    const [unenrollCourse, { isLoading: isUnenrolling }] = useUnenrollCourseMutation();

    const courses = data?.result || [];

    const handleUnenroll = async (courseId) => {
        if (!window.confirm('Bu dersten ayrılmak istediğine emin misin?')) return;
        try {
            // Backend UnenrollFromCourseRequestDTO hem StudentId hem CourseId bekliyor.
            await unenrollCourse({ studentId: userId, courseId }).unwrap();
            ToastrNotify('Dersten ayrıldın.', 'success');
        } catch (err) {
            ToastrNotify('Ayrılma işlemi başarısız oldu.', 'error');
        }
    };

    return (
        <div>
            <div className="ax-page-top">
                <div><h1>Derslerim</h1><div className="meta">{courses.length} kayıtlı ders</div></div>
            </div>

            {isLoading && <LoadingState />}
            {!isLoading && error && <ErrorState text="Dersler yüklenemedi." />}

            {!isLoading && !error && (
                courses.length === 0 ? (
                    <div className="ax-card"><EmptyState icon="📚" title="Henüz kayıtlı dersin yok" subtitle="Ders Seç sayfasından derse kayıt olabilirsin." /></div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {courses.map((course) => (
                            <div key={course.courseId} className="ax-card" style={{ padding: 'var(--space-4)' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
                                    <div>
                                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--purple-strong)', fontWeight: 700 }}>{course.code}</div>
                                        <div style={{ fontWeight: 600, fontSize: 'var(--text-base)' }}>{course.name}</div>
                                        {course.description && <div style={{ fontSize: 12.5, color: 'var(--ink-faint)', marginTop: 4, maxWidth: '55ch' }}>{course.description}</div>}
                                        <div style={{ fontSize: 12, color: 'var(--ink-faint)', marginTop: 4 }}>{course.credits} kredi</div>
                                    </div>
                                    <div style={{ flex: 1 }} />
                                    <button
                                        className="ax-btn ax-btn-ghost"
                                        disabled={isUnenrolling}
                                        onClick={() => handleUnenroll(course.courseId)}
                                        style={{ color: 'var(--brick)', borderColor: 'var(--brick-tint)' }}
                                    >
                                        Bırak
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default EnrolledCourse;
