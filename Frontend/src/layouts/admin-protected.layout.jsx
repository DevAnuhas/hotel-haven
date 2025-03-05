import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router";

const AdminProtectedLayout = () => {
	const { user, isLoaded } = useUser();

	if (user?.publicMetadata.role !== "admin" && isLoaded) {
		return <Navigate to="/sign-in" />;
	}

	return <Outlet />;
};

export default AdminProtectedLayout;
