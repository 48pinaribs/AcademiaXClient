import { configureStore } from "@reduxjs/toolkit";

// Slice'lar
import { authReducer } from "../Storage/Redux/authSlice";

// API'ler
import courseApi from "../Api/courseApi";
import studentApi from "../Api/studentApi";
import teacherApi from "../Api/teacherApi";
import accountApi from "../Api/accountApi";
import gtfsApi from "../Api/gtfsApi";
import announcementApi from "../Api/announcementApi";

const store = configureStore({
    reducer: {
        // Slice reducer'lar
        authStore: authReducer,

        // API reducer'lar
        [courseApi.reducerPath]: courseApi.reducer,
        [studentApi.reducerPath]: studentApi.reducer,
        [teacherApi.reducerPath]: teacherApi.reducer,
        [accountApi.reducerPath]: accountApi.reducer,
        [gtfsApi.reducerPath]: gtfsApi.reducer,
        [announcementApi.reducerPath]: announcementApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            courseApi.middleware,
            studentApi.middleware,
            teacherApi.middleware,
            accountApi.middleware,
            gtfsApi.middleware,
            announcementApi.middleware
        ),
});

export default store;