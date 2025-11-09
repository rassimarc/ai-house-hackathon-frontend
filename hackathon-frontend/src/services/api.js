import axios from "axios";

const api = axios.create({
	baseURL: "http://172.20.10.3:8001/", // Your backend URL
});

// Add auth token to requests (except for auth endpoints)
api.interceptors.request.use((config) => {
	// Don't add token for auth endpoints (login/signup)
	if (!config.url?.includes("/auth/")) {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
	}
	return config;
});

export default api;
