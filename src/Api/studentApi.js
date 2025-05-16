import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const studentApi = createApi({
    reducerPath: "studentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://localhost:7111/api/student/",
    }),
    tagTypes: ["Student"],
    endpoints: (builder) => ({
        getAllStudents: builder.query({
            query: () => `all`, // Tüm öğrencileri getirir
            providesTags: ["Student"],
        }),
        getStudentById: builder.query({
            query: (studentId) => `get/${studentId}`, // Öğrenci ID'sine göre öğrenci bilgilerini getirir
            providesTags: ["Student"],
        }),
        getStudentProfile: builder.query({
            query: (userId) => `profile/${userId}`,
        }),

        getStudentCourses: builder.query({
            query: (studentId) => `courses/${studentId}`,
        }),

        getStudentGrades: builder.query({
            query: (studentId) => `grades/${studentId}`,
        }),

        enrollStudent: builder.mutation({
            query: (enrollData) => ({
                url: "enroll",
                method: "POST",
                body: enrollData,
            }),
            invalidatesTags: ["Student"],
        }),

        dropStudentCourse: builder.mutation({
            query: (dropData) => ({
                url: "drop",
                method: "POST",
                body: dropData,
            }),
            invalidatesTags: ["Student"],
        }),

        getStudentAttendance: builder.query({
            query: (studentId) => `attendance/${studentId}`,
        }),

        sendStudentMessage: builder.mutation({
            query: (messageData) => ({
                url: "message/send",
                method: "POST",
                body: messageData,
            }),
        }),
    }),
});

export const {
    useGetAllStudentsQuery,
    useGetStudentByIdQuery,
    useGetStudentProfileQuery,
    useGetStudentCoursesQuery,
    useGetStudentGradesQuery,
    useEnrollStudentMutation,
    useDropStudentCourseMutation,
    useGetStudentAttendanceQuery,
    useSendStudentMessageMutation,
} = studentApi;

export default studentApi;
