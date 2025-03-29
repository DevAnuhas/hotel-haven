export const generateBookingId = ({ _id, hotel, checkInDate }: any) => {
	const hotelCode = hotel.name.slice(0, 3).toUpperCase();
	const date = new Date(checkInDate);
	const dateStr = date.toISOString().slice(2, 10).replace(/-/g, "");
	const counter = parseInt(_id.toString().substring(20, 24), 16);
	return `${hotelCode}${dateStr}-${counter}`;
};
