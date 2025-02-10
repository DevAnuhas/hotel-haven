import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import RootLayout from "./layouts/root.layout";
import MainLayout from "./layouts/main.layout";
import HomePage from "./pages/home.page";
import LogInPage from "./pages/log-in.page";
import SignUpPage from "./pages/sign-up.page";
import HotelPage from "./pages/hotel.page";

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route element={<RootLayout />}>
					<Route element={<MainLayout />}>
						<Route path="/" element={<HomePage />} />
						<Route path="/hotel/:id" element={<HotelPage />} />
					</Route>
					<Route path="/log-in" element={<LogInPage />} />
					<Route path="/sign-up" element={<SignUpPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
