import React from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import {
    Collapse,
    Button,
    Popconfirm,
    message,
    theme,
    Typography,
} from 'antd';
import {
    useGetEnrolledCoursesQuery,
    useUnenrollCourseMutation, // isteğe bağlı
} from '../Api/courseApi';
import { jwtDecode } from 'jwt-decode';

const { Title } = Typography;

const EnrolledCourse = () => {

    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const userId = decoded?.nameid;

    const { data: courses = [], isLoading } = useGetEnrolledCoursesQuery(userId);
    console.log('Enrolled courses:', courses);
    const [unenrollCourse] = useUnenrollCourseMutation();

    const panelStyle = {
        marginBottom: 16,
        background: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: 'none',
    };

    const handleUnenroll = async (courseId) => {
        try {
            await unenrollCourse(courseId).unwrap();
            message.success("You've successfully unenrolled from the course.");
        } catch (error) {
            message.error('Failed to unenroll.');
        }
    };

    const getItems = () =>
        courses?.result?.map((course, index) => ({
            key: index.toString(),
            label: `${course.code} - ${course.name}`,
            children: (
                <div>
                    <p><strong>Description:</strong> {course.description}</p>
                    <p><strong>Credits:</strong> {course.credit}</p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Popconfirm
                            title="Are you sure you want to unenroll from this course?"
                            onConfirm={() => handleUnenroll(course.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button danger>Unenroll</Button>
                        </Popconfirm>
                    </div>
                </div>
            ),
            style: panelStyle,
        }));

    return (
        <div style={{ maxWidth: 800, margin: '40px auto' }}>
            <Title level={3}>My Enrolled Courses</Title>
            <Collapse
                bordered={false}
                expandIcon={({ isActive }) => (
                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                )}
                style={{ background: token.colorBgContainer }}
                items={getItems()}
                loading={isLoading.toString()}
            />
        </div>
    );
};

export default EnrolledCourse;
