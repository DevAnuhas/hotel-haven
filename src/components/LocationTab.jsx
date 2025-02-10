/* eslint-disable react/prop-types */
function LocationTab({ location, selectedLocation, onClick }) {
	const handleClick = () => {
		onClick(location);
	};

	if (selectedLocation === location) {
		return (
			<div
				className="text-base bg-gray-300 border rounded-md px-4 py-1 mb-4"
				onClick={handleClick}
			>
				{location}
			</div>
		);
	} else {
		return (
			<div
				className="text-base border rounded-md px-4 py-1 mb-4 cursor-pointer hover:bg-gray-100"
				onClick={handleClick}
			>
				{location}
			</div>
		);
	}
}

export default LocationTab;
