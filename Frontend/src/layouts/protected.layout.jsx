import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router";

const ProtectedLayout = () => {
	const { isSignedIn, isLoaded } = useUser();

	if (!isSignedIn && isLoaded) {
		return <Navigate to="/sign-in" />;
	}

	return <Outlet />;
};

export default ProtectedLayout;
