import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://localhost:7111/api/User/",
    }),
    tagTypes: ["Auth"],
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
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
} = authApi;

export default authApi;
