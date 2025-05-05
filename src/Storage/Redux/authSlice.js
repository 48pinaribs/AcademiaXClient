import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,    // örn: { id, name, role, email }
    token: null,   // JWT token
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Kullanıcı giriş yaptığında çağrılır
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },

        // Kullanıcı çıkış yaptığında çağrılır
        clearCredentials: (state) => {
            state.user = null;
            state.token = null;
        },
    },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export const authReducer = authSlice.reducer;
