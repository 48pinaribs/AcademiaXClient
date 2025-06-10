import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, Spin, Flex } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetCourseByIdQuery, useUpdateCourseMutation } from '../Api/courseApi';
import ToastrNotify from '../Helper/ToastrNotify';

const { Option } = Select;

const CourseEditForm = () => {
    const [form] = Form.useForm();
    const { courseId } = useParams();
    const navigate = useNavigate();

    const { data, isLoading } = useGetCourseByIdQuery(courseId);
    const course = data?.result; //  ÖNEMLİ: `result` içinden alıyoruz
    const [updateCourse] = useUpdateCourseMutation();
    console.log('Course:', course);

    useEffect(() => {
        if (course) {
            form.setFieldsValue(course);
        }
    }, [course, form]);

    const handleFinish = async (values) => {
        try {
            //console.log('Form değerleri:', values);
            await updateCourse({ ...values, courseId: Number(courseId) }).unwrap();
            ToastrNotify("Course updated successfully", "success");
            navigate('/admin/courses/');
        } catch (error) {
            console.error('Güncelleme hatası:', error);
        }
    };

    if (isLoading || !course) return <Spin tip="Kurs verisi yükleniyor..." />;

    return (
        <div style={{ maxWidth: 600, margin: '0 auto', marginTop: '3rem', padding: '2rem', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Form form={form} layout="vertical" onFinish={handleFinish}>
                <Form.Item name="name" label="Course Name" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="description" label="Description">
                    <Input.TextArea />
                </Form.Item>

                <Form.Item name="code" label="Code" rules={[{ required: true }]}>
                    <Input style={{ width: '30%', textAlign: "center" }} />
                </Form.Item>

                <Form.Item name="credits" label="Credits" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '30%', textAlign: "center" }} />
                </Form.Item>

                <Form.Item name="departmentId" label="Department" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '30%', textAlign: "center" }} />
                </Form.Item>

                <Form.Item name="semesterId" label="Semester" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '30%', textAlign: "center" }} />
                </Form.Item>

                <Form.Item name="totalStudents" label="TotalStudents" rules={[{ required: true }]}>
                    <InputNumber style={{ width: '30%', textAlign: "center" }} />
                </Form.Item>

                <Form.Item name="teacherId" label="Teacher ID" rules={[{ required: true }]}>
                    <Input style={{ width: '60%', textAlign: "center" }} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Update Course
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CourseEditForm;
