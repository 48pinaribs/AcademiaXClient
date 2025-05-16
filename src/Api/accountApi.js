import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const accountApi = createApi({
    reducerPath: "accountApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://localhost:7111/api/User/",
    }),
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

        getUserById: builder.query({
            query: (id) => `${id}`,
            providesTags: ['Account'],
        }),

        getUserType: builder.query({
            query: (id) => `GetUserType/${id}`
        }),

    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useGetUserByIdQuery,
    useGetUserTypeQuery,
} = accountApi;

export default accountApi;
