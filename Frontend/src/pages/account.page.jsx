import { UserProfile } from "@clerk/clerk-react";

const AccountPage = () => {
	return (
		<div className="container w-full py-6 md:py-12 lg:py-16 mt-24 mx-auto">
			<div className="mb-6 space-y-3">
				<h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
					Manage Your Personal Information
				</h1>
				<div className="flex *:mt-4 w-96">
					<UserProfile />
				</div>
			</div>
		</div>
	);
};

export default AccountPage;
