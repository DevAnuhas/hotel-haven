import mongoose from "mongoose";
import connectDB from "./connect";
import Hotel from "../schemas/Hotel";
import Review from "../schemas/Review";
import Booking from "../schemas/Booking";
import { generateEmbeddings } from "../../application/embedding";
import ora from "ora";

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
			main: "https://www.thetrainline.com/cms/media/9183/france-paris-pullman-hotel-eiffel-tower-room-view.jpg?mode=crop&width=860&height=574&quality=70",
			gallery: [
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/514701466.jpg?k=75fe4e18ba1d95ea0ac8a0f32f41c3f3dc4e7fef18ce3a1bb7f689f3a85c1ed2&o=&hp=1",
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/20316301.jpg?k=58dd17d1b88b023ec75a1331cb85f020cc8adbbb40719d17d47e32d7d6bea164&o=&hp=1",
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/16858798.jpg?k=bbab413cf1cfe5e57ddba9d22741c76e901ed27754c32f4ce020b3eefe12fa20&o=&hp=1",
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/12657814.jpg?k=21d40d45458d7e3ed419ed7582b7e9c3bf3595e3659410fe2a463e9fec87e199&o=&hp=1",
			],
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
			main: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/521318898.jpg?k=cf1b7ead00d8271428a6efe6475c1d89e9d610148d6fd01db75e0047e61f91c0&o=&hp=1",
			gallery: [
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/521168487.jpg?k=72a88b3863fa7f367aab8d076c30cef03eab3406b4864684f15551ddaceabc60&o=&hp=1",
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/521168512.jpg?k=d22aae28b04e30b0bec632adfdb3cda1ec61ca8f332e801a676c1e246dc20921&o=&hp=1",
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/521168643.jpg?k=aca8a4be799e2aa7227026cfa907422cdb7a9c5968752723dda909dc58f83a3d&o=&hp=1",
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/521168647.jpg?k=a4ff254125fbf6cd2f984e62fe5df23391b05a888186d3af7e74989cb9db7303&o=&hp=1",
			],
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
			main: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/102142679.jpg?k=f215dca3addf46e3619df03d8536c624c5a8b24baf4cd433a52d7f25aab0af16&o=&hp=1",
			gallery: [
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/335113207.jpg?k=8af4c7bf178eb7a1b1632fe9f7eb166a4e5886286598f2f292ac070c5a4fc580&o=&hp=1",
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/335111274.jpg?k=64d9a5962a34bc89c02483bd0fe9d86d30c50a4993bef0a3b50f5e2e7528da11&o=&hp=1",
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/102142757.jpg?k=c1672629500f04f5750cda25f0d7261caca73fba25b84ea02e459e0023c79958&o=&hp=1",
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/10082830.jpg?k=619a67e89a46fb568563251e85f60cb8e45a39b8df6bfb6691c870879f0f00e3&o=&hp=1",
			],
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
			main: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/665305338.jpg?k=52cbf04c1172a2ef9a494dae427a1456542624a067c0e5aa629769c409f2a07a&o=&hp=1",
			gallery: [
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/665395136.jpg?k=85fedde2cc54168df5d67ad138e60c7ae4e79df2c890e30346572a04d9132dbc&o=&hp=1",
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/665401906.jpg?k=350a5e7c196932ab52f885848fc1e3970248a3a618334144bc6b0f98ec936b65&o=&hp=1",
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/665432961.jpg?k=203b409d50add1fc8b5783d0dda1caa3607f854181ea905a8498b0b5896791bf&o=&hp=1",
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/665433042.jpg?k=2cb519c66ab9f33e80f4f22bcf86029c2a4ac1f64fb4313a50208ed8ee763a1a&o=&hp=1",
			],
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
			main: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/175222138.jpg?k=69ca4b753fac2174156e747b94c13f6e199516eee18340b843961c16a5e54d81&o=&hp=1",
			gallery: [
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/196336802.jpg?k=f7d82d97dce79b4638fc3462456767f7eba4d2998cf7cc56e307d59f1352c823&o=&hp=1",
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/175097500.jpg?k=2af992fc527e079251d7f0925b8ef379489dc6ca01afadd771287b78d9ac33a4&o=&hp=1",
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/361764606.jpg?k=4cc53f35e7cd55b27167edb8542637784fbb56224ca912bfe8ed60632d3e24b8&o=&hp=1",
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/196336801.jpg?k=e2dbec8795fdcb826884025e7da0a49e9209b1b63de22f7cc25f792eb22f11e0&o=&hp=1",
			],
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
			main: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/661404801.jpg?k=bcbf94246d6c8f7e0c558fa8814b9ef6544cab4289c9a4f275bae4be8db8a2ac&o=&hp=1",
			gallery: [
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/661404632.jpg?k=8c1211d4229c497932d8b3e82a90461a099044d545a9ab4b9201d8b819ed8037&o=&hp=1",
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/661404561.jpg?k=87e8497e87b258ae9e1250e23ba5483f6eb30dc49ef28b3ef1c758e1d5f19577&o=&hp=1",
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/661404806.jpg?k=7cee066b47f902efb42d573f9c85aa0c59d54b815429f6663abcaeaccf6a04fa&o=&hp=1",
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/661404593.jpg?k=488501a75c32e0a2d76e7847c58cff58be363693f3ba532a4b8e088cc24fa136&o=&hp=1",
			],
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
			main: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/422597418.jpg?k=7c39e91ab8452394ef7ed8b9aa8d74ab99ac8027f840a8c0aa5fe5638a91e88d&o=&hp=1",
			gallery: [
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/346358199.jpg?k=fa96ea43d218d678e2e623c82a52b7f27b3760acd332998f01cb3fa1b14625e2&o=&hp=1",
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/346358152.jpg?k=b1800f0cbf8c44218ecdd10a8771f11f2328dcb4d3840d36f18ed8aa8dea54fd&o=&hp=1",
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/657991518.jpg?k=81c1797e4de6b584d0182856155b6ee33e1102a3d96f79f97d20994bcd89422a&o=&hp=1",
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/346358215.jpg?k=7213518252cef1bca0e94b992f226fa9e01b348435884070f2666e9162b8c57f&o=&hp=1",
			],
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
			main: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/167451187.jpg?k=4a5e46e6870d9b2742515e5dad19e9f3a78bb87487f9f67ef186e6ef3d1cd81e&o=&hp=1",
			gallery: [
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/200289810.jpg?k=21aaaf861342b115b33346e6188b3bbbafdbe885da284d14400c428873f347a0&o=&hp=1",
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/217689877.jpg?k=22fd77b686d968a908593862e74b39a233004f2eaaf7f6ab42b705435c151c76&o=&hp=1",
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/246387629.jpg?k=91de4150d388649f9da2e9646854f5dc0134184d6780acb56394ce18fc039503&o=&hp=1",
				"https://cf.bstatic.com/xdata/images/hotel/max1024x768/246388706.jpg?k=808174bccb8f148239594b49600776843f77a2c7739c5d6b1d2388d80768180a&o=&hp=1",
			],
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

const seedDB = async () => {
	// Connect to database
	try {
		await connectDB();
	} catch (error) {
		console.error("[ERROR DETAILS]", error);
		process.exit(1);
	}

	// Clear existing data
	const clearSpinner = ora("Clearing existing data...").start();
	try {
		await Hotel.deleteMany({});
		await Review.deleteMany({});
		await Booking.deleteMany({});
		clearSpinner.succeed("[SUCCESS] Existing data cleared");
	} catch (error) {
		clearSpinner.fail("[ERROR] Failed to clear existing data");
		console.error("[ERROR DETAILS]", error);
		process.exit(1);
	}

	// Seed hotels
	const hotelSpinner = ora("Seeding hotels...").start();
	try {
		const insertedHotels = await Hotel.insertMany(hotels);
		hotelSpinner.succeed(`[SUCCESS] Seeded ${insertedHotels.length} hotels`);

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

			return { ...review, hotelId };
		});

		// Seed reviews
		const reviewSpinner = ora("Seeding reviews...").start();
		try {
			const insertedReviews = await Review.insertMany(updatedReviews);
			reviewSpinner.succeed(
				`[SUCCESS] Seeded ${insertedReviews.length} reviews`
			);
		} catch (error) {
			reviewSpinner.fail("[ERROR] Failed to seed reviews");
			console.error("[ERROR DETAILS]", error);
			process.exit(1);
		}

		// Generate embeddings
		const embeddingSpinner = ora("Generating hotel embeddings...").start();
		try {
			await generateEmbeddings();
			embeddingSpinner.succeed("[SUCCESS] Hotel embeddings generated");
		} catch (error) {
			embeddingSpinner.fail("[ERROR] Failed to generate embeddings");
			console.error("[ERROR DETAILS]", error);
			process.exit(1);
		}

		// Close connection
		const closeSpinner = ora("Closing MongoDB connection...").start();
		try {
			await mongoose.connection.close();
			closeSpinner.succeed("[SUCCESS] Seeding completed and connection closed");
		} catch (error) {
			closeSpinner.fail("[ERROR] Failed to close connection");
			console.error("[ERROR DETAILS]", error);
			process.exit(1);
		}
	} catch (error) {
		console.error("[ERROR] Unexpected error during seeding:", error);
		process.exit(1);
	}
};

seedDB();
