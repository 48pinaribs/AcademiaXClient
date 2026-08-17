import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Hooks/useAuth";

/**
 * Daha önce App.js'teki hiçbir route korumalı değildi — /admin/* dahil her sayfa
 * URL'yi bilen herkes tarafından açılabiliyordu (backend authorization da o zaman
 * kapalıydı, ikisi birlikte tam bir "broken access control" oluşturuyordu).
 *
 * allowedRoles verilmezse sadece giriş yapmış olmak yeterlidir.
 */
const ProtectedRoute = ({ allowedRoles, children }) => {
	const { isAuthenticated, role } = useAuth();
	const location = useLocation();

	if (!isAuthenticated) {
		return <Navigate to="/" replace state={{ from: location }} />;
	}

	if (allowedRoles && !allowedRoles.includes(role)) {
		return <Navigate to="/" replace />;
	}

	return children;
};

export default ProtectedRoute;
