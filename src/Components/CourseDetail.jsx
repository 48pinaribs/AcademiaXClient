import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Divider } from 'antd';
import CourseStudents from './CourseStudents';

const { Title } = Typography;

const CourseDetail = () => {
    const { id: courseId } = useParams();

    return (
        <div style={{ padding: '40px' }}>
            <Title level={2}>Kurs Detayı</Title>

            <Divider>Kayıtlı Öğrenciler</Divider>
            <CourseStudents courseId={courseId} />

            {/* İLERİDE buraya notlar, yoklama, duyurular vb. eklenebilir */}
        </div>
    );
};

export default CourseDetail;
