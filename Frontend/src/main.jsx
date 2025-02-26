// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import RootLayout from "./layouts/root.layout";
import MainLayout from "./layouts/main.layout";
import HomePage from "./pages/home.page";
import LogInPage from "./pages/log-in.page";
import SignUpPage from "./pages/sign-up.page";
import HotelPage from "./pages/hotel.page";
import CreateHotelPage from "./pages/create-hotel.page";
import { store } from "./lib/store";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
	// <StrictMode>
	<Provider store={store}>
		<BrowserRouter>
			<Routes>
				<Route element={<RootLayout />}>
					<Route element={<MainLayout />}>
						<Route path="/" element={<HomePage />} />
						<Route path="/hotel/:id" element={<HotelPage />} />
						<Route path="/create-hotel" element={<CreateHotelPage />} />
					</Route>
					<Route path="/log-in" element={<LogInPage />} />
					<Route path="/sign-up" element={<SignUpPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</Provider>
	// </StrictMode>
);
