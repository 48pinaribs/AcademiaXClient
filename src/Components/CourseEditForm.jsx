import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetCourseByIdQuery, useUpdateCourseMutation } from '../Api/courseApi';
import { useGetAllTeachersQuery } from '../Api/teacherApi';
import ToastrNotify from '../Helper/ToastrNotify';
import { LoadingState, ErrorState } from './UI/States';
import '../styles/theme.css';

const CourseEditForm = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, error } = useGetCourseByIdQuery(courseId, { skip: !courseId });
    const course = data?.result;
    const [updateCourse, { isLoading: isSaving }] = useUpdateCourseMutation();
    const { data: teachersRes } = useGetAllTeachersQuery();
    const teachers = teachersRes?.result || [];

    const [form, setForm] = useState(null);

    useEffect(() => {
        if (course) {
            setForm({
                name: course.name || '',
                description: course.description || '',
                code: course.code || '',
                credits: course.credits || 1,
                departmentId: course.departmentId || 1,
                semesterId: course.semesterId || 1,
                teacherId: course.teacherId || '',
            });
        }
    }, [course]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: ['credits', 'departmentId', 'semesterId'].includes(name) ? Number(value) : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateCourse({ ...form, courseId: Number(courseId) }).unwrap();
            ToastrNotify('Ders güncellendi.', 'success');
            navigate('/admin/courses');
        } catch (err) {
            ToastrNotify('Ders güncellenirken bir hata oluştu.', 'error');
        }
    };

    if (isLoading || !form) return <LoadingState text="Ders verisi yükleniyor…" />;
    if (error) return <ErrorState text="Ders bulunamadı." />;

    return (
        <div>
            <div className="ax-page-top"><div><h1>Dersi Düzenle</h1><div className="meta">{course?.code}</div></div></div>
            <div className="ax-card" style={{ maxWidth: 560 }}>
                <form className="ax-card-body" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div className="ax-field"><label htmlFor="name">Ders Adı</label><input id="name" name="name" value={form.name} onChange={handleChange} required /></div>
                    <div className="ax-field"><label htmlFor="description">Açıklama</label><textarea id="description" name="description" rows={3} value={form.description} onChange={handleChange} /></div>
                    <div className="ax-field"><label htmlFor="code">Ders Kodu</label><input id="code" name="code" value={form.code} onChange={handleChange} required /></div>
                    <div className="ax-field-row">
                        <div className="ax-field"><label htmlFor="credits">Kredi</label><input id="credits" name="credits" type="number" min={1} max={30} value={form.credits} onChange={handleChange} required /></div>
                        <div className="ax-field"><label htmlFor="semesterId">Dönem No</label><input id="semesterId" name="semesterId" type="number" min={1} value={form.semesterId} onChange={handleChange} required /></div>
                    </div>
                    <div className="ax-field"><label htmlFor="departmentId">Bölüm No</label><input id="departmentId" name="departmentId" type="number" min={1} value={form.departmentId} onChange={handleChange} required /></div>
                    <div className="ax-field">
                        <label htmlFor="teacherId">Öğretim Üyesi</label>
                        <select id="teacherId" name="teacherId" value={form.teacherId} onChange={handleChange} required>
                            <option value="" disabled>Seçiniz…</option>
                            {teachers.map((t) => <option key={t.id} value={t.id}>{t.fullName}</option>)}
                        </select>
                    </div>

                    <button type="submit" className="ax-btn ax-btn-primary ax-btn-block" disabled={isSaving}>
                        {isSaving ? 'Kaydediliyor…' : 'Değişiklikleri Kaydet'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CourseEditForm;
