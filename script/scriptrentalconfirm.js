document.addEventListener("DOMContentLoaded", function () {
    // Get elements
    const bookingCard = document.querySelector(".booking-card");
    const noRecordsMessage = document.querySelector(".no-records");

    const bookingIDSpan = document.querySelector(".booking-id");
    const carImage = document.querySelector(".booking-car-image");
    const carName = document.querySelector(".booking-car-name");
    const pickupDateSpan = document.querySelector(".booking-pickup-date");
    const returnDateSpan = document.querySelector(".booking-return-date");
    const pickupLocationSpan = document.querySelector(".booking-pickup-location");
    const totalAmountSpan = document.querySelector(".booking-total-amount");

    // Get reservation details from localStorage
    const reservationData = JSON.parse(localStorage.getItem("reservationDetails"));

    if (reservationData) {
        // Insert data into the card
        bookingIDSpan.textContent = reservationData.bookingID || "N/A";
        carImage.src = reservationData.carImage || "../images/cars/default-car.jpg";
        carName.textContent = reservationData.carName || "Unknown Car";
        pickupDateSpan.textContent = formatDate(reservationData.pickupDate);
        returnDateSpan.textContent = formatDate(reservationData.returnDate);
        pickupLocationSpan.textContent = reservationData.pickupLocation || "N/A";
        totalAmountSpan.textContent = `$${reservationData.totalAmount.toFixed(2)}`;

        // Show the booking card and hide "No records found" message
        bookingCard.style.display = "block";
        noRecordsMessage.style.display = "none";
    } else {
        // Show "No records found" message and hide the booking card
        noRecordsMessage.style.display = "block";
        bookingCard.style.display = "none";
    }

    // Function to format the date
    function formatDate(dateString) {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }


});
