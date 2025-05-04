import React, { useState } from 'react';
import './Styles/Register.css';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';


const Register = () => {
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        userType: 'Student',
        email: '',
        image: '',
        firstName: '',
        lastName: '',
        phoneNumber: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Kayıt verileri:', formData);
        // Daha sonra .NET API’ye gönderilecek
    };

    return (
        <div className="outer-container">
            <div className="container custom-container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-8 col-lg-8 col-xl-6 login-box">
                        <div className="text-center">
                            <h3>Register</h3>
                            <p className="text-h3">ACADEMIA_X</p>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="firstName" className="form-control mt-3" placeholder="First Name" onChange={handleChange} />
                            <input type="text" name="lastName" className="form-control mt-3" placeholder="Last Name" onChange={handleChange} />
                            <input type="text" name="userName" className="form-control mt-3" placeholder="Username" onChange={handleChange} />
                            <input type="email" name="email" className="form-control mt-3" placeholder="Email" onChange={handleChange} />
                            <input type="password" name="password" className="form-control mt-3" placeholder="Password" onChange={handleChange} />
                            <input type="text" name="image" className="form-control mt-3" placeholder="Profile Image URL or file name" onChange={handleChange} />
                            <input type="tel" name="phoneNumber" className="form-control mt-3" placeholder="Phone Number" onChange={handleChange} />

                            <Box sx={{ minWidth: 120, marginTop: 2 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="demo-simple-select-label">UserType</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        //value={userType}
                                        label="UserType"
                                        onChange={handleChange}
                                        className="form-control"
                                    >
                                        <MenuItem >Student</MenuItem>
                                        <MenuItem >Teacher</MenuItem>
                                        <MenuItem >Admin</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <button type="submit" className="btn btn-primary mt-4 w-100">Register</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
