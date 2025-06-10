import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const courseApi = createApi({
    reducerPath: "courseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://localhost:7111/api/course/",
    }),
    tagTypes: ["Course"],
    endpoints: (builder) => ({
        getAllCourses: builder.query({
            query: () => "all",
            providesTags: ["Course"],
        }),

        getCourseById: builder.query({
            query: (courseId) => `${courseId}`,
            providesTags: (result, error, id) => [{ type: 'Course', id }]
        }),

        createCourse: builder.mutation({
            query: (courseData) => ({
                url: "create",
                method: "POST",
                body: courseData,
            }),
            invalidatesTags: ["Course"],
        }),

        updateCourse: builder.mutation({
            query: (courseData) => ({
                url: "update",
                method: "PUT",
                body: courseData,
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Course', id: arg.courseId }
            ]
        }),

        deleteCourse: builder.mutation({
            query: (courseId) => ({
                url: `delete/${courseId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Course"],
        }),

        enrollCourse: builder.mutation({
            query: (enrollData) => ({
                url: "enroll",
                method: "POST",
                body: enrollData,
            }),
            invalidatesTags: ["Course"],
        }),

        unenrollCourse: builder.mutation({
            query: (unenrollData) => ({
                url: "unenroll",
                method: "POST",
                body: unenrollData,
            }),
            invalidatesTags: ["Course"],
        }),

        getEnrolledCourses: builder.query({
            query: (userId) => `enrolled/${userId}`,
        }),

        getAvailableCourses: builder.query({
            query: (userId) => `available/${userId}`,
        }),

        getStudentsByCourse: builder.query({
            query: (courseId) => `${courseId}/students`,
            transformResponse: (response) => response.result, // ← eğer response.result dönüyorsa!
        }),


    }),
});

export const {
    useGetAllCoursesQuery,
    useGetCourseByIdQuery,
    useCreateCourseMutation,
    useUpdateCourseMutation,
    useDeleteCourseMutation,
    useEnrollCourseMutation,
    useUnenrollCourseMutation,
    useGetEnrolledCoursesQuery,
    useGetAvailableCoursesQuery,
    useGetStudentsByCourseQuery
} = courseApi;

export default courseApi;
