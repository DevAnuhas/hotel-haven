import { SignUp } from "@clerk/clerk-react";

function SignUpPage() {
	return (
		<main className="flex items-center justify-center min-h-screen">
			<div className="w-full max-w-md px-6 py-4 mx-auto">
				<SignUp />
			</div>
		</main>
	);
}
export default SignUpPage;
