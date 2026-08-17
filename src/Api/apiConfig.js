import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Tüm API dosyalarında ayrı ayrı hardcode edilmiş "https://localhost:7111" tekrarının
// tek kaynağı. Prod'a deploy ederken sadece REACT_APP_API_URL ortam değişkenini değiştirmek yeterli.
export const API_BASE_URL = process.env.REACT_APP_API_URL || "https://localhost:7111/api";

/**
 * localStorage'daki JWT'yi Authorization header'ı olarak ekler. Daha önce hiçbir
 * RTK Query çağrısı bunu yapmıyordu — backend authorization aktif olduğu için bu olmadan
 * (401 ile) hiçbir istek çalışmaz.
 * 401 alındığında oturumu temizleyip login sayfasına yönlendirir (süresi dolmuş/geçersiz token).
 */
export function createAuthorizedBaseQuery(pathSegment) {
	const rawBaseQuery = fetchBaseQuery({
		baseUrl: `${API_BASE_URL}/${pathSegment}/`,
		prepareHeaders: (headers) => {
			const token = localStorage.getItem("token");
			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
			return headers;
		},
	});

	return async (args, api, extraOptions) => {
		const result = await rawBaseQuery(args, api, extraOptions);

		if (result.error?.status === 401) {
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			if (typeof window !== "undefined" && window.location.pathname !== "/") {
				window.location.href = "/";
			}
		}

		return result;
	};
}
