import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetUserTypeQuery } from '../Api/accountApi';
import { useGetTeacherProfileQuery, useGetAllTeachersQuery } from '../Api/teacherApi';
import { useGetStudentProfileQuery, useAssignAdvisorMutation } from '../Api/studentApi';
import { useAuth } from '../Hooks/useAuth';
import ToastrNotify from '../Helper/ToastrNotify';
import { LoadingState, ErrorState, EmptyState } from './UI/States';
import '../styles/theme.css';

const initials = (fullName) => {
    const parts = (fullName || '').trim().split(/\s+/);
    return ((parts[0]?.[0] || '?') + (parts[1]?.[0] || '')).toUpperCase();
};

const Field = ({ label, value }) => (
    <div>
        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-faint)' }}>{label}</div>
        <div style={{ fontSize: 'var(--text-base)', marginTop: 4 }}>{value || '—'}</div>
    </div>
);

// Admin'in bir öğrenciye danışman öğretim üyesi atayabildiği kontrol.
const AdvisorAssignment = ({ studentId, currentAdvisorName }) => {
    const { data: teachersData, isLoading } = useGetAllTeachersQuery();
    const [assignAdvisor, { isLoading: isAssigning }] = useAssignAdvisorMutation();
    const [selected, setSelected] = useState('');

    const teachers = teachersData?.result || [];

    const handleAssign = async () => {
        if (!selected) return;
        try {
            await assignAdvisor({ studentId, advisorId: selected }).unwrap();
            ToastrNotify('Danışman ataması güncellendi.', 'success');
        } catch (err) {
            const msg = err?.data?.errorMessages?.[0] || 'Danışman atanırken bir hata oluştu.';
            ToastrNotify(msg, 'error');
        }
    };

    return (
        <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'flex-end', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <div className="ax-field" style={{ flex: 1, minWidth: 220 }}>
                <label htmlFor="advisorSelect">Danışman Ata {currentAdvisorName ? `(mevcut: ${currentAdvisorName})` : ''}</label>
                <select id="advisorSelect" value={selected} onChange={(e) => setSelected(e.target.value)} disabled={isLoading}>
                    <option value="">Öğretim üyesi seçin…</option>
                    {teachers.map((t) => (
                        <option key={t.id} value={t.id}>{t.fullName}</option>
                    ))}
                </select>
            </div>
            <button className="ax-btn ax-btn-primary" onClick={handleAssign} disabled={!selected || isAssigning}>
                {isAssigning ? 'Atanıyor…' : 'Ata'}
            </button>
        </div>
    );
};

const UserDetail = () => {
    const { userId } = useParams();
    const { role: viewerRole } = useAuth();

    const { data: userTypeData, isLoading: isLoadingType } = useGetUserTypeQuery(userId, { skip: !userId });
    const userType = userTypeData?.result;

    const {
        data: teacherData,
        isLoading: isTeacherLoading,
        error: teacherError,
    } = useGetTeacherProfileQuery(userId, { skip: userType !== 'Teacher' });

    const {
        data: studentData,
        isLoading: isStudentLoading,
        error: studentError,
    } = useGetStudentProfileQuery(userId, { skip: userType !== 'Student' });

    const profile = userType === 'Teacher' ? teacherData?.result : studentData?.result;

    if (isLoadingType || isTeacherLoading || isStudentLoading) {
        return <LoadingState text="Profil yükleniyor…" />;
    }

    if (!profile) {
        const notFound = userType && !teacherError && !studentError;
        return notFound
            ? <EmptyState title="Kullanıcı profili bulunamadı." />
            : <ErrorState text="Kullanıcı profili alınamadı." />;
    }

    const fullName = profile.fullName;
    const phone = profile.phoneNumber || profile.phone;

    return (
        <div>
            <div className="ax-page-top"><div><h1>{fullName}</h1><div className="meta">{userType === 'Teacher' ? 'Öğretim Üyesi' : 'Öğrenci'}</div></div></div>

            <div className="ax-card">
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', padding: 'var(--space-5)', borderBottom: '1px solid var(--line-soft)' }}>
                    <div className="ax-avatar-lg">{initials(fullName)}</div>
                    <div>
                        <h2 style={{ fontSize: 'var(--text-xl)' }}>{fullName}</h2>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-faint)', marginTop: 3 }}>{profile.email}</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', padding: 'var(--space-5)' }}>
                    <Field label="E-posta" value={profile.email} />
                    <Field label="Telefon" value={phone} />

                    {userType === 'Teacher' && (
                        <>
                            <Field label="Bölüm" value={profile.branch} />
                            <Field label="Unvan" value={profile.title} />
                            <Field label="Oda" value={profile.office} />
                            <Field label="Verdiği Ders Sayısı" value={profile.coursesGivenCount} />
                            <Field label="Toplam Öğrenci" value={profile.totalStudents} />
                            <div style={{ gridColumn: '1 / -1' }}><Field label="Biyografi" value={profile.biography} /></div>
                        </>
                    )}

                    {userType === 'Student' && (
                        <>
                            <Field label="Bölüm" value={profile.department} />
                            <Field label="Danışman" value={profile.advisorName} />
                            <Field label="Genel Not Ortalaması" value={profile.gpa != null ? profile.gpa.toFixed(2) : null} />
                            <div style={{ gridColumn: '1 / -1' }}><Field label="Biyografi" value={profile.biography} /></div>
                            {viewerRole === 'Administrator' && (
                                <AdvisorAssignment studentId={userId} currentAdvisorName={profile.advisorName} />
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
