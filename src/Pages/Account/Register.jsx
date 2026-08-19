import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterUserMutation } from '../../Api/accountApi';
import ToastrNotify from '../../Helper/ToastrNotify';
import '../../styles/theme.css';

const Register = () => {
    const [registerUser, { isLoading }] = useRegisterUserMutation();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    // Not: UserType seçimi kasıtlı olarak yok. Herkese açık kayıt backend tarafında
    // her zaman Student rolü veriyor (bkz. UserService.Register) — istemciden rol
    // seçtirmek daha önce herkesin kendini Administrator yapabilmesine izin veriyordu.
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        email: '',
        image: '',
        firstName: '',
        lastName: '',
        phoneNumber: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await registerUser(formData).unwrap();
            ToastrNotify("Kayıt başarılı, giriş yapabilirsiniz", "success");
            navigate('/');
        } catch (err) {
            const messages = err?.data?.errorMessages;
            setError(Array.isArray(messages) && messages.length ? messages.join(' ') : 'Kayıt sırasında bir hata oluştu.');
        }
    };

    return (
        <div className="ax-auth-screen">
            <div className="ax-auth-card" style={{ width: 420 }}>
                <div className="ax-auth-top">
                    <div className="ax-auth-mark">AcademiaX</div>
                    <div className="ax-auth-tag">Yeni öğrenci hesabı oluştur</div>
                </div>
                <form className="ax-auth-body" onSubmit={handleSubmit}>
                    <div className="ax-auth-note">
                        Buradan oluşturulan hesaplar Öğrenci rolüyle açılır. Öğretim üyesi/yönetici
                        hesapları yalnızca yönetici tarafından oluşturulabilir.
                    </div>

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
                        {isLoading ? 'Kaydediliyor…' : 'Kayıt Ol'}
                    </button>
                    <div className="ax-auth-foot">Zaten hesabın var mı? <Link to="/">Giriş yap</Link></div>
                </form>
            </div>
        </div>
    );
};

export default Register;
