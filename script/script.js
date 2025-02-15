document.addEventListener("DOMContentLoaded", function () {
    const carTypeFilter = document.getElementById("carType");
    const priceRangeFilter = document.getElementById("priceRange");
    const transmissionFilter = document.getElementById("transmission");
    const searchInput = document.getElementById("searchCar");
    const carList = document.getElementById("carList");
    const cars = document.querySelectorAll(".car-item");

    function filterCars() {
        const selectedCarType = carTypeFilter.value;
        const selectedPriceRange = priceRangeFilter.value;
        const selectedTransmission = transmissionFilter.value;
        const searchQuery = searchInput.value.toLowerCase();

        cars.forEach((car) => {
            const carType = car.dataset.type;
            const carPrice = parseInt(car.dataset.price, 10);
            const carTransmission = car.dataset.transmission;
            const carTitle = car.querySelector(".card-title").textContent.toLowerCase();

            let matchesType = selectedCarType === "" || carType === selectedCarType;
            let matchesPrice = true;
            if (selectedPriceRange) {
                const [minPrice, maxPrice] = selectedPriceRange.split("-").map(Number);
                matchesPrice = carPrice >= minPrice && carPrice <= maxPrice;
            }
            let matchesTransmission = selectedTransmission === "" || carTransmission === selectedTransmission;
            let matchesSearch = searchQuery === "" || carTitle.includes(searchQuery);

            if (matchesType && matchesPrice && matchesTransmission && matchesSearch) {
                car.style.display = "block";
            } else {
                car.style.display = "none";
            }
        });
    }

    if (carTypeFilter && priceRangeFilter && transmissionFilter && searchInput) {
        carTypeFilter.addEventListener("change", filterCars);
        priceRangeFilter.addEventListener("change", filterCars);
        transmissionFilter.addEventListener("change", filterCars);
        searchInput.addEventListener("input", filterCars);

        filterCars();
    }

    // car reservation 

    const rentButtons = document.querySelectorAll(".buybutton");

    if (rentButtons) {
        rentButtons.forEach((button) => {
            button.addEventListener("click", function (event) {
                event.preventDefault();

                const card = button.closest(".car-item");
                const carDetails = {
                    image: card.querySelector("img").src,
                    name: card.querySelector(".card-title").innerText,
                    price: card.querySelector(".card-text").innerText,
                    transmission: card.dataset.transmission,
                    type: card.dataset.type,
                    status: card.dataset.status,
                    fuelType: "Petrol", // Assuming all cars use petrol
                    seats: 5, // Default seats
                };

                // Store car details in localStorage
                localStorage.setItem("selectedCar", JSON.stringify(carDetails));

                // Redirect to the reservation page
                window.location.href = "car-reservation.html";
            });
        });
    }

    const carDetails = JSON.parse(localStorage.getItem("selectedCar"));

    if (carDetails) {
        document.querySelector(".selectedcar").src = carDetails.image;
        document.querySelector(".selctedcarname").innerText = carDetails.name;
        document.querySelector(".selctedcarprice").innerText = carDetails.price;

        const detailsList = document.querySelectorAll(".list-group-item");
        detailsList[0].innerHTML = `<strong>Transmission:</strong> ${carDetails.transmission}`;
        detailsList[1].innerHTML = `<strong>Car Type:</strong> ${carDetails.type}`;
        detailsList[2].innerHTML = `<strong>Fuel Type:</strong> ${carDetails.fuelType}`;
        detailsList[3].innerHTML = `<strong>Seats:</strong> ${carDetails.seats}`;
        detailsList[4].innerHTML = `<strong>Status:</strong> <span class="badge bg-${carDetails.status === "available" ? "success" : "danger"}">${carDetails.status}</span>`;
    }

    const pickupDateInput = document.getElementById("pickupDate");
    const returnDateInput = document.getElementById("returnDate");
    const daysRentedInput = document.getElementById("daysrented");
    const pricePerDaySpan = document.getElementById("pricePerDay");
    const rentalDaysSpan = document.getElementById("rentalDays");
    const rentalCostSpan = document.getElementById("rentalCost");
    const taxAmountSpan = document.getElementById("taxAmount");
    const totalAmountSpan = document.getElementById("totalAmount");

    const form = document.querySelector("form");

    // Extract numeric price from "$80/day"
    let pricePerDay = 50; // Default price if not found
    if (carDetails?.price) {
        pricePerDay = parseInt(carDetails.price.replace(/[^0-9]/g, "")) || 50;
    }

    pricePerDaySpan.textContent = pricePerDay;

    function calculateDaysRented() {
        const pickupDate = new Date(pickupDateInput.value);
        const returnDate = new Date(returnDateInput.value);

        if (pickupDate && returnDate && returnDate > pickupDate) {
            const timeDiff = returnDate - pickupDate;
            const daysRented = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert ms to days
            daysRentedInput.value = daysRented;
            updateCost(daysRented);
        } else {
            daysRentedInput.value = "";
            updateCost(0);
        }
    }

    function updateCost(daysRented = 1) {
        const rentalCost = daysRented * pricePerDay;
        const securityDeposit = 200;
        const taxAmount = rentalCost * 0.10;
        const totalAmount = rentalCost + securityDeposit + taxAmount;

        // Update UI
        rentalDaysSpan.textContent = daysRented;
        rentalCostSpan.textContent = rentalCost.toFixed(2);
        taxAmountSpan.textContent = taxAmount.toFixed(2);
        totalAmountSpan.textContent = totalAmount.toFixed(2);
    }

    // Listen for date changes
    pickupDateInput.addEventListener("change", calculateDaysRented);
    returnDateInput.addEventListener("change", calculateDaysRented);

    // Handle form submission
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent page reload

        const daysRented = parseInt(daysRentedInput.value) || 1;


        // Generate a unique Booking ID
        const bookingID = `AZR-${Math.floor(100000 + Math.random() * 900000)}`;

        const reservationData = {
            bookingID: bookingID, // Store booking ID
            fullName: document.getElementById("fullName").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            pickupDate: pickupDateInput.value,
            returnDate: returnDateInput.value,
            daysRented: daysRented,
            pickupLocation: document.getElementById("pickupLocation").value,
            rentalCost: parseFloat(rentalCostSpan.textContent) || 0,
            securityDeposit: 200,
            taxAmount: parseFloat(taxAmountSpan.textContent) || 0,
            totalAmount: parseFloat(totalAmountSpan.textContent) || 0,
            carImage: carDetails?.image || "../images/cars/default-car.jpg", // Store car image
            carName: carDetails?.name || "Unknown Car" // Store car name
        };

        // Save reservation details in localStorage
        localStorage.setItem("reservationDetails", JSON.stringify(reservationData));

        alert("Reservation Confirmed! Your details have been saved.");
        window.location.href = "rental-confirm.html"; // Redirect to confirmation page
    });


});
