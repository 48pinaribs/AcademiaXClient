import React from 'react';
import { useGetTeacherCoursesQuery } from '../Api/teacherApi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth';
import { LoadingState, ErrorState, EmptyState } from './UI/States';
import '../styles/theme.css';

const TeacherCourse = () => {
    const navigate = useNavigate();
    const { userId: teacherId } = useAuth();

    const { data, error, isLoading } = useGetTeacherCoursesQuery(teacherId, { skip: !teacherId });
    const courses = data?.result || [];

    return (
        <div>
            <div className="ax-page-top">
                <div><h1>Derslerim</h1><div className="meta">{courses.length} ders</div></div>
            </div>

            {isLoading && <LoadingState />}
            {!isLoading && error && <ErrorState text="Dersler getirilemedi." />}

            {!isLoading && !error && (
                courses.length === 0 ? (
                    <div className="ax-card"><EmptyState icon="📚" title="Henüz atanmış dersiniz yok" /></div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {courses.map((course) => (
                            <div key={course.courseId} className="ax-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4)' }}>
                                <div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--purple-strong)', fontWeight: 700 }}>{course.code}</div>
                                    <div style={{ fontWeight: 600 }}>{course.name}</div>
                                    <div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{course.totalStudents} öğrenci · {course.credits} kredi</div>
                                </div>
                                <div style={{ flex: 1 }} />
                                <button className="ax-btn ax-btn-ghost" onClick={() => navigate(`/courses/${course.courseId}`)}>Detay</button>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default TeacherCourse;
