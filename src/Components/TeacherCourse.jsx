import React from 'react';
import { useGetTeacherCoursesQuery } from '../Api/teacherApi';
import {
    Card,
    Typography,
    Row,
    Col,
    Spin,
    Alert,
    Button,
} from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const TeacherCourse = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const teacherId = decoded.nameid;

    const { data: courses, error, isLoading } = useGetTeacherCoursesQuery(teacherId);

    if (isLoading) return <Spin />;
    if (error) return <Alert message="Hata" description="Veri getirilemedi." type="error" />;
    if (!courses?.result?.length) return <Alert message="Ders bulunamadı." type="info" />;

    return (
        <div style={{ padding: '40px' }}>
            <Title level={2}>Derslerim</Title>
            <Row gutter={[24, 24]}>
                {courses.result.map((course) => (
                    <Col xs={24} sm={12} md={8} key={course.id}>
                        <Card
                            title={course.name}
                            bordered={false}
                            hoverable
                            actions={[
                                <Button type="link" onClick={() => navigate(`/courses/${course.id}`)}>
                                    Detay
                                </Button>,
                            ]}
                        >
                            <Text type="secondary">{course.description || 'Açıklama yok'}</Text>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export default TeacherCourse;
