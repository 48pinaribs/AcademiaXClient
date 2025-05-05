import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const teacherApi = createApi({
    reducerPath: "teacherApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://localhost:7111/api/teacher/",
    }),
    tagTypes: ["Teacher"],
    endpoints: (builder) => ({
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
    useGetTeacherProfileQuery,
    useGetTeacherCoursesQuery,
    useUpdateTeacherProfileMutation,
    useAssignStudentToCourseMutation,
} = teacherApi;

export default teacherApi;
