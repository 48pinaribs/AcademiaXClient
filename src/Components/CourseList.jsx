import React from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse, Button, Popconfirm, message, theme } from 'antd';
import { useGetAllCoursesQuery, useDeleteCourseMutation } from '../Api/courseApi';
import { useNavigate } from 'react-router-dom';

const CourseList = () => {
    const { token } = theme.useToken();
    const { data: courses = [], isLoading } = useGetAllCoursesQuery();
    const [deleteCourse] = useDeleteCourseMutation();
    const navigate = useNavigate();

    const panelStyle = {
        marginBottom: 16,
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: 'none',
    };

    const handleEdit = (course) => {
        //console.log('Course objesi:', course); // bu satır kritik
        //console.log('Düzenlenecek kurs ID:', course.courseId); // bu satır kritik
        navigate(`/admin/courseeditform/${course.courseId}`);
    };

    const handleDelete = async (id) => {
        try {
            await deleteCourse(id).unwrap();
            message.success('Kurs silindi');
        } catch (error) {
            message.error('Silme başarısız oldu');
        }
    };

    const getItems = () =>
        courses?.result?.map((course, index) => ({
            key: index.toString(),
            label: `${course.code} - ${course.name}`,
            children: (
                <div>
                    <p>{course.description}</p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Button type="primary" onClick={() => handleEdit(course)}>
                            Düzenle
                        </Button>
                        <Popconfirm
                            title="Bu kursu silmek istediğinize emin misiniz?"
                            onConfirm={() => handleDelete(course.id)}
                            okText="Evet"
                            cancelText="Hayır"
                        >
                            <Button danger>Sil</Button>
                        </Popconfirm>
                    </div>
                </div>
            ),
            style: panelStyle,
        }));

    return (
        <Collapse
            bordered={false}
            loading={isLoading.toString()}
            expandIcon={({ isActive }) => (
                <CaretRightOutlined rotate={isActive ? 90 : 0} />
            )}
            style={{ background: token.colorBgContainer }}
            items={getItems()}
        />
    );
};

export default CourseList;
