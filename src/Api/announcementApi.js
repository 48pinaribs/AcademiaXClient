import { createApi } from "@reduxjs/toolkit/query/react";
import { createAuthorizedBaseQuery } from "./apiConfig";

const announcementApi = createApi({
    reducerPath: "announcementApi",
    baseQuery: createAuthorizedBaseQuery("announcement"),
    tagTypes: ["Announcement"],
    endpoints: (builder) => ({
        getAllAnnouncements: builder.query({
            query: () => "all",
            providesTags: ["Announcement"],
        }),

        createAnnouncement: builder.mutation({
            query: (data) => ({ url: "create", method: "POST", body: data }),
            invalidatesTags: ["Announcement"],
        }),

        deleteAnnouncement: builder.mutation({
            query: (id) => ({ url: `delete/${id}`, method: "DELETE" }),
            invalidatesTags: ["Announcement"],
        }),
    }),
});

export const {
    useGetAllAnnouncementsQuery,
    useCreateAnnouncementMutation,
    useDeleteAnnouncementMutation,
} = announcementApi;

export default announcementApi;
