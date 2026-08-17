import { createApi } from "@reduxjs/toolkit/query/react";
import { createAuthorizedBaseQuery } from "./apiConfig";

const accountApi = createApi({
    reducerPath: "accountApi",
    baseQuery: createAuthorizedBaseQuery("User"),
    tagTypes: ["Account"],
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (registerData) => ({
                url: "Register",
                method: "POST",
                body: registerData,
            }),
        }),

        loginUser: builder.mutation({
            query: (loginData) => ({
                url: "Login",
                method: "POST",
                body: loginData,
            }),
        }),

        // Sadece Administrator çağırabilir — backend UserController.CreateStaffUser
        // [Authorize(Roles = "Administrator")] ile korunuyor.
        createStaffUser: builder.mutation({
            query: (staffData) => ({
                url: "CreateStaffUser",
                method: "POST",
                body: staffData,
            }),
        }),

        getUserById: builder.query({
            query: (id) => `${id}`,
            providesTags: ['Account'],
        }),

        updateProfile: builder.mutation({
            query: (profileData) => ({
                url: "update-profile",
                method: "PUT",
                body: profileData,
            }),
            invalidatesTags: ['Account'],
        }),

        getUserType: builder.query({
            query: (id) => `GetUserType/${id}`
        }),
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useCreateStaffUserMutation,
    useGetUserByIdQuery,
    useGetUserTypeQuery,
    useUpdateProfileMutation,
} = accountApi;

export default accountApi;
