import { useState } from 'react';
import { useGetUserByIdQuery, useUpdateProfileMutation } from "../Api/accountApi";
import { useGetStudentProfileQuery, useSendStudentMessageMutation } from "../Api/studentApi";
import { useAuth } from '../Hooks/useAuth';
import ToastrNotify from '../Helper/ToastrNotify';
import { LoadingState, ErrorState, EmptyState } from './UI/States';
import '../styles/theme.css';

const initials = (firstName, lastName) => {
    const a = (firstName || '?')[0] || '?';
    const b = (lastName || '')[0] || '';
    return (a + b).toUpperCase();
};

// Öğrencinin danışmanına mesaj gönderebildiği küçük gömülü form.
const AdvisorMessageBox = ({ userId }) => {
    const { data, isLoading } = useGetStudentProfileQuery(userId, { skip: !userId });
    const [sendMessage, { isLoading: isSending }] = useSendStudentMessageMutation();
    const [content, setContent] = useState('');

    const advisorName = data?.result?.advisorName;

    const handleSend = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        try {
            await sendMessage({ studentId: userId, content }).unwrap();
            ToastrNotify('Mesaj danışmanınıza gönderildi.', 'success');
            setContent('');
        } catch (err) {
            const msg = err?.data?.errorMessages?.[0] || 'Mesaj gönderilirken bir hata oluştu.';
            ToastrNotify(msg, 'error');
        }
    };

    return (
        <div className="ax-card" style={{ marginTop: 'var(--space-5)' }}>
            <div className="ax-card-head"><h3>Danışmanıma Mesaj Gönder</h3></div>
            <div className="ax-card-body">
                {isLoading ? (
                    <LoadingState text="Yükleniyor…" />
                ) : !advisorName ? (
                    <EmptyState icon="🧑‍🏫" title="Henüz bir danışmanınız atanmamış." subtitle="Danışman ataması için yönetim ile iletişime geçin." />
                ) : (
                    <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-faint)' }}>Danışmanınız: <strong style={{ color: 'var(--ink)' }}>{advisorName}</strong></div>
                        <div className="ax-field">
                            <label htmlFor="advisorMessage">Mesajınız</label>
                            <textarea
                                id="advisorMessage"
                                rows={3}
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Mesajınızı yazın…"
                                required
                                style={{ resize: 'vertical' }}
                            />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <button type="submit" className="ax-btn ax-btn-primary" disabled={isSending}>{isSending ? 'Gönderiliyor…' : 'Gönder'}</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

const ProfilePage = () => {
    const { isAuthenticated, userId, role } = useAuth();

    // Not: token yoksa/bozuksa useGetUserByIdQuery'yi hiç çağırmıyoruz (skip) — eskiden
    // token null olduğunda burada doğrudan bir çökme (token.split of null) oluyordu.
    const { data, error, isLoading } = useGetUserByIdQuery(userId, { skip: !isAuthenticated });
    const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState(null);

    if (!isAuthenticated) {
        return <EmptyState title="Profili görüntülemek için giriş yapmalısınız." />;
    }

    if (isLoading) return <LoadingState text="Profil yükleniyor…" />;
    if (error) return <ErrorState text="Kullanıcı bilgisi alınamadı." />;

    const user = data?.result;
    if (!user) {
        return <EmptyState title="Profil bilgisi bulunamadı." />;
    }

    const isTeacher = role === 'Teacher';
    const isStudent = role === 'Student';

    const startEdit = () => {
        setForm({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            phoneNumber: user.phoneNumber || '',
            branch: user.branch || '',
            title: user.title || '',
            office: user.office || '',
            biography: user.biography || '',
        });
        setIsEditing(true);
    };

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const payload = { id: userId, firstName: form.firstName, lastName: form.lastName, phoneNumber: form.phoneNumber };
            if (isTeacher) {
                payload.branch = form.branch;
                payload.title = form.title;
                payload.office = form.office;
                payload.biography = form.biography;
            }
            await updateProfile(payload).unwrap();
            ToastrNotify('Profil güncellendi.', 'success');
            setIsEditing(false);
        } catch (err) {
            ToastrNotify('Profil güncellenirken bir hata oluştu.', 'error');
        }
    };

    return (
        <div>
            <div className="ax-page-top">
                <div><h1>Profilim</h1><div className="meta">Kişisel bilgiler</div></div>
            </div>
            <div className="ax-card">
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', padding: 'var(--space-5)', borderBottom: '1px solid var(--line-soft)' }}>
                    <div className="ax-avatar-lg">{initials(user.firstName, user.lastName)}</div>
                    <div>
                        <h2 style={{ fontSize: 'var(--text-xl)' }}>{user.firstName} {user.lastName}</h2>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-faint)', marginTop: 3 }}>{user.userName} · {user.role}</div>
                    </div>
                </div>

                {!isEditing ? (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', padding: 'var(--space-5)' }}>
                            <div>
                                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-faint)' }}>E-posta</div>
                                <div style={{ fontSize: 'var(--text-base)', marginTop: 4 }}>{user.email}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-faint)' }}>Telefon</div>
                                <div className="tabular" style={{ fontSize: 'var(--text-base)', marginTop: 4 }}>{user.phoneNumber || '—'}</div>
                            </div>
                            {isTeacher && (
                                <>
                                    <div>
                                        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-faint)' }}>Bölüm</div>
                                        <div style={{ fontSize: 'var(--text-base)', marginTop: 4 }}>{user.branch || '—'}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-faint)' }}>Unvan</div>
                                        <div style={{ fontSize: 'var(--text-base)', marginTop: 4 }}>{user.title || '—'}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-faint)' }}>Oda</div>
                                        <div style={{ fontSize: 'var(--text-base)', marginTop: 4 }}>{user.office || '—'}</div>
                                    </div>
                                    <div style={{ gridColumn: '1 / -1' }}>
                                        <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-faint)' }}>Biyografi</div>
                                        <div style={{ fontSize: 'var(--text-base)', marginTop: 4, whiteSpace: 'pre-wrap' }}>{user.biography || '—'}</div>
                                    </div>
                                </>
                            )}
                        </div>
                        <div style={{ padding: '0 var(--space-5) var(--space-5)', textAlign: 'right' }}>
                            <button className="ax-btn ax-btn-primary" onClick={startEdit}>Profili Düzenle</button>
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleSave} style={{ padding: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        <div className="ax-field-row">
                            <div className="ax-field"><label htmlFor="firstName">Ad</label><input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required /></div>
                            <div className="ax-field"><label htmlFor="lastName">Soyad</label><input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required /></div>
                        </div>
                        <div className="ax-field"><label htmlFor="phoneNumber">Telefon</label><input id="phoneNumber" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} /></div>

                        {isTeacher && (
                            <>
                                <div className="ax-field-row">
                                    <div className="ax-field"><label htmlFor="branch">Bölüm</label><input id="branch" name="branch" value={form.branch} onChange={handleChange} /></div>
                                    <div className="ax-field"><label htmlFor="title">Unvan</label><input id="title" name="title" value={form.title} onChange={handleChange} /></div>
                                </div>
                                <div className="ax-field"><label htmlFor="office">Oda</label><input id="office" name="office" value={form.office} onChange={handleChange} /></div>
                                <div className="ax-field">
                                    <label htmlFor="biography">Biyografi</label>
                                    <textarea id="biography" name="biography" rows={4} value={form.biography} onChange={handleChange} style={{ resize: 'vertical', fontFamily: 'inherit' }} />
                                </div>
                            </>
                        )}

                        <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
                            <button type="button" className="ax-btn ax-btn-ghost" onClick={() => setIsEditing(false)}>Vazgeç</button>
                            <button type="submit" className="ax-btn ax-btn-primary" disabled={isSaving}>{isSaving ? 'Kaydediliyor…' : 'Kaydet'}</button>
                        </div>
                    </form>
                )}
            </div>

            {isStudent && <AdvisorMessageBox userId={userId} />}
        </div>
    );
};

export default ProfilePage;
