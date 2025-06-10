import React from 'react';
import { useGetStudentsByCourseQuery } from '../Api/courseApi';
import { Spin, List, Alert } from 'antd';

const CourseStudents = ({ courseId }) => {
    const { data: students, isLoading, error } = useGetStudentsByCourseQuery(courseId);
    console.log(students);

    if (isLoading) return <Spin tip="Öğrenciler yükleniyor..." />;

    if (error) return <Alert message="Hata" description="Öğrenciler getirilemedi." type="error" />;

    if (!students?.length) return <Alert message="Bu kursa kayıtlı öğrenci yok." type="info" />;

    return (
        <List
            header={<strong>Kayıtlı Öğrenciler</strong>}
            bordered
            dataSource={students}
            renderItem={(student) => (
                <List.Item>
                    {student.firstName} {student.lastName} — {student.email}
                </List.Item>
            )}
        />
    );
};

export default CourseStudents;
