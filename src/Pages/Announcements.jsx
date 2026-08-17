import React, { useState } from 'react';
import { useAuth } from '../Hooks/useAuth';
import { useGetAllAnnouncementsQuery, useCreateAnnouncementMutation, useDeleteAnnouncementMutation } from '../Api/announcementApi';
import ToastrNotify from '../Helper/ToastrNotify';
import { LoadingState, ErrorState, EmptyState } from '../Components/UI/States';
import '../styles/theme.css';

const formatDate = (iso) => new Date(iso).toLocaleString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const Announcements = () => {
    const { userId, role } = useAuth();
    const canCreate = role === 'Teacher' || role === 'Administrator';

    const { data, isLoading, error } = useGetAllAnnouncementsQuery();
    const [createAnnouncement, { isLoading: isCreating }] = useCreateAnnouncementMutation();
    const [deleteAnnouncement] = useDeleteAnnouncementMutation();

    const [form, setForm] = useState({ title: '', content: '' });
    const announcements = data?.result || [];

    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await createAnnouncement(form).unwrap();
            ToastrNotify('Duyuru yayınlandı.', 'success');
            setForm({ title: '', content: '' });
        } catch (err) {
            ToastrNotify(err?.data?.errorMessages?.[0] || 'Duyuru yayınlanırken bir hata oluştu.', 'error');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteAnnouncement(id).unwrap();
            ToastrNotify('Duyuru silindi.', 'success');
        } catch (err) {
            ToastrNotify(err?.data?.errorMessages?.[0] || 'Duyuru silinirken bir hata oluştu.', 'error');
        }
    };

    return (
        <div>
            <div className="ax-page-top">
                <div><h1>Duyurular</h1></div>
            </div>

            {canCreate && (
                <div className="ax-card" style={{ marginBottom: 'var(--space-5)' }}>
                    <div className="ax-card-head"><h3>Yeni Duyuru</h3></div>
                    <div className="ax-card-body">
                        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                            <div className="ax-field">
                                <label htmlFor="title">Başlık</label>
                                <input id="title" name="title" value={form.title} onChange={handleChange} required maxLength={200} />
                            </div>
                            <div className="ax-field">
                                <label htmlFor="content">İçerik</label>
                                <textarea id="content" name="content" rows={4} value={form.content} onChange={handleChange} required maxLength={4000} style={{ resize: 'vertical' }} />
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <button type="submit" className="ax-btn ax-btn-primary" disabled={isCreating}>
                                    {isCreating ? 'Yayınlanıyor…' : 'Yayınla'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isLoading && <LoadingState text="Duyurular yükleniyor…" />}
            {!isLoading && error && <ErrorState text="Duyurular alınamadı." />}

            {!isLoading && !error && (
                announcements.length === 0 ? (
                    <EmptyState icon="📣" title="Henüz duyuru yok" />
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                        {announcements.map((a) => (
                            <div key={a.id} className="ax-card">
                                <div className="ax-card-body">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                                        <div>
                                            <h3 style={{ fontSize: 'var(--text-lg)' }}>{a.title}</h3>
                                            <div style={{ fontSize: 12, color: 'var(--ink-faint)', marginTop: 4 }}>
                                                {a.authorName} · <span className="tabular">{formatDate(a.datePosted)}</span>
                                            </div>
                                        </div>
                                        {(role === 'Administrator' || a.authorId === userId) && (
                                            <button className="ax-btn ax-btn-ghost" onClick={() => handleDelete(a.id)}>Sil</button>
                                        )}
                                    </div>
                                    <p style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)', whiteSpace: 'pre-wrap' }}>{a.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );
};

export default Announcements;
