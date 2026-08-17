import React, { useState } from "react";
import {
    useGetAvailableCoursesQuery,
    useEnrollCourseMutation,
} from "../Api/courseApi";
import { useAuth } from "../Hooks/useAuth";
import ToastrNotify from "../Helper/ToastrNotify";
import { LoadingState, ErrorState, EmptyState } from "./UI/States";
import "../styles/theme.css";

const SelectCourse = () => {
    const { isAuthenticated, userId: studentId } = useAuth();
    const [enrollingId, setEnrollingId] = useState(null);

    // Not: önceden tüm dersler (useGetAllCoursesQuery) listeleniyordu, öğrenci zaten
    // kayıtlı olduğu dersi de burada görüyordu. "available" uç noktası kayıtlı olunmayan
    // dersleri döndürüyor — daha doğru bir Ders Seç davranışı.
    const { data, isLoading, error } = useGetAvailableCoursesQuery(studentId, { skip: !studentId });
    const [enrollCourse] = useEnrollCourseMutation();

    const courses = data?.result || [];

    const handleEnroll = async (courseId) => {
        if (!isAuthenticated || !studentId) {
            ToastrNotify('Oturum bulunamadı, lütfen tekrar giriş yapın.', 'error');
            return;
        }
        setEnrollingId(courseId);
        try {
            await enrollCourse({ studentId, courseId }).unwrap();
            ToastrNotify('Derse kayıt oldunuz.', 'success');
        } catch (err) {
            ToastrNotify(err?.data?.errorMessages?.[0] || 'Kayıt sırasında bir hata oluştu.', 'error');
        } finally {
            setEnrollingId(null);
        }
    };

    return (
        <div>
            <div className="ax-page-top">
                <div><h1>Ders Seç</h1><div className="meta">Alınabilecek dersler</div></div>
            </div>

            {isLoading && <LoadingState />}
            {!isLoading && error && <ErrorState text="Dersler yüklenemedi." />}

            {!isLoading && !error && (
                courses.length === 0 ? (
                    <div className="ax-card"><EmptyState icon="📚" title="Alabileceğin yeni ders yok" subtitle="Zaten tüm derslere kayıtlısın ya da henüz ders açılmamış." /></div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        {courses.map((course) => (
                            <div key={course.courseId} className="ax-card" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', padding: 'var(--space-4)' }}>
                                <div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--purple-strong)', fontWeight: 700 }}>{course.code}</div>
                                    <div style={{ fontWeight: 600 }}>{course.name}</div>
                                    <div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{course.credits} kredi · {course.totalStudents} kayıtlı öğrenci</div>
                                </div>
                                <div style={{ flex: 1 }} />
                                <button
                                    className="ax-btn ax-btn-primary"
                                    disabled={enrollingId === course.courseId}
                                    onClick={() => handleEnroll(course.courseId)}
                                >
                                    {enrollingId === course.courseId ? 'Kaydediliyor…' : 'Kayıt Ol'}
                                </button>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default SelectCourse;
