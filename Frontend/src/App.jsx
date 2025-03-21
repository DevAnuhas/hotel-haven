import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import ScrollToTop from "./components/ScrollToTop";

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

function App() {
	return (
		<BrowserRouter>
			<ScrollToTop />
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
	);
}

export default App;
