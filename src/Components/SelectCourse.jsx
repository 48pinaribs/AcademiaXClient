import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
    Checkbox,
    Card,
    Row,
    Col,
    Button,
    Typography,
    Spin,
    message,
} from "antd";
import {
    useGetAllCoursesQuery,
    useEnrollCourseMutation,
} from "../Api/courseApi";

const { Title } = Typography;

const CourseSelection = () => {
    const [selectedCourses, setSelectedCourses] = useState([]);

    // Dersleri API'den al
    const {
        data: coursesData,
        isLoading,
        isError,
    } = useGetAllCoursesQuery();

    // Kayıt mutation
    const [enrollCourse, { isLoading: isSubmitting }] =
        useEnrollCourseMutation();

    // Checkbox değişimi
    const handleCourseChange = (checkedValues) => {
        setSelectedCourses(checkedValues);
    };

    // Kayıt gönderimi
    const handleSubmit = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            message.error("Authentication token not found.");
            return;
        }

        let studentId;
        try {
            const decoded = jwtDecode(token);
            console.log("Decoded token:", decoded);
            studentId = decoded?.nameid;
            console.log("Student ID:", studentId);

            if (!studentId) throw new Error("Student ID not found in token.");
        } catch (err) {
            console.error("Token decoding error:", err);
            message.error("Invalid token.");
            return;
        }

        try {
            const selectedCourseList = coursesData?.result?.filter((course) =>
                selectedCourses.includes(course.code)
            );
            console.log("Selected courses:", selectedCourseList);

            for (const course of selectedCourseList) {
                const payload = {
                    studentId,
                    courseId: course.courseId,
                };
                await enrollCourse(payload).unwrap();
            }

            message.success("Successfully enrolled in selected courses.");
            setSelectedCourses([]);
        } catch (error) {
            console.error("Enrollment error:", error);
            message.error("Enrollment failed. Please try again.");
        }
    };

    // Yüklenme ve hata durumu
    if (isLoading) {
        return <Spin size="large" style={{ display: "block", margin: "100px auto" }} />;
    }

    if (isError || !Array.isArray(coursesData?.result)) {
        return <p style={{ textAlign: "center", marginTop: "100px" }}>Failed to load courses.</p>;
    }

    return (
        <Card
            title={<Title level={4}>Course Selection</Title>}
            style={{ maxWidth: 700, margin: "50px auto", borderRadius: 12 }}
        >
            <Checkbox.Group
                style={{ width: "100%" }}
                onChange={handleCourseChange}
                value={selectedCourses}
            >
                <Row gutter={[16, 16]}>
                    {coursesData.result.map((course) => (
                        <Col span={24} md={12} key={course.id}>
                            <Card bordered hoverable>
                                <Checkbox value={course.code}>
                                    <strong>{course.code}</strong> – {course.name} ({course.credit} credits)
                                </Checkbox>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Checkbox.Group>

            <Button
                type="primary"
                onClick={handleSubmit}
                disabled={selectedCourses.length === 0 || isSubmitting}
                loading={isSubmitting}
                style={{ marginTop: 24, width: "100%" }}
            >
                Enroll in Selected Courses
            </Button>
        </Card>
    );
};

export default CourseSelection;
