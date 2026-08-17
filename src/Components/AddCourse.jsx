import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateCourseMutation } from '../Api/courseApi';
import { useGetAllTeachersQuery } from '../Api/teacherApi';
import ToastrNotify from '../Helper/ToastrNotify';
import '../styles/theme.css';

const AddCourse = () => {
    const navigate = useNavigate();
    const [createCourse, { isLoading }] = useCreateCourseMutation();
    const { data: teachersRes } = useGetAllTeachersQuery();
    const teachers = teachersRes?.result || [];

    const [form, setForm] = useState({
        name: '', code: '', description: '', credits: 3, departmentId: 1, semesterId: 1, teacherId: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: ['credits', 'departmentId', 'semesterId'].includes(name) ? Number(value) : value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createCourse(form).unwrap();
            ToastrNotify('Ders oluşturuldu.', 'success');
            navigate('/admin/courses');
        } catch (err) {
            const messages = err?.data?.errorMessages;
            setError(Array.isArray(messages) && messages.length ? messages.join(' ') : 'Ders oluşturulurken bir hata oluştu.');
        }
    };

    return (
        <div>
            <div className="ax-page-top"><div><h1>Yeni Ders Ekle</h1></div></div>
            <div className="ax-card" style={{ maxWidth: 560 }}>
                <form className="ax-card-body" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div className="ax-field"><label htmlFor="name">Ders Adı</label><input id="name" name="name" value={form.name} onChange={handleChange} required /></div>
                    <div className="ax-field"><label htmlFor="code">Ders Kodu</label><input id="code" name="code" value={form.code} onChange={handleChange} required /></div>
                    <div className="ax-field"><label htmlFor="description">Açıklama</label><textarea id="description" name="description" rows={3} value={form.description} onChange={handleChange} /></div>
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

                    {error && <div className="ax-error">{error}</div>}

                    <button type="submit" className="ax-btn ax-btn-primary ax-btn-block" disabled={isLoading}>
                        {isLoading ? 'Kaydediliyor…' : 'Dersi Kaydet'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddCourse;
