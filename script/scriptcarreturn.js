document.addEventListener("DOMContentLoaded", function () {
    const bookingIdInput = document.getElementById("bookingIdInput");
    const lookupBtn = document.getElementById("lookupBtn");
    const bookingDetails = document.getElementById("bookingDetails");

    const damageCostSpan = document.getElementById("damageCost");
    const finalTotalSpan = document.getElementById("finalTotal");
    const proceedPaymentBtn = document.getElementById("proceedPayment");
    const paymentConfirmation = document.getElementById("paymentConfirmation");

    // Damage checkboxes
    const noDamagesCheckbox = document.getElementById("noDamages");
    const minorScratchesCheckbox = document.getElementById("minorScratches");
    const dentsCheckbox = document.getElementById("dents");
    const brokenLightsCheckbox = document.getElementById("brokenLights");

    let currentReservation = null; // Store current reservation data

    // Handle Booking Lookup
    lookupBtn.addEventListener("click", function () {
        const bookingId = bookingIdInput.value.trim();
        const reservationData = JSON.parse(localStorage.getItem("reservationDetails"));

        if (reservationData && reservationData.bookingID === bookingId) {
            currentReservation = reservationData; // Store current reservation

            // Populate booking details
            bookingDetails.innerHTML = `
                <h5 class="fw-bold">Booking Details</h5>
                <p><span class="fw-bold">Car:</span> ${reservationData.carName}</p>
                <p><span class="fw-bold">Pickup Date:</span> ${formatDate(reservationData.pickupDate)}</p>
                <p><span class="fw-bold">Return Date:</span> ${formatDate(reservationData.returnDate)}</p>
            `;

            bookingDetails.classList.remove("d-none");
            calculateFinalTotal(); // Ensure final total is calculated
        } else {
            bookingDetails.innerHTML = `<p class="text-danger">No booking found for this ID.</p>`;
            bookingDetails.classList.remove("d-none");
        }
    });

    // Function to format date
    function formatDate(dateString) {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    }

    // Calculate damage cost dynamically
    function calculateDamageCost() {
        let damageCost = 0;
        if (minorScratchesCheckbox.checked) damageCost += 50;
        if (dentsCheckbox.checked) damageCost += 100;
        if (brokenLightsCheckbox.checked) damageCost += 200;

        damageCostSpan.textContent = `$${damageCost}`;
        return damageCost;
    }

    // Calculate final total including damages
    function calculateFinalTotal() {
        if (!currentReservation) return;

        const baseTotal = currentReservation.totalAmount || 0;
        const damageCost = calculateDamageCost();
        const finalTotal = baseTotal + damageCost;

        finalTotalSpan.textContent = `$${finalTotal.toFixed(2)}`;
    }

    // Listen for damage checkbox changes
    document.querySelectorAll(".form-check-input").forEach(checkbox => {
        checkbox.addEventListener("change", calculateFinalTotal);
    });

    // Handle Payment
    proceedPaymentBtn.addEventListener("click", function () {
        if (!currentReservation) {
            alert("No reservation found. Please look up your booking ID.");
            return;
        }

        // Determine car condition
        let carCondition = "No damages";
        let damages = [];
        if (minorScratchesCheckbox.checked) damages.push("Minor Scratches");
        if (dentsCheckbox.checked) damages.push("Dents");
        if (brokenLightsCheckbox.checked) damages.push("Broken Lights/Windows");

        if (damages.length > 0) {
            carCondition = damages.join(", ");
        }

        // Prepare returned car data
        const returnedCarData = {
            bookingID: currentReservation.bookingID,
            carName: currentReservation.carName,
            returnDate: currentReservation.returnDate,
            condition: carCondition,
        };

        // Store in "returnedCars" list in localStorage
        const returnedCars = JSON.parse(localStorage.getItem("returnedCars")) || [];
        returnedCars.push(returnedCarData);
        localStorage.setItem("returnedCars", JSON.stringify(returnedCars));

        // Remove reservation from localStorage after storing return details
        localStorage.removeItem("reservationDetails");

        // Hide billing section and show payment confirmation
        document.querySelector(".card.shadow.p-4").style.display = "none";
        paymentConfirmation.classList.remove("d-none");

        alert("Payment Successful!.");
    });
});
