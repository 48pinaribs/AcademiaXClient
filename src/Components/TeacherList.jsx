import React from 'react';
import { List, Avatar, Skeleton, Button } from 'antd';
import { useGetAllTeachersQuery } from '../Api/teacherApi'; // kendi path'ine göre düzelt
import { useNavigate } from 'react-router-dom';

const TeacherList = ({ searchTerm }) => {
    const { data: teachers = [], isLoading, error } = useGetAllTeachersQuery();
    console.log(teachers);
    const navigate = useNavigate();

    if (isLoading) {
        return <div>Yükleniyor...</div>;
    }

    if (error) {
        return <div>Hata oluştu: {error.message || 'Bilinmeyen hata'}</div>;
    }

    // Arama metni ile filtreleme
    const filteredTeachers = searchTerm
        ? teachers.result.filter(teacher =>
            teacher.id.toString().includes(searchTerm.trim()) ||
            teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : teachers.result;


    return (
        <List
            className="teacher-list"
            loading={isLoading}
            itemLayout="horizontal"
            dataSource={filteredTeachers}
            renderItem={(item) => (
                <List.Item
                    actions={[
                        // <a key="edit" onClick={() => alert(`Düzenle: ${item.fullName}`)}>Düzenle</a>,
                        <a key="details" onClick={() => navigate(`/userdetail/${item.id}`)}>Detay</a>,
                    ]}
                >
                    <Skeleton avatar title={false} loading={false} active>
                        <List.Item.Meta
                            avatar={<Avatar src={`/images/students/${item.image}`} />}
                            title={item.fullName}
                            description={
                                <>
                                    <div><strong>Email:</strong> {item.email}</div>
                                </>
                            }
                        />
                    </Skeleton>
                </List.Item>
            )}
        />
    );
};

export default TeacherList;
