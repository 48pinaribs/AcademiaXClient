import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllStudentsQuery } from '../Api/studentApi';
import { LoadingState, ErrorState, EmptyState } from './UI/States';
import '../styles/theme.css';

const initials = (fullName) => {
    const parts = (fullName || '').trim().split(/\s+/);
    return ((parts[0]?.[0] || '?') + (parts[1]?.[0] || '')).toUpperCase();
};

const StudentList = ({ searchTerm }) => {
    const { data, isLoading, error } = useGetAllStudentsQuery();
    const navigate = useNavigate();

    const students = data?.result || [];

    if (isLoading) return <LoadingState />;
    if (error) return <ErrorState />;
    if (!students.length) return <EmptyState icon="🎓" title="Kayıtlı öğrenci bulunamadı" />;

    const filtered = searchTerm
        ? students.filter((s) =>
            s.id.toString().includes(searchTerm.trim()) ||
            s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : students;

    return (
        <div className="ax-card">
            <div className="ax-card-body ax-table-wrap">
                {filtered.length === 0 ? (
                    <EmptyState icon="🔍" title="Aramanla eşleşen öğrenci yok" />
                ) : (
                    <table className="ax-table">
                        <thead><tr><th>Öğrenci</th><th>E-posta</th><th></th></tr></thead>
                        <tbody>
                            {filtered.map((s) => (
                                <tr key={s.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div className="ax-avatar">{initials(s.fullName)}</div>
                                            {s.fullName}
                                        </div>
                                    </td>
                                    <td>{s.email}</td>
                                    <td><button className="ax-btn ax-btn-ghost" onClick={() => navigate(`/userdetail/${s.id}`)}>Detay</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default StudentList;
