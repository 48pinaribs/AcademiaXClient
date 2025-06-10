import React from 'react';
import {
    Button,
    Form,
    Input,
    InputNumber,
    Select,
    Typography,
    message,
} from 'antd';
import { useCreateCourseMutation } from '../Api/courseApi';

const { TextArea } = Input;
const { Title } = Typography;

const formItemLayout = {
    labelCol: { xs: { span: 24 }, sm: { span: 6 } },
    wrapperCol: { xs: { span: 24 }, sm: { span: 14 } },
};

const AddCourse = () => {

    const [form] = Form.useForm();
    const [createCourse, { isLoading }] = useCreateCourseMutation();

    const onFinish = async (values) => {
        try {
            await createCourse(values).unwrap();
            message.success('Course created successfully!');
            form.resetFields();
        } catch (error) {
            message.error('Failed to create course.');
            console.error(error);
        }
    };

    return (
        <div style={{ maxWidth: 700, margin: '50px auto' }}>
            <Title level={3}>➕ Add New Course</Title>
            <Form
                {...formItemLayout}
                form={form}
                name="add-course-form"
                onFinish={onFinish}
                layout="horizontal"
                initialValues={{}}
            >
                <Form.Item
                    label="Course Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter the course name' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Course Code"
                    name="code"
                    rules={[{ required: true, message: 'Please enter the course code' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Description"
                    name="description"
                    rules={[{ required: true, message: 'Please enter a description' }]}
                >
                    <TextArea rows={4} />
                </Form.Item>

                <Form.Item
                    label="Credits"
                    name="credits"
                    rules={[{ required: true, message: 'Please enter credit value' }]}
                >
                    <InputNumber min={1} max={30} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Department"
                    name="departmentId"
                    rules={[{ required: true, message: 'Please select a department' }]}
                >
                    {/* <Select placeholder="Select department">
                        {departments.map((dept) => (
                            <Select.Option key={dept.id} value={dept.id}>
                                {dept.name}
                            </Select.Option>
                        ))}
                    </Select> */}
                    <InputNumber min={1} max={30} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Semester"
                    name="semesterId"
                    rules={[{ required: true, message: 'Please select a semester' }]}
                >
                    {/* <Select placeholder="Select semester">
                        {semesters.map((sem) => (
                            <Select.Option key={sem.id} value={sem.id}>
                                {sem.name}
                            </Select.Option>
                        ))}
                    </Select> */}
                    <InputNumber min={1} max={30} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Teacher Id"
                    name="teacherId"
                    rules={[{ required: true, message: 'Please select a teacher' }]}
                >
                    {/* <Select placeholder="Select teacher">
                        {teachers.map((teacher) => (
                            <Select.Option key={teacher.id} value={teacher.id}>
                                {teacher.name}
                            </Select.Option>
                        ))}
                    </Select> */}
                    <Input />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
                    <Button type="primary" htmlType="submit" block>
                        Save Course
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddCourse;
