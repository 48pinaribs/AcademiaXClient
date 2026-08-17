import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

// MapView.jsx gibi RTK Query kullanmayan, doğrudan axios ile çağrı yapan yerler için.
// Hem hardcoded base URL'i merkezileştirir hem de Authorization header'ını otomatik ekler
// (backend GtfsController artık [Authorize] gerektiriyor).
const axiosClient = axios.create({ baseURL: API_BASE_URL });

axiosClient.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

axiosClient.interceptors.response.use(
	(response) => response,
	(error) => {
		if (error.response?.status === 401) {
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			if (window.location.pathname !== "/") {
				window.location.href = "/";
			}
		}
		return Promise.reject(error);
	}
);

export default axiosClient;
