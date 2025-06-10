import { configureStore } from "@reduxjs/toolkit";

// Slice'lar
import { authReducer } from "../Storage/Redux/authSlice";

// API'ler
import courseApi from "../Api/courseApi";
import studentApi from "../Api/studentApi";
import teacherApi from "../Api/teacherApi";
import accountApi from "../Api/accountApi";

const store = configureStore({
    reducer: {
        // Slice reducer'lar
        authStore: authReducer,

        // API reducer'lar
        [courseApi.reducerPath]: courseApi.reducer,
        [studentApi.reducerPath]: studentApi.reducer,
        [teacherApi.reducerPath]: teacherApi.reducer,
        [accountApi.reducerPath]: accountApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            courseApi.middleware,
            studentApi.middleware,
            teacherApi.middleware,
            accountApi.middleware
        ),
});

export default store;