import { jwtDecode } from "jwt-decode";

/**
 * Header.jsx, ProfilePage.jsx ve SelectCourse.jsx'te ayrı ayrı tekrarlanan
 * "localStorage'dan token oku + decode et" mantığının tek kaynağı.
 * Backend'in ürettiği claim'ler (NameIdentifier/Email/Role), JwtSecurityTokenHandler'ın
 * varsayılan outbound claim map'i yüzünden decode edilince nameid/email/role olarak gelir.
 */
export function useAuth() {
	const token = localStorage.getItem("token");

	if (!token) {
		return { token: null, isAuthenticated: false, userId: null, role: null, email: null };
	}

	try {
		const decoded = jwtDecode(token);

		// exp saniye cinsinden Unix timestamp'tir; süresi dolmuş token'ı geçersiz say.
		if (decoded.exp && decoded.exp * 1000 < Date.now()) {
			return { token: null, isAuthenticated: false, userId: null, role: null, email: null };
		}

		return {
			token,
			isAuthenticated: true,
			userId: decoded.nameid,
			role: decoded.role,
			email: decoded.email,
		};
	} catch {
		// Bozuk/kurcalanmış token — geçersiz say, uygulamayı çökertme.
		return { token: null, isAuthenticated: false, userId: null, role: null, email: null };
	}
}
