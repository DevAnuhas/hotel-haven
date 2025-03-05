import { SignIn } from "@clerk/clerk-react";

function SignInPage() {
	return (
		<main className="flex items-center justify-center min-h-screen">
			<div className="w-full max-w-md px-6 py-4 mx-auto">
				<SignIn />
			</div>
		</main>
	);
}

export default SignInPage;
