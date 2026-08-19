import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';
import ToastrNotify from '../../Helper/ToastrNotify';
import { useDispatch } from 'react-redux';
import { setLoggedInUser } from '../../Storage/Redux/authSlice';
import { useLoginUserMutation } from '../../Api/accountApi';
import '../../styles/theme.css';

const dashboardByRole = {
    Administrator: '/admin/dashboard',
    Teacher: '/teacher/dashboard',
    Student: '/student/dashboard',
};

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loginUser, { isLoading }] = useLoginUserMutation();

    const [formData, setFormData] = useState({ userName: '', password: '' });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await loginUser(formData).unwrap();
            const token = response?.result?.token;

            if (!token) {
                setError('Giriş başarısız');
                return;
            }

            // Backend Login response'unda ayrı bir "user" nesnesi yok, sadece email + token dönüyor.
            // Kullanıcı bilgisi (nameid/role) JWT claim'lerinden çıkarılır.
            const decoded = jwtDecode(token);

            localStorage.setItem('token', token);

            dispatch(setLoggedInUser({
                email: decoded.email,
                nameid: decoded.nameid,
                role: decoded.role,
                fullName: decoded.email,
            }));

            ToastrNotify("Giriş başarılı", "success");
            navigate(dashboardByRole[decoded.role] || '/profilepage');
        } catch (err) {
            setError(err?.data?.errorMessages?.[0] || 'Sunucuya bağlanılamadı veya kullanıcı adı/şifre hatalı');
        }
    };

    return (
        <div className="ax-auth-screen">
            <div className="ax-auth-card">
                <div className="ax-auth-top">
                    <div className="ax-auth-mark">AcademiaX</div>
                    <div className="ax-auth-tag">Üniversite Bilgi Sistemi</div>
                </div>
                <form className="ax-auth-body" onSubmit={handleLogin}>
                    <div className="ax-field">
                        <label htmlFor="userName">Kullanıcı Adı</label>
                        <input id="userName" type="text" name="userName" value={formData.userName} onChange={handleChange} autoFocus required />
                    </div>
                    <div className="ax-field">
                        <label htmlFor="password">Şifre</label>
                        <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>

                    {error && <div className="ax-error">{error}</div>}

                    <button type="submit" className="ax-btn ax-btn-primary ax-btn-block" disabled={isLoading}>
                        {isLoading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
                    </button>
                    <div className="ax-auth-foot">Hesabın yok mu? <Link to="/register">Kayıt ol</Link></div>
                </form>
            </div>
        </div>
    );
};

export default Login;
