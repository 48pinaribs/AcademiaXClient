import { createApi } from "@reduxjs/toolkit/query/react";
import { createAuthorizedBaseQuery } from "./apiConfig";

const teacherApi = createApi({
    reducerPath: "teacherApi",
    baseQuery: createAuthorizedBaseQuery("teacher"),
    tagTypes: ["Teacher"],
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
    }),
});

export const {
    useGetAllTeachersQuery,
    useGetTeacherByIdQuery,
    useGetTeacherProfileQuery,
    useGetTeacherCoursesQuery,
    useUpdateTeacherProfileMutation,
    useAssignStudentToCourseMutation,
} = teacherApi;

export default teacherApi;
