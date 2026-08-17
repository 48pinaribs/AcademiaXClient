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
        }),
        getTimetable: builder.query({
            query: ({ stopId, directionId = 0 }) => `timetable?stopId=${stopId}&directionId=${directionId}`,
        }),
    }),
});

export const { useGetStopsQuery, useGetTimetableQuery } = gtfsApi;
export default gtfsApi;
