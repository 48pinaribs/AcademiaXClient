import React, { useState } from 'react';
import './Styles/Login.css';
import { useNavigate } from "react-router-dom";
import ToastrNotify from '../../Helper/ToastrNotify';
import { useDispatch } from 'react-redux';
import { setLoggedInUser } from '../../Storage/Redux/authSlice';

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userName: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async () => {
        setError('');
        setSuccess('');

        try {
            const response = await fetch('https://localhost:7111/api/User/Login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                const token = data.result.token;
                const user = data.result.user;

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                // localStorage.setItem('token', data.result.token);

                // ✅ Redux store'a token ve user bilgilerini kaydet
                dispatch(setLoggedInUser({ token, user }));

                navigate("/profilepage");
                console.log(data);
                ToastrNotify("You are successfully logged in", "success");
                setSuccess('Giriş başarılı!');

            } else {
                setError(data.message || 'Giriş başarısız');
            }
        } catch (err) {
            setError('Sunucuya bağlanılamadı');
        }
    };

    return (
        <div className="outer-container">
            <div className="container custom-container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-8 col-xl-6 login-box">
                        <div className="row">
                            <div className="col text-center">
                                <h3>Login</h3>
                                <p className="text-h3">ACADEMIA_X</p>
                            </div>
                        </div>

                        <div className="row align-items-center">
                            <div className="col mt-4">
                                <input
                                    type="text"
                                    name="userName"
                                    className="form-control short-input"
                                    placeholder="UserName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="row align-items-center mt-4">
                            <div className="col">
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control short-input"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="row align-items-center mt-4">
                            <div className="col">
                                <button className="form-control short-input" onClick={handleLogin}>
                                    Submit
                                </button>
                            </div>
                        </div>

                        {error && <p className="text-danger mt-3 text-center">{error}</p>}
                        {success && <p className="text-success mt-3 text-center">{success}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
