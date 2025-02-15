document.addEventListener("DOMContentLoaded", function () {
    const returnedCarList = document.getElementById("returnedCarList");
    const carInspectionSection = document.getElementById("carInspectionSection");
    const selectedCarName = document.getElementById("selectedCarName");
    const approveCarBtn = document.getElementById("approveCar");

    let selectedCarIndex = null;
    let returnedCars = JSON.parse(localStorage.getItem("returnedCars")) || [];

    // Function to load returned cars into the admin panel
    function loadReturnedCars() {
        returnedCarList.innerHTML = ""; // Clear previous list

        if (returnedCars.length === 0) {
            returnedCarList.innerHTML = `<p class="text-danger text-center">No returned cars for inspection.</p>`;
            return;
        }

        returnedCars.forEach((car, index) => {
            const carItem = document.createElement("a");
            carItem.href = "#";
            carItem.classList.add("list-group-item", "list-group-item-action");
            carItem.innerHTML = `
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h5 class="mb-1">${car.carName}</h5>
                        <p class="mb-1"><strong>Condition:</strong> ${car.condition}</p>
                        <small><strong>Returned on:</strong> ${formatDate(car.returnDate)}</small>
                    </div>
                    <button class="btn btn-primary btn-sm inspect-btn" data-index="${index}">Inspect</button>
                </div>
            `;

            returnedCarList.appendChild(carItem);
        });

        attachInspectEvent();
    }

    // Function to format date
    function formatDate(dateString) {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    }

    // Attach click event to each "Inspect" button
    function attachInspectEvent() {
        document.querySelectorAll(".inspect-btn").forEach(button => {
            button.addEventListener("click", function () {
                selectedCarIndex = this.getAttribute("data-index");
                const car = returnedCars[selectedCarIndex];

                selectedCarName.textContent = car.carName;
                carInspectionSection.classList.remove("d-none");
            });
        });
    }

    // Approve Car and Remove from Returned List
    approveCarBtn.addEventListener("click", function () {
        if (selectedCarIndex === null) return;

        const carCondition = document.querySelector('input[name="carCondition"]:checked').value;

        alert(`Car: ${returnedCars[selectedCarIndex].carName} marked as ${carCondition}`);

        // Remove car from returnedCars list
        returnedCars.splice(selectedCarIndex, 1);
        localStorage.setItem("returnedCars", JSON.stringify(returnedCars));

        // Hide inspection section and reload list
        carInspectionSection.classList.add("d-none");
        loadReturnedCars();
    });

    // Initial load of returned cars
    loadReturnedCars();
});
