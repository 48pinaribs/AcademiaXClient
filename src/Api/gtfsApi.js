import { createApi } from "@reduxjs/toolkit/query/react";
import { createAuthorizedBaseQuery } from "./apiConfig";

// Kampüs ring (dolmuş) verisi — durak listesi ve bir durağın belirli yöndeki
// sefer saatleri. MapView.jsx hâlâ axiosClient ile çalışıyor (leaflet event
// handler'ları içinde); burası panolarda/özet kartlarda kullanılan yeni hook'lar için.
const gtfsApi = createApi({
    reducerPath: "gtfsApi",
    baseQuery: createAuthorizedBaseQuery("Gtfs"),
    tagTypes: ["Gtfs"],
    endpoints: (builder) => ({
        getStops: builder.query({
            query: () => "stops",
            providesTags: ["Gtfs"],
        }),
        getTrips: builder.query({
            query: () => "trips",
            providesTags: ["Gtfs"],
        }),
        getAllStopTimes: builder.query({
            query: () => "stop-times",
            providesTags: ["Gtfs"],
        }),
        getTimetable: builder.query({
            query: ({ stopId, directionId = 0 }) => `timetable?stopId=${stopId}&directionId=${directionId}`,
        }),

        // "A'dan B'ye nasıl giderim" rota planlayıcısı — bkz. GtfsService.GetRoutePlan.
        getRoutePlan: builder.query({
            query: ({ fromStopId, toStopId }) => `plan?fromStopId=${fromStopId}&toStopId=${toStopId}`,
        }),

        // --- Admin: ring yönetimi ---
        upsertStop: builder.mutation({
            query: (stop) => ({ url: "stops", method: "POST", body: stop }),
            invalidatesTags: ["Gtfs"],
        }),
        deleteStop: builder.mutation({
            query: (stopId) => ({ url: `stops/${stopId}`, method: "DELETE" }),
            invalidatesTags: ["Gtfs"],
        }),
        regenerateSchedule: builder.mutation({
            query: (params) => ({ url: "schedule/regenerate", method: "POST", body: params }),
            invalidatesTags: ["Gtfs"],
        }),
        deleteTrip: builder.mutation({
            query: (tripId) => ({ url: `trips/${tripId}`, method: "DELETE" }),
            invalidatesTags: ["Gtfs"],
        }),
    }),
});

export const {
    useGetStopsQuery,
    useGetTripsQuery,
    useGetAllStopTimesQuery,
    useGetTimetableQuery,
    useLazyGetRoutePlanQuery,
    useUpsertStopMutation,
    useDeleteStopMutation,
    useRegenerateScheduleMutation,
    useDeleteTripMutation,
} = gtfsApi;
export default gtfsApi;
