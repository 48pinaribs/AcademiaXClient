import { createSlice } from "@reduxjs/toolkit";

const InitialState = {
    nameid: "",
    fullName: "",
    email: "",
    role: ""
};

const authSlice = createSlice({
    name: "auth",
    initialState: InitialState,
    reducers: {
        // Kullanıcı giriş yaptığında çağrılır
        setLoggedInUser: (state, action) => {
            state.email = action.payload.email;
            state.fullName = action.payload.fullName;
            state.nameid = action.payload.nameid;
            state.role = action.payload.role;
        }
    },
});

export const { setLoggedInUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
