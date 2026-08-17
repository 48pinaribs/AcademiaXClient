import { createApi } from "@reduxjs/toolkit/query/react";
import { createAuthorizedBaseQuery } from "./apiConfig";

const studentApi = createApi({
    reducerPath: "studentApi",
    baseQuery: createAuthorizedBaseQuery("student"),
    tagTypes: ["Student"],
    endpoints: (builder) => ({
        getAllStudents: builder.query({
            query: () => `all`, // Tüm öğrencileri getirir
            providesTags: ["Student"],
        }),
        getStudentById: builder.query({
            // Not: backend route'u /api/student/{studentId} — "get/" öneki yoktu, eklenince 404 alıyordu.
            query: (studentId) => `${studentId}`,
            providesTags: ["Student"],
        }),
        getStudentProfile: builder.query({
            query: (userId) => `profile/${userId}`,
            providesTags: ["Student"],
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

        // Admin'in bir öğrenciye danışman (Teacher) atamasını/kaldırmasını sağlar.
        assignAdvisor: builder.mutation({
            query: (data) => ({
                url: "advisor",
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Student"],
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
    useAssignAdvisorMutation,
} = studentApi;

export default studentApi;
