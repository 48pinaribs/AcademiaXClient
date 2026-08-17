import React, { useState } from 'react';
import TeacherList from '../../Components/TeacherList';
import SearchInput from '../../Components/SearchInput';
import { useNavigate } from "react-router-dom";
import '../../styles/theme.css';

const AdminTeacherPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div>
            <div className="ax-page-top">
                <div><h1>Öğretmenler</h1></div>
                <button className="ax-btn ax-btn-primary" onClick={() => navigate('/admin/addteacher')}>+ Öğretmen Ekle</button>
            </div>
            <div className="ax-search-bar">
                <SearchInput onSearch={setSearchTerm} placeholder="Ad veya e-posta ara…" />
            </div>
            <TeacherList searchTerm={searchTerm} />
        </div>
    );
};

export default AdminTeacherPage;
