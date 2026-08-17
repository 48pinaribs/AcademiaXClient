import React, { useState } from "react";
import CourseList from "../../Components/CourseList";
import SearchInput from "../../Components/SearchInput";
import { useNavigate } from "react-router-dom";
import '../../styles/theme.css';

const AdminCoursePage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div>
            <div className="ax-page-top">
                <div><h1>Kurslar</h1></div>
                <button className="ax-btn ax-btn-primary" onClick={() => navigate('/admin/addcourse')}>+ Yeni Kurs</button>
            </div>
            <div className="ax-search-bar">
                <SearchInput onSearch={setSearchTerm} placeholder="Kurs adı veya kodu ara…" />
            </div>
            <CourseList searchTerm={searchTerm} />
        </div>
    );
};

export default AdminCoursePage;
