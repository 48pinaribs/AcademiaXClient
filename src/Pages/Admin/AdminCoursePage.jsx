import React from "react";
import CourseList from "../../Components/CourseList";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";

const AdminCoursePage = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/admin/addcourse');
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>🗂️ All Courses</h1>
            <Stack direction="row" display="flex" justifyContent="flex-end" mb={4}>
                <Button variant="contained" onClick={handleClick} startIcon={<AddIcon />}>
                    Add Course
                </Button>
            </Stack>
            <CourseList />
        </div>
    );
};

export default AdminCoursePage;
