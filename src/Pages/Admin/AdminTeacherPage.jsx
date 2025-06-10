import React from 'react'
import TeacherList from '../../Components/TeacherList'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import SearchInput from '../../Components/SearchInput';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


const AdminTeacherPage = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleClick = () => {
        navigate('/register');
    };

    const handleSearch = (text) => {
        setSearchTerm(text);
        console.log('Arama metni:', text);
    };

    return (
        <Box sx={{ padding: '2rem' }}>
            <Typography variant="h4" gutterBottom>
                All Teachers
            </Typography>

            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="space-between"
                alignItems={{ xs: 'stretch', sm: 'center' }}
                mb={4}
            >
                <SearchInput onSearch={handleSearch} />
                <Button
                    variant="contained"
                    onClick={handleClick}
                    startIcon={<AddIcon />}
                    sx={{ height: '40px' }}
                >
                    Add Teacher
                </Button>
            </Stack>

            <TeacherList searchTerm={searchTerm} />
        </Box>
    )
}

export default AdminTeacherPage
