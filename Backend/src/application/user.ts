import User from "../infrastructure/schemas/User";
import { Request, Response } from "express";

// Get all users
export const getUsers = async (req: Request, res: Response) => {
	const users = await User.find();
	res.status(200).json(users);
	return;
};

// Get a specific user (dynamic route)
export const getUserById = async (req: Request, res: Response) => {
	const userId = req.params.id;
	const user = await User.findById(userId);

	if (!user) {
		res.status(404).json({
			message: "User not found",
		});
		return;
	}

	res.status(200).json(user);
	return;
};

// Add a new user
export const createUser = async (req: Request, res: Response) => {
	const user = req.body;

	// Validate the request data
	if (!user.name || !user.email) {
		res.status(400).json({
			message: "Please enter all required fields",
		});
		return;
	}

	// Add the user
	await User.create({
		name: user.name,
		email: user.email,
	});

	// Return the response
	res.status(201).json({
		message: "User added successfully!",
	});
	return;
};

// Delete a user
export const deleteUser = async (req: Request, res: Response) => {
	const userId = req.params.id;
	const user = await User.findById(userId);

	// Validate the request
	if (!user) {
		res.status(404).json({
			message: "User not found",
		});
		return;
	}

	// Delete the user
	await User.findByIdAndDelete(userId);

	// Return the response
	res.status(200).json({
		message: `User ${userId} deleted successfully!`,
	});
	return;
};

// Update a user
export const updateUser = async (req: Request, res: Response) => {
	const userId = req.params.id;
	const updatedUser = req.body;
	const user = await User.findById(userId);

	// Validate the request
	if (!user) {
		res.status(404).json({
			message: "User not found",
		});
		return;
	}

	// Validate the request data
	if (!updatedUser.name || !updatedUser.email) {
		res.status(400).json({
			message: "Please enter all required fields",
		});
		return;
	}

	// Update the user
	await User.findByIdAndUpdate(userId, updatedUser);

	// Return the response
	res.status(200).json({
		message: `User ${userId} updated successfully!`,
	});
	return;
};
