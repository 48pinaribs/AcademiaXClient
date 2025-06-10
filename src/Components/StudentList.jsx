import React from 'react';
import { List, Avatar, Skeleton } from 'antd';
import { useGetAllStudentsQuery } from '../Api/studentApi';
import { useNavigate } from 'react-router-dom';

const StudentList = ({ searchTerm }) => {
    const { data: students = [], isLoading, error } = useGetAllStudentsQuery();
    const navigate = useNavigate();

    if (isLoading) {
        return <div>Yükleniyor...</div>;
    }

    if (error) {
        return <div>Hata oluştu: {error.message || 'Bilinmeyen hata'}</div>;
    }

    const filteredStudents = searchTerm
        ? students.result.filter(student =>
            student.id.toString().includes(searchTerm.trim()) ||
            student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : students.result;

    return (
        <List
            className="student-list"
            itemLayout="horizontal"
            dataSource={filteredStudents}
            renderItem={(item) => (
                <List.Item
                    actions={[
                        <a key="details" onClick={() => navigate(`/userdetail/${item.id}`)}>Detay</a>,
                    ]}
                >
                    <Skeleton avatar title={false} loading={false} active>
                        <List.Item.Meta
                            avatar={<Avatar src={`/images/students/${item.image}`} />}
                            title={item.fullName}
                            description={
                                <div><strong>Email:</strong> {item.email}</div>
                            }
                        />
                    </Skeleton>
                </List.Item>
            )}
        />
    );
};

export default StudentList;
