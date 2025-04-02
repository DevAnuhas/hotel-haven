import mongoose from "mongoose";
import connectDB from "./connect";
import Hotel from "../schemas/Hotel";
import Review from "../schemas/Review";

// Hotel data
const hotels = [
	{
		name: "Montmartre Majesty Hotel",
		description:
			"Stay in the heart of Paris, France, at the Montmartre Majesty Hotel, where elegance meets charm. Perfect for exploring iconic landmarks like the Eiffel Tower and the Louvre, this hotel offers a tranquil escape from the bustling city. With luxurious rooms starting at $160 per night, enjoy breathtaking rooftop views, exquisite French cuisine, and the romantic ambiance of Montmartre. Ideal for a dreamy city getaway.",
		location: { city: "Paris", country: "France" },
		contact: {
			phone: "+33 1 23 45 67 89",
			email: "info@montmartremajesty.com",
			website: "https://www.montmartremajesty.com",
		},
		category: "Upscale",
		starRating: 4,
		policies: {
			checkInTime: "15:00",
			checkOutTime: "11:00",
			cancellation: {
				freeCancellation: true,
				daysBeforeCheckIn: 2,
				penaltyFee: 50,
			},
			petsAllowed: false,
			extraBedPolicy: "Available upon request for $30 per night",
		},
		rooms: [
			{
				type: "Standard",
				name: "Classic Room",
				description: "A cozy room with a view of Montmartre streets.",
				bedType: "queen size",
				bedCount: 1,
				maxOccupancy: 2,
				hasBathroom: true,
				size: 25,
				basePrice: 160,
				amenities: ["Wi-Fi", "TV", "Minibar"],
			},
			{
				type: "Deluxe",
				name: "Rooftop Deluxe",
				description: "Spacious room with a private balcony and city views.",
				bedType: "king size",
				bedCount: 1,
				maxOccupancy: 3,
				hasBathroom: true,
				size: 40,
				basePrice: 220,
				amenities: ["Wi-Fi", "TV", "Minibar", "Coffee Maker", "Balcony"],
			},
		],
		images: {
			main: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/297840629.jpg?k=d20e005d5404a7bea91cb5fe624842f72b27867139c5d65700ab7f69396026ce&o=&hp=1",
			gallery: [],
		},
		rating: {
			average: 9.4,
			count: 2578,
			category: "Excellent",
			breakdown: {
				cleanliness: 9.5,
				comfort: 9.3,
				location: 9.6,
				facilities: 9.2,
				staff: 9.5,
				valueForMoney: 9.0,
			},
		},
		pricing: { currency: "USD", taxRate: 0.12, includeTaxInDisplay: true },
		amenities: {
			breakfastIncluded: true,
			freeAirportShuttle: false,
			freeWifi: true,
			freeParking: false,
			swimmingPool: false,
			petsAllowed: false,
			restaurant: true,
			bar: true,
			gym: false,
			spa: false,
		},
		isActive: true,
	},
	{
		name: "Versailles Vista Inn",
		description:
			"Located in the historic heart of Rome, Italy, Versailles Vista Inn offers a touch of Renaissance luxury. Explore the Colosseum and Vatican City by day and retreat to opulent comfort at night. Starting at $220 per night, guests enjoy fine Italian dining, elegant interiors, and a prime location for experiencing Rome’s timeless culture. Ideal for history buffs and luxury seekers.",
		location: { city: "Rome", country: "Italy" },
		contact: {
			phone: "+39 06 1234 5678",
			email: "contact@versaillesvista.it",
			website: "https://www.versaillesvista.it",
		},
		category: "Luxury",
		starRating: 5,
		policies: {
			checkInTime: "14:00",
			checkOutTime: "12:00",
			cancellation: {
				freeCancellation: true,
				daysBeforeCheckIn: 3,
				penaltyFee: 75,
			},
			petsAllowed: true,
			extraBedPolicy: "Extra bed available for $40 per night",
		},
		rooms: [
			{
				type: "Comfort",
				name: "Roman Comfort",
				description: "A comfortable room with classic Italian decor.",
				bedType: "double",
				bedCount: 2,
				maxOccupancy: 4,
				hasBathroom: true,
				size: 30,
				basePrice: 220,
				amenities: ["Wi-Fi", "TV", "Safe"],
			},
			{
				type: "Suite",
				name: "Renaissance Suite",
				description: "A luxurious suite with a separate living area.",
				bedType: "king size",
				bedCount: 1,
				maxOccupancy: 3,
				hasBathroom: true,
				size: 55,
				basePrice: 350,
				amenities: ["Wi-Fi", "TV", "Minibar", "Safe", "Living Area"],
			},
		],
		images: {
			main: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/60307464.jpg?k=67ae35316203e2ec82d8e02e0cef883217cce9c436da581528b94ad6dee8e393&o=&hp=1",
			gallery: [],
		},
		rating: {
			average: 9.4,
			count: 1356,
			category: "Excellent",
			breakdown: {
				cleanliness: 9.6,
				comfort: 9.5,
				location: 9.7,
				facilities: 9.3,
				staff: 9.4,
				valueForMoney: 9.0,
			},
		},
		pricing: { currency: "USD", taxRate: 0.22, includeTaxInDisplay: false },
		amenities: {
			breakfastIncluded: true,
			freeAirportShuttle: false,
			freeWifi: true,
			freeParking: true,
			swimmingPool: false,
			petsAllowed: true,
			restaurant: true,
			bar: true,
			gym: true,
			spa: false,
		},
		isActive: true,
	},
	{
		name: "Sydney Harbour Hotel",
		description:
			"Stay at Sydney Harbour Hotel and wake up to stunning harbour views in one of Australia’s most iconic destinations. Starting at $200 per night, enjoy rooftop dining, modern facilities, and close proximity to Darling Harbour and Sydney’s vibrant nightlife. Ideal for couples and city adventurers.",
		location: { city: "Sydney", country: "Australia" },
		contact: {
			phone: "+61 2 9876 5432",
			email: "reservations@sydneyharbourhotel.com",
			website: "https://www.sydneyharbourhotel.com",
		},
		category: "Upscale",
		starRating: 4,
		policies: {
			checkInTime: "15:00",
			checkOutTime: "11:00",
			cancellation: {
				freeCancellation: true,
				daysBeforeCheckIn: 1,
				penaltyFee: 60,
			},
			petsAllowed: false,
			extraBedPolicy: "Not available",
		},
		rooms: [
			{
				type: "Premium",
				name: "Harbour View Room",
				description: "A modern room with stunning views of Sydney Harbour.",
				bedType: "queen size",
				bedCount: 1,
				maxOccupancy: 2,
				hasBathroom: true,
				size: 35,
				basePrice: 200,
				amenities: ["Wi-Fi", "TV", "Minibar", "Harbour View"],
			},
			{
				type: "Suite",
				name: "Executive Suite",
				description:
					"A spacious suite with a private balcony overlooking the harbour.",
				bedType: "king size",
				bedCount: 1,
				maxOccupancy: 3,
				hasBathroom: true,
				size: 60,
				basePrice: 300,
				amenities: ["Wi-Fi", "TV", "Minibar", "Balcony", "Living Area"],
			},
		],
		images: {
			main: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/84555265.jpg?k=ce7c3c699dc591b8fbac1a329b5f57247cfa4d13f809c718069f948a4df78b54&o=&hp=1",
			gallery: [],
		},
		rating: {
			average: 9.6,
			count: 1023,
			category: "Excellent",
			breakdown: {
				cleanliness: 9.7,
				comfort: 9.5,
				location: 9.8,
				facilities: 9.4,
				staff: 9.6,
				valueForMoney: 9.3,
			},
		},
		pricing: { currency: "USD", taxRate: 0.1, includeTaxInDisplay: true },
		amenities: {
			breakfastIncluded: false,
			freeAirportShuttle: false,
			freeWifi: true,
			freeParking: true,
			swimmingPool: true,
			petsAllowed: false,
			restaurant: true,
			bar: true,
			gym: true,
			spa: false,
		},
		isActive: true,
	},
	{
		name: "Parisian Palace",
		description:
			"Experience ultimate luxury at Parisian Palace, a gem in the heart of Paris, France. For $320 per night, immerse yourself in timeless elegance with grand interiors, Michelin-star dining, and breathtaking views of the Seine. Perfect for a romantic escape or a refined city retreat.",
		location: { city: "Paris", country: "France" },
		contact: {
			phone: "+33 1 98 76 54 32",
			email: "reservations@parisianpalace.fr",
			website: "https://www.parisianpalace.fr",
		},
		category: "Luxury",
		starRating: 5,
		policies: {
			checkInTime: "14:00",
			checkOutTime: "12:00",
			cancellation: {
				freeCancellation: true,
				daysBeforeCheckIn: 3,
				penaltyFee: 100,
			},
			petsAllowed: true,
			extraBedPolicy: "Extra bed available for $50 per night",
		},
		rooms: [
			{
				type: "Deluxe",
				name: "Seine View Deluxe",
				description: "Elegant room with stunning views of the Seine River.",
				bedType: "king size",
				bedCount: 1,
				maxOccupancy: 2,
				hasBathroom: true,
				size: 45,
				basePrice: 320,
				amenities: ["Wi-Fi", "TV", "Minibar", "River View"],
			},
			{
				type: "Suite",
				name: "Royal Suite",
				description:
					"A grand suite with a separate lounge and private terrace.",
				bedType: "king size",
				bedCount: 1,
				maxOccupancy: 4,
				hasBathroom: true,
				size: 70,
				basePrice: 500,
				amenities: ["Wi-Fi", "TV", "Minibar", "Terrace", "Lounge Area"],
			},
		],
		images: {
			main: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/308794596.jpg?k=76bbd047a4f3773844efb15819a637f10fb98671244760fcd69cf26d1073b797&o=&hp=1",
			gallery: [],
		},
		rating: {
			average: 9.8,
			count: 2135,
			category: "Excellent",
			breakdown: {
				cleanliness: 9.9,
				comfort: 9.8,
				location: 9.7,
				facilities: 9.8,
				staff: 9.9,
				valueForMoney: 9.6,
			},
		},
		pricing: { currency: "USD", taxRate: 0.2, includeTaxInDisplay: false },
		amenities: {
			breakfastIncluded: true,
			freeAirportShuttle: false,
			freeWifi: true,
			freeParking: false,
			swimmingPool: false,
			petsAllowed: true,
			restaurant: true,
			bar: true,
			gym: true,
			spa: true,
		},
		isActive: true,
	},
	{
		name: "Elysée Retreat",
		description:
			"Immerse yourself in Kyoto’s serene beauty at Elysée Retreat, a sanctuary of peace and tradition. Discover the charm of Japanese gardens, historic temples, and tea ceremonies, all just steps away. For $150 per night, indulge in authentic Kyoto hospitality, minimalistic elegance, and an unforgettable cultural experience tailored for nature lovers and tranquility seekers.",
		location: { city: "Kyoto", country: "Japan" },
		contact: {
			phone: "+81 75 123 4567",
			email: "info@elyseeretreat.jp",
			website: "https://www.elyseeretreat.jp",
		},
		category: "Midscale",
		starRating: 4,
		policies: {
			checkInTime: "15:00",
			checkOutTime: "10:00",
			cancellation: {
				freeCancellation: true,
				daysBeforeCheckIn: 2,
				penaltyFee: 40,
			},
			petsAllowed: false,
			extraBedPolicy: "Not available",
		},
		rooms: [
			{
				type: "Standard",
				name: "Tatami Room",
				description:
					"Traditional Japanese room with tatami mats and garden views.",
				bedType: "twin",
				bedCount: 2,
				maxOccupancy: 2,
				hasBathroom: true,
				size: 20,
				basePrice: 150,
				amenities: ["Wi-Fi", "Tea Set", "Garden View"],
			},
			{
				type: "Premium",
				name: "Zen Premium",
				description: "A spacious room with a private onsen bath.",
				bedType: "queen size",
				bedCount: 1,
				maxOccupancy: 3,
				hasBathroom: true,
				size: 35,
				basePrice: 250,
				amenities: ["Wi-Fi", "Tea Set", "Private Onsen"],
			},
		],
		images: {
			main: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/606303798.jpg?k=514943d0025704b27396faf82af167468d8b50b98f311668f206f79ca36cb53d&o=&hp=1",
			gallery: [],
		},
		rating: {
			average: 9.6,
			count: 1236,
			category: "Excellent",
			breakdown: {
				cleanliness: 9.7,
				comfort: 9.5,
				location: 9.6,
				facilities: 9.4,
				staff: 9.8,
				valueForMoney: 9.5,
			},
		},
		pricing: { currency: "USD", taxRate: 0.1, includeTaxInDisplay: true },
		amenities: {
			breakfastIncluded: true,
			freeAirportShuttle: false,
			freeWifi: true,
			freeParking: false,
			swimmingPool: false,
			petsAllowed: false,
			restaurant: true,
			bar: false,
			gym: false,
			spa: true,
		},
		isActive: true,
	},
	{
		name: "Milan Central Suites",
		description:
			"Nestled in the fashion capital of Milan, Italy, Milan Central Suites combines style and comfort for an unforgettable stay. At $140 per night, enjoy proximity to the Duomo and Galleria Vittorio Emanuele II, making it perfect for shoppers and culture enthusiasts alike.",
		location: { city: "Milan", country: "Italy" },
		contact: {
			phone: "+39 02 3456 7890",
			email: "bookings@milancentralsuites.it",
			website: "https://www.milancentralsuites.it",
		},
		category: "Midscale",
		starRating: 3,
		policies: {
			checkInTime: "14:00",
			checkOutTime: "11:00",
			cancellation: {
				freeCancellation: true,
				daysBeforeCheckIn: 1,
				penaltyFee: 30,
			},
			petsAllowed: true,
			extraBedPolicy: "Extra bed available for $25 per night",
		},
		rooms: [
			{
				type: "Standard",
				name: "City Room",
				description: "A stylish room with a view of Milan’s bustling streets.",
				bedType: "double",
				bedCount: 1,
				maxOccupancy: 2,
				hasBathroom: true,
				size: 22,
				basePrice: 140,
				amenities: ["Wi-Fi", "TV", "Minibar"],
			},
			{
				type: "Comfort",
				name: "Fashion Comfort",
				description: "A chic room with extra space and modern decor.",
				bedType: "queen size",
				bedCount: 1,
				maxOccupancy: 3,
				hasBathroom: true,
				size: 30,
				basePrice: 180,
				amenities: ["Wi-Fi", "TV", "Minibar", "Desk"],
			},
		],
		images: {
			main: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/608273980.jpg?k=c7df20ffb25ae52b6a17037dc13f5e15b94a0fe253a9b9d0b656f6376eabec7d&o=&hp=1",
			gallery: [],
		},
		rating: {
			average: 9.0,
			count: 670,
			category: "Very Good",
			breakdown: {
				cleanliness: 9.1,
				comfort: 8.9,
				location: 9.5,
				facilities: 8.8,
				staff: 9.2,
				valueForMoney: 8.7,
			},
		},
		pricing: { currency: "USD", taxRate: 0.22, includeTaxInDisplay: false },
		amenities: {
			breakfastIncluded: false,
			freeAirportShuttle: false,
			freeWifi: true,
			freeParking: false,
			swimmingPool: false,
			petsAllowed: true,
			restaurant: false,
			bar: true,
			gym: false,
			spa: false,
		},
		isActive: true,
	},
	{
		name: "Loire Luxury Lodge",
		description:
			"Overlooking Sydney Harbour, Loire Luxury Lodge provides unmatched waterfront views and a vibrant city experience. From $350 per night, relax in modern luxury while enjoying proximity to Sydney Opera House and Bondi Beach. Whether you’re seeking adventure or relaxation, this hotel offers a harmonious blend of urban excitement and tranquil sophistication.",
		location: { city: "Sydney", country: "Australia" },
		contact: {
			phone: "+61 2 8765 4321",
			email: "contact@loireluxurylodge.com",
			website: "https://www.loireluxurylodge.com",
		},
		category: "Luxury",
		starRating: 5,
		policies: {
			checkInTime: "15:00",
			checkOutTime: "12:00",
			cancellation: {
				freeCancellation: true,
				daysBeforeCheckIn: 3,
				penaltyFee: 100,
			},
			petsAllowed: false,
			extraBedPolicy: "Extra bed available for $60 per night",
		},
		rooms: [
			{
				type: "Deluxe",
				name: "Harbour Deluxe",
				description: "A luxurious room with panoramic harbour views.",
				bedType: "king size",
				bedCount: 1,
				maxOccupancy: 2,
				hasBathroom: true,
				size: 50,
				basePrice: 350,
				amenities: ["Wi-Fi", "TV", "Minibar", "Harbour View"],
			},
			{
				type: "Suite",
				name: "Opera Suite",
				description:
					"An expansive suite with a private balcony and premium amenities.",
				bedType: "king size",
				bedCount: 1,
				maxOccupancy: 4,
				hasBathroom: true,
				size: 80,
				basePrice: 550,
				amenities: ["Wi-Fi", "TV", "Minibar", "Balcony", "Lounge Area"],
			},
		],
		images: {
			main: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/596257607.jpg?k=0b513d8fca0734c02a83d558cbad7f792ef3ac900fd42c7d783f31ab94b4062c&o=&hp=1",
			gallery: [],
		},
		rating: {
			average: 9.8,
			count: 985,
			category: "Excellent",
			breakdown: {
				cleanliness: 9.9,
				comfort: 9.8,
				location: 9.9,
				facilities: 9.7,
				staff: 9.8,
				valueForMoney: 9.6,
			},
		},
		pricing: { currency: "USD", taxRate: 0.1, includeTaxInDisplay: true },
		amenities: {
			breakfastIncluded: true,
			freeAirportShuttle: true,
			freeWifi: true,
			freeParking: true,
			swimmingPool: true,
			petsAllowed: false,
			restaurant: true,
			bar: true,
			gym: true,
			spa: true,
		},
		isActive: true,
	},
	{
		name: "Tokyo Tower Inn",
		description:
			"Discover the vibrant energy of Tokyo at Tokyo Tower Inn, located in the heart of Japan’s bustling capital. For $180 per night, guests can enjoy modern comforts, panoramic city views, and access to iconic attractions like Shibuya Crossing and the Imperial Palace. Ideal for foodies, tech enthusiasts, and urban explorers.",
		location: { city: "Tokyo", country: "Japan" },
		contact: {
			phone: "+81 3 5678 1234",
			email: "reservations@tokyotowerinn.jp",
			website: "https://www.tokyotowerinn.jp",
		},
		category: "Upscale",
		starRating: 4,
		policies: {
			checkInTime: "15:00",
			checkOutTime: "11:00",
			cancellation: {
				freeCancellation: true,
				daysBeforeCheckIn: 2,
				penaltyFee: 50,
			},
			petsAllowed: false,
			extraBedPolicy: "Extra bed available for $30 per night",
		},
		rooms: [
			{
				type: "Standard",
				name: "City View Room",
				description: "A modern room with views of Tokyo’s skyline.",
				bedType: "double",
				bedCount: 1,
				maxOccupancy: 2,
				hasBathroom: true,
				size: 25,
				basePrice: 180,
				amenities: ["Wi-Fi", "TV", "City View"],
			},
			{
				type: "Premium",
				name: "Tower Premium",
				description: "A spacious room with a direct view of Tokyo Tower.",
				bedType: "queen size",
				bedCount: 1,
				maxOccupancy: 3,
				hasBathroom: true,
				size: 40,
				basePrice: 260,
				amenities: ["Wi-Fi", "TV", "Minibar", "Tower View"],
			},
		],
		images: {
			main: "https://cf.bstatic.com/xdata/images/hotel/max1280x900/308797093.jpg?k=3a35a30f15d40ced28afacf4b6ae81ea597a43c90c274194a08738f6e760b596&o=&hp=1",
			gallery: [],
		},
		rating: {
			average: 9.2,
			count: 875,
			category: "Excellent",
			breakdown: {
				cleanliness: 9.3,
				comfort: 9.1,
				location: 9.5,
				facilities: 9.0,
				staff: 9.4,
				valueForMoney: 9.0,
			},
		},
		pricing: { currency: "USD", taxRate: 0.1, includeTaxInDisplay: false },
		amenities: {
			breakfastIncluded: false,
			freeAirportShuttle: false,
			freeWifi: true,
			freeParking: false,
			swimmingPool: false,
			petsAllowed: false,
			restaurant: true,
			bar: true,
			gym: false,
			spa: false,
		},
		isActive: true,
	},
];

const reviews = [
	// Montmartre Majesty Hotel
	{
		hotelId: new mongoose.Types.ObjectId("67ca858d5d41ceb3f44cc46b"), // Placeholder, replace with actual hotel _id
		userId: "user123",
		rating: 9,
		title: "A Charming Stay in Paris",
		comment:
			"The rooftop views were breathtaking, and the staff was incredibly helpful. The room was cozy and clean, though a bit small for the price.",
		date: new Date("2025-03-15"),
		verified: true,
	},
	{
		hotelId: new mongoose.Types.ObjectId("67ca858d5d41ceb3f44cc46b"),
		userId: "user456",
		rating: 10,
		title: "Perfect Romantic Getaway",
		comment:
			"Everything about this hotel screamed elegance. The French cuisine at the restaurant was divine, and the ambiance was unbeatable.",
		date: new Date("2025-02-20"),
		verified: true,
	},
	{
		hotelId: new mongoose.Types.ObjectId("67ca858d5d41ceb3f44cc46b"),
		userId: "user789",
		rating: 8,
		title: "Great Location, Slightly Pricey",
		comment:
			"Loved the proximity to the Eiffel Tower, but the cost felt a bit high for the standard room. Still, a lovely experience overall.",
		date: new Date("2025-01-10"),
		verified: false,
	},

	// Versailles Vista Inn
	{
		hotelId: new mongoose.Types.ObjectId("67ca858d5d41ceb3f44cc471"),
		userId: "user234",
		rating: 9,
		title: "Luxury in Rome",
		comment:
			"The Renaissance Suite was stunning, and the location near the Colosseum was perfect. Staff went above and beyond.",
		date: new Date("2025-03-01"),
		verified: true,
	},
	{
		hotelId: new mongoose.Types.ObjectId("67ca858d5d41ceb3f44cc471"),
		userId: "user567",
		rating: 10,
		title: "Unforgettable Experience",
		comment:
			"The Italian dining was exceptional, and the room felt like a palace. Highly recommend for history lovers!",
		date: new Date("2025-02-15"),
		verified: true,
	},
	{
		hotelId: new mongoose.Types.ObjectId("67ca858d5d41ceb3f44cc471"),
		userId: "user890",
		rating: 8,
		title: "Good but Noisy",
		comment:
			"Great hotel with beautiful interiors, but the street noise was a bit disruptive at night.",
		date: new Date("2025-01-25"),
		verified: false,
	},

	// Sydney Harbour Hotel
	{
		hotelId: new mongoose.Types.ObjectId("67ca858d5d41ceb3f44cc46e"),
		userId: "user345",
		rating: 10,
		title: "Stunning Harbour Views",
		comment:
			"Waking up to the harbour was a dream. The rooftop dining was a highlight—worth every penny!",
		date: new Date("2025-03-20"),
		verified: true,
	},
	{
		hotelId: new mongoose.Types.ObjectId("67ca858d5d41ceb3f44cc46e"),
		userId: "user678",
		rating: 9,
		title: "Fantastic Location",
		comment:
			"Close to everything we wanted to see in Sydney. The suite was spacious and modern.",
		date: new Date("2025-02-10"),
		verified: true,
	},
	{
		hotelId: new mongoose.Types.ObjectId("67ca858d5d41ceb3f44cc46e"),
		userId: "user901",
		rating: 8,
		title: "Nice Stay, Limited Breakfast",
		comment:
			"Loved the views and facilities, but breakfast options could be improved.",
		date: new Date("2025-01-05"),
		verified: false,
	},

	// Parisian Palace
	{
		hotelId: new mongoose.Types.ObjectId("67ca858d5d41ceb3f44cc472"),
		userId: "user012",
		rating: 10,
		title: "Pure Luxury",
		comment:
			"The Michelin-star dining and Seine views were unmatched. Best hotel I’ve ever stayed in!",
		date: new Date("2025-03-25"),
		verified: true,
	},
	{
		hotelId: new mongoose.Types.ObjectId("67ca858d5d41ceb3f44cc472"),
		userId: "user345",
		rating: 9,
		title: "Elegant and Refined",
		comment:
			"The Royal Suite was spectacular, though service was slightly slow at check-in.",
		date: new Date("2025-02-28"),
		verified: true,
	},
	{
		hotelId: new mongoose.Types.ObjectId("67ca858d5d41ceb3f44cc472"),
		userId: "user678",
		rating: 10,
		title: "A Dream Come True",
		comment:
			"Every detail was perfect. The spa and dining made this a truly luxurious stay.",
		date: new Date("2025-01-15"),
		verified: true,
	},

	// Elysée Retreat
	{
		hotelId: new mongoose.Types.ObjectId("67ca858d5d41ceb3f44cc470"),
		userId: "user123",
		rating: 9,
		title: "Peaceful Retreat",
		comment:
			"The tatami room was so calming, and the garden views were beautiful. Loved the tea ceremony!",
		date: new Date("2025-03-10"),
		verified: true,
	},
	{
		hotelId: new mongoose.Types.ObjectId("67ca858d5d41ceb3f44cc470"),
		userId: "user456",
		rating: 10,
		title: "Authentic Kyoto Experience",
		comment:
			"The private onsen was a highlight. Perfect blend of tradition and comfort.",
		date: new Date("2025-02-05"),
		verified: true,
	},
	{
		hotelId: new mongoose.Types.ObjectId("67ca858d5d41ceb3f44cc470"),
		userId: "user789",
		rating: 8,
		title: "Lovely but Remote",
		comment:
			"Great for tranquility, but a bit far from central Kyoto attractions.",
		date: new Date("2025-01-20"),
		verified: false,
	},

	// Milan Central Suites
	{
		hotelId: new mongoose.Types.ObjectId("67ca858d5d41ceb3f44cc46f"),
		userId: "user234",
		rating: 9,
		title: "Perfect for Shopping",
		comment:
			"Right near the Duomo—ideal for fashion lovers. The room was stylish and comfy.",
		date: new Date("2025-03-05"),
		verified: true,
	},
	{
		hotelId: new mongoose.Types.ObjectId("67ca858d5d41ceb3f44cc46f"),
		userId: "user567",
		rating: 8,
		title: "Good Value",
		comment: "Affordable and well-located, though the facilities were basic.",
		date: new Date("2025-02-15"),
		verified: true,
	},
	{
		hotelId: new mongoose.Types.ObjectId("67ca858d5d41ceb3f44cc46f"),
		userId: "user890",
		rating: 9,
		title: "Chic and Convenient",
		comment:
			"Loved the modern design and proximity to Galleria Vittorio Emanuele II.",
		date: new Date("2025-01-30"),
		verified: false,
	},

	// Loire Luxury Lodge
	{
		hotelId: new mongoose.Types.ObjectId("67ca858d5d41ceb3f44cc46c"),
		userId: "user345",
		rating: 10,
		title: "Unbeatable Views",
		comment:
			"The harbour views from the Opera Suite were incredible. Top-notch amenities!",
		date: new Date("2025-03-18"),
		verified: true,
	},
	{
		hotelId: new mongoose.Types.ObjectId("67ca858d5d41ceb3f44cc46c"),
		userId: "user678",
		rating: 9,
		title: "Luxury at Its Best",
		comment:
			"The pool and spa were fantastic, though parking was a bit tricky.",
		date: new Date("2025-02-25"),
		verified: true,
	},
	{
		hotelId: new mongoose.Types.ObjectId("67ca858d5d41ceb3f44cc46c"),
		userId: "user901",
		rating: 10,
		title: "Sydney Perfection",
		comment:
			"Close to the Opera House and Bondi Beach—everything was flawless.",
		date: new Date("2025-01-12"),
		verified: true,
	},

	// Tokyo Tower Inn
	{
		hotelId: new mongoose.Types.ObjectId("67ca858d5d41ceb3f44cc46d"),
		userId: "user012",
		rating: 9,
		title: "Great City Stay",
		comment:
			"Loved the view of Tokyo Tower and the vibrant location. Rooms were modern and clean.",
		date: new Date("2025-03-22"),
		verified: true,
	},
	{
		hotelId: new mongoose.Types.ObjectId("67ca858d5d41ceb3f44cc46d"),
		userId: "user345",
		rating: 8,
		title: "Fun but Crowded",
		comment: "Perfect for exploring Shibuya, but the hotel felt busy at times.",
		date: new Date("2025-02-18"),
		verified: true,
	},
	{
		hotelId: new mongoose.Types.ObjectId("67ca858d5d41ceb3f44cc46d"),
		userId: "user678",
		rating: 9,
		title: "Tech Lover’s Dream",
		comment:
			"The city views and proximity to tech hubs were amazing. Highly recommend!",
		date: new Date("2025-01-08"),
		verified: false,
	},
];

export default reviews;

const seedDB = async () => {
	try {
		await connectDB();

		// Clear existing data
		await Hotel.deleteMany({});
		await Review.deleteMany({});
		console.log("Existing data removed");

		// Insert hotels
		const insertedHotels = await Hotel.insertMany(hotels);
		console.log("Hotels seeded successfully");

		// Map hotel names to their inserted IDs
		const hotelIdMap = new Map<string, mongoose.Types.ObjectId>();
		insertedHotels.forEach((hotel) => {
			hotelIdMap.set(hotel.name, hotel._id);
		});

		// Update reviews with actual hotel IDs
		const updatedReviews = reviews.map((review) => {
			let hotelId: mongoose.Types.ObjectId | undefined;

			if (review.hotelId.toString() === "67ca858d5d41ceb3f44cc46b") {
				hotelId = hotelIdMap.get("Montmartre Majesty Hotel");
			} else if (review.hotelId.toString() === "67ca858d5d41ceb3f44cc471") {
				hotelId = hotelIdMap.get("Versailles Vista Inn");
			} else if (review.hotelId.toString() === "67ca858d5d41ceb3f44cc46e") {
				hotelId = hotelIdMap.get("Sydney Harbour Hotel");
			} else if (review.hotelId.toString() === "67ca858d5d41ceb3f44cc472") {
				hotelId = hotelIdMap.get("Parisian Palace");
			} else if (review.hotelId.toString() === "67ca858d5d41ceb3f44cc470") {
				hotelId = hotelIdMap.get("Elysée Retreat");
			} else if (review.hotelId.toString() === "67ca858d5d41ceb3f44cc46f") {
				hotelId = hotelIdMap.get("Milan Central Suites");
			} else if (review.hotelId.toString() === "67ca858d5d41ceb3f44cc46c") {
				hotelId = hotelIdMap.get("Loire Luxury Lodge");
			} else if (review.hotelId.toString() === "67ca858d5d41ceb3f44cc46d") {
				hotelId = hotelIdMap.get("Tokyo Tower Inn");
			}

			if (!hotelId) {
				throw new Error(`No hotel ID found for review: ${review.title}`);
			}

			return {
				...review,
				hotelId: hotelId,
			};
		});

		// Insert reviews
		await Review.insertMany(updatedReviews);
		console.log("Reviews seeded successfully");

		// Close connection
		await mongoose.connection.close();
		console.log("MongoDB connection closed");
	} catch (error) {
		console.error("Error seeding database:", error);
		process.exit(1);
	}
};

seedDB();
