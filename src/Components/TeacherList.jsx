import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllTeachersQuery } from '../Api/teacherApi';
import { LoadingState, ErrorState, EmptyState } from './UI/States';
import '../styles/theme.css';

const initials = (fullName) => {
    const parts = (fullName || '').trim().split(/\s+/);
    return ((parts[0]?.[0] || '?') + (parts[1]?.[0] || '')).toUpperCase();
};

const TeacherList = ({ searchTerm }) => {
    const { data, isLoading, error } = useGetAllTeachersQuery();
    const navigate = useNavigate();

    const teachers = data?.result || [];

    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState />;
    if (!teachers.length) return <EmptyState icon="👩‍🏫" title="Kayıtlı öğretmen bulunamadı" />;

    const filtered = searchTerm
        ? teachers.filter((t) =>
            t.id.toString().includes(searchTerm.trim()) ||
            t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : teachers;

    return (
        <div className="ax-card">
            <div className="ax-card-body ax-table-wrap">
                {filtered.length === 0 ? (
                    <EmptyState icon="🔍" title="Aramanla eşleşen öğretmen yok" />
                ) : (
                    <table className="ax-table">
                        <thead><tr><th>Öğretmen</th><th>E-posta</th><th></th></tr></thead>
                        <tbody>
                            {filtered.map((t) => (
                                <tr key={t.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div className="ax-avatar">{initials(t.fullName)}</div>
                                            {t.fullName}
                                        </div>
                                    </td>
                                    <td>{t.email}</td>
                                    <td><button className="ax-btn ax-btn-ghost" onClick={() => navigate(`/userdetail/${t.id}`)}>Detay</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default TeacherList;
