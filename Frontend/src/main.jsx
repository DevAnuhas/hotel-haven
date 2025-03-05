// import { StrictMode } from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

import RootLayout from "./layouts/root.layout";
import MainLayout from "./layouts/main.layout";
import ProtectedLayout from "./layouts/protected.layout";
import AdminProtectedLayout from "./layouts/admin-protected.layout";

import HomePage from "./pages/home.page";
import SignInPage from "./pages/sign-in.page";
import SignUpPage from "./pages/sign-up.page";
import HotelPage from "./pages/hotel.page";
import CreateHotelPage from "./pages/create-hotel.page";
import AccountPage from "./pages/account.page";

import { store } from "./lib/store";
import { Provider } from "react-redux";
import { ClerkProvider } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
	throw new Error("Missing Clerk Publishable Key");
}

createRoot(document.getElementById("root")).render(
	// <StrictMode>
	<ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
		<Provider store={store}>
			<BrowserRouter>
				<Routes>
					<Route element={<RootLayout />}>
						<Route element={<MainLayout />}>
							<Route path="/" element={<HomePage />} />
							<Route path="/hotel/:id" element={<HotelPage />} />
							<Route element={<ProtectedLayout />}>
								<Route path="/account" element={<AccountPage />} />
							</Route>
							<Route element={<AdminProtectedLayout />}>
								<Route path="/create-hotel" element={<CreateHotelPage />} />
							</Route>
						</Route>
						<Route path="/sign-in" element={<SignInPage />} />
						<Route path="/sign-up" element={<SignUpPage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</Provider>
	</ClerkProvider>
	// </StrictMode>
);
