import React, { useState } from 'react';
import StudentList from '../../Components/StudentList';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import SearchInput from '../../Components/SearchInput';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const AdminStudentPage = () => {
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
                All Students
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
                    Add Student
                </Button>
            </Stack>

            <StudentList searchTerm={searchTerm} />
        </Box>
    );
};

export default AdminStudentPage;
