import { createRoot } from "react-dom/client";
import "./index.css";

import { store } from "./lib/store";
import { Provider } from "react-redux";
import { ClerkProvider } from "@clerk/clerk-react";

import App from "@/App";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
	throw new Error("Clerk publishable key is missing");
}

createRoot(document.getElementById("root")).render(
	<ClerkProvider
		publishableKey={PUBLISHABLE_KEY}
		signInUrl="/sign-in"
		signUpUrl="/sign-up"
		afterSignOutUrl={window.location.href}
	>
		<Provider store={store}>
			<App />
		</Provider>
	</ClerkProvider>
);
