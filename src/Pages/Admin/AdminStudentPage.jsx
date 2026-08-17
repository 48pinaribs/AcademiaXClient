import React, { useState } from 'react';
import StudentList from '../../Components/StudentList';
import SearchInput from '../../Components/SearchInput';
import { useNavigate } from "react-router-dom";
import '../../styles/theme.css';

const AdminStudentPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div>
            <div className="ax-page-top">
                <div><h1>Öğrenciler</h1></div>
                <button className="ax-btn ax-btn-primary" onClick={() => navigate('/register')}>+ Öğrenci Ekle</button>
            </div>
            <div className="ax-search-bar">
                <SearchInput onSearch={setSearchTerm} placeholder="Ad, öğrenci no veya e-posta ara…" />
            </div>
            <StudentList searchTerm={searchTerm} />
        </div>
    );
};

export default AdminStudentPage;
