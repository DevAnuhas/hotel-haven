export const getHotels = async () => {
	//Promise pattern
	/* 	const res = fetch("http://localhost:3000/api/hotel", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});
	res
		.then((body) => {
			console.log(body);
			return body.json();
		})
		.then((data) => {
			return (data);
		})
		.catch((err) => {
			console.log(err);
		}); */

	// Async/Await pattern

	const res = await fetch("http://localhost:3000/api/hotel", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		throw new Error(`${res.status} - ${res.statusText}`);
	}

	const data = await res.json();
	return data;
};

export const getHotelById = async (id) => {
	const res = await fetch(`http://localhost:3000/api/hotel/${id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		throw new Error(`${res.status} - ${res.statusText}`);
	}

	const data = await res.json();
	return data;
};
