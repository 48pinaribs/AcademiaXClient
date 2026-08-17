import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateStaffUserMutation } from '../../Api/accountApi';
import ToastrNotify from '../../Helper/ToastrNotify';
import '../../styles/theme.css';

// Sadece Administrator'ın erişebildiği öğretmen hesabı oluşturma sayfası
// (bkz. App.js: /admin/addteacher, ProtectedRoute allowedRoles=["Administrator"]).
// Genel /register sayfası artık her zaman Student rolü verdiği için (bkz. UserService.Register),
// öğretmen hesabı açmanın tek yolu bu sayfa + backend'deki CreateStaffUser uç noktasıdır.
const AddTeacher = () => {
    const navigate = useNavigate();
    const [createStaffUser, { isLoading }] = useCreateStaffUserMutation();
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        email: '',
        image: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
        userType: 'Teacher',
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await createStaffUser(formData).unwrap();
            ToastrNotify('Öğretmen hesabı oluşturuldu', 'success');
            navigate('/admin/teachers');
        } catch (err) {
            const messages = err?.data?.errorMessages;
            setError(Array.isArray(messages) && messages.length ? messages.join(' ') : 'Hesap oluşturulurken bir hata oluştu.');
        }
    };

    return (
        <div>
            <div className="ax-page-top">
                <div><h1>Yeni Öğretmen Ekle</h1></div>
            </div>
            <div className="ax-card" style={{ maxWidth: 480 }}>
                <form className="ax-card-body" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div className="ax-field-row">
                        <div className="ax-field"><label htmlFor="firstName">Ad</label><input id="firstName" type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required /></div>
                        <div className="ax-field"><label htmlFor="lastName">Soyad</label><input id="lastName" type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required /></div>
                    </div>
                    <div className="ax-field"><label htmlFor="userName">Kullanıcı Adı</label><input id="userName" type="text" name="userName" value={formData.userName} onChange={handleInputChange} required minLength={3} /></div>
                    <div className="ax-field"><label htmlFor="email">E-posta</label><input id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} required /></div>
                    <div className="ax-field-row">
                        <div className="ax-field"><label htmlFor="phoneNumber">Telefon</label><input id="phoneNumber" type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} /></div>
                        <div className="ax-field"><label htmlFor="password">Şifre</label><input id="password" type="password" name="password" value={formData.password} onChange={handleInputChange} required minLength={8} /></div>
                    </div>

                    {error && <div className="ax-error">{error}</div>}

                    <button type="submit" className="ax-btn ax-btn-primary ax-btn-block" disabled={isLoading}>
                        {isLoading ? 'Oluşturuluyor…' : 'Öğretmen Ekle'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTeacher;
