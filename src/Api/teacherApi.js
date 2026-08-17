import { createApi } from "@reduxjs/toolkit/query/react";
import { createAuthorizedBaseQuery } from "./apiConfig";

const teacherApi = createApi({
    reducerPath: "teacherApi",
    baseQuery: createAuthorizedBaseQuery("teacher"),
    tagTypes: ["Teacher", "Grades", "Attendance"],
    endpoints: (builder) => ({
        getAllTeachers: builder.query({
            query: () => `all`, // Tüm teacher'leri getirir
            providesTags: ["Teacher"],
        }),
        getTeacherById: builder.query({
            // Not: backend route'u /api/teacher/{teacherId} — "get/" öneki yoktu, eklenince 404 alıyordu.
            query: (teacherId) => `${teacherId}`,
            providesTags: ["Teacher"],
        }),
        getTeacherProfile: builder.query({
            query: (id) => `profile/${id}`,
        }),

        getTeacherCourses: builder.query({
            query: (teacherId) => `courses/${teacherId}`,
        }),

        updateTeacherProfile: builder.mutation({
            query: (profileData) => ({
                url: "update-profile",
                method: "PUT",
                body: profileData,
            }),
            invalidatesTags: ["Teacher"],
        }),

        assignStudentToCourse: builder.mutation({
            query: (assignData) => ({
                url: "assign-student",
                method: "POST",
                body: assignData,
            }),
            invalidatesTags: ["Teacher"],
        }),

        getTeacherMessages: builder.query({
            query: (teacherId) => `messages/${teacherId}`,
            providesTags: ["Teacher"],
        }),

        // --- Not girişi ---
        getCourseGrades: builder.query({
            query: (courseId) => `grades/${courseId}`,
            providesTags: ["Grades"],
        }),
        upsertGrade: builder.mutation({
            query: (data) => ({ url: "grades", method: "PUT", body: data }),
            invalidatesTags: ["Grades"],
        }),

        // --- Yoklama alma ---
        getCourseAttendance: builder.query({
            query: ({ courseId, date }) => `attendance/${courseId}?date=${date}`,
            providesTags: ["Attendance"],
        }),
        markAttendance: builder.mutation({
            query: (data) => ({ url: "attendance", method: "POST", body: data }),
            invalidatesTags: ["Attendance"],
        }),
    }),
});

export const {
    useGetAllTeachersQuery,
    useGetTeacherByIdQuery,
    useGetTeacherProfileQuery,
    useGetTeacherCoursesQuery,
    useUpdateTeacherProfileMutation,
    useAssignStudentToCourseMutation,
    useGetTeacherMessagesQuery,
    useGetCourseGradesQuery,
    useUpsertGradeMutation,
    useGetCourseAttendanceQuery,
    useMarkAttendanceMutation,
} = teacherApi;

export default teacherApi;
