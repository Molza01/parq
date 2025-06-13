console.log("script loaded successfully")

// login page loading from home page 
function login_page_load(){
    window.location.href="login.html";
}

// back to home page
function back_home(){
    window.location.href = "index.html"
}

document.addEventListener("DOMContentLoaded", () => {

    // use to reset all filters when the page is started or reset or refresh
     document.querySelectorAll('.checkbox-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
    // Price Range Slider
    const minPriceSlider = document.getElementById("min-price")
    const maxPriceSlider = document.getElementById("max-price")
    const priceValues = document.querySelector(".price-values")

    // Enhanced parking data with filter attributes
    const parkingData = [
        {
            element: null, // Will be set to the actual DOM element
            vehicleTypes: ['car', 'suv'],
            parkingTypes: ['covered'],
            securityFeatures: ['cctv'],
            paymentOptions: ['online'],
            price: 50,
            location: 'koregaon',
            title: 'Premium Covered Parking',
            provider: 'City Mall',
            rating: 4.5
        },
        {
            element: null,
            vehicleTypes: ['car', 'suv'],
            parkingTypes: ['valet', 'covered'],
            securityFeatures: ['guard'],
            paymentOptions: ['online', 'cash'],
            price: 80,
            location: 'viman',
            title: 'Valet Parking',
            provider: 'Phoenix Mall',
            rating: 4.8
        },
        {
            element: null,
            vehicleTypes: ['car', 'bike'],
            parkingTypes: ['ev-charging', 'covered'],
            securityFeatures: ['cctv'],
            paymentOptions: ['online', 'wallet'],
            price: 120,
            location: 'shivaji',
            title: 'EV Charging Spot',
            provider: 'Central Park',
            rating: 4.6
        },
        {
            element: null,
            vehicleTypes: ['car', 'bike'],
            parkingTypes: ['open'],
            securityFeatures: ['cctv'],
            paymentOptions: ['cash', 'wallet'],
            price: 30,
            location: 'swargate',
            title: 'Open Parking',
            provider: 'Metro Station',
            rating: 4.2
        },
        {
            element: null,
            vehicleTypes: ['car', 'suv'],
            parkingTypes: ['valet', 'covered'],
            securityFeatures: ['guard', 'gated'],
            paymentOptions: ['online'],
            price: 100,
            location: 'hadapsar',
            title: 'Premium Valet',
            provider: 'Amanora Mall',
            rating: 4.9
        },
        {
            element: null,
            vehicleTypes: ['car', 'bike'],
            parkingTypes: ['covered'],
            securityFeatures: ['guard', 'cctv'],
            paymentOptions: ['online', 'wallet'],
            price: 70,
            location: 'hinjewadi',
            title: 'Corporate Parking',
            provider: 'IT Park',
            rating: 4.4
        },
        {
        element: null,
        vehicleTypes: ['car'],
        parkingTypes: ['covered'],
        securityFeatures: ['cctv'],
        paymentOptions: ['online'],
        price: 50,
        location: 'katraj',
        title: 'Municipal Parking',
        provider: 'Katraj Park',
        rating: 4.0
    },
    {
        element: null,
        vehicleTypes: ['car', 'suv'],
        parkingTypes: ['ev-charging', 'valet'],
        securityFeatures: ['guard'],
        paymentOptions: ['online'],
        price: 100,
        location: 'baner',
        title: 'EV , 4-Wheeler',
        provider: 'Baner IT Park',
        rating: 4.3
    },
    {
        element: null,
        vehicleTypes: ['car', 'suv'],
        parkingTypes: ['valet'],
        securityFeatures: ['guard'],
        paymentOptions: ['online'],
        price: 70,
        location: 'vadgaon',
        title: 'Private Parking',
        provider: 'Sinhgad College',
        rating: 4.1
    }
    ];

    // Initialize parking data with DOM elements
    const parkingCards = document.querySelectorAll('.parking-card');
    parkingCards.forEach((card, index) => {
        if (parkingData[index]) {
            parkingData[index].element = card;
        }
    });

  
    function updateSliderTrack() {
    const min = parseInt(minPriceSlider.min);
    const max = parseInt(maxPriceSlider.max);
    const minVal = parseInt(minPriceSlider.value);
    const maxVal = parseInt(maxPriceSlider.value);
    
    const percent1 = ((minVal - min) / (max - min)) * 100;
    const percent2 = ((maxVal - min) / (max - min)) * 100;
    
    const sliderTrack = document.querySelector('.slider-track');
    sliderTrack.style.left = percent1 + '%';
    sliderTrack.style.right = (100 - percent2) + '%';
    sliderTrack.style.background = '#4dabf7';
}

    function updatePriceRange() {
    const min = parseInt(minPriceSlider.value);
    const max = parseInt(maxPriceSlider.value);

    if (min > max) {
        minPriceSlider.value = max;
        return;
    }

    priceValues.textContent = `₹${min} - ₹${max}`;
    updateSliderTrack();
    filterParkingSpots(); // call your existing filter
}


    minPriceSlider.addEventListener("input", updatePriceRange)
    maxPriceSlider.addEventListener("input", updatePriceRange)

    // Bookmark functionality
    const bookmarkButtons = document.querySelectorAll(".bookmark")
    bookmarkButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const icon = this.querySelector("i")
            if (icon.classList.contains("far")) {
                icon.classList.remove("far")
                icon.classList.add("fas")
            } else {
                icon.classList.remove("fas")
                icon.classList.add("far")
            }
        })
    })

    // Filter dropdowns
    const filterSelects = document.querySelectorAll(".filter-item select")
    filterSelects.forEach((select) => {
        select.addEventListener("change", () => {
            filterParkingSpots()
        })
    })

    // Checkbox filters
    const filterCheckboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]')
    filterCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            filterParkingSpots()
        })
    })

    // Sort functionality
    const sortSelect = document.getElementById("sort-by")
    sortSelect.addEventListener("change", function () {
        sortParkingSpots(this.value)
    })

    // Enhanced filter function
    function filterParkingSpots() {
        const vehicleType = document.getElementById("vehicle-type").value
        const location = document.getElementById("location").value
        const duration = document.getElementById("duration").value
        const timeSlot = document.getElementById("time-slot").value
        const minPrice = Number.parseInt(minPriceSlider.value)
        const maxPrice = Number.parseInt(maxPriceSlider.value)

        // Get selected parking type filters - using specific IDs from your HTML
        const selectedParkingTypes = [];
        if (document.getElementById("covered") && document.getElementById("covered").checked) {
            selectedParkingTypes.push("covered");
        }
        if (document.getElementById("open") && document.getElementById("open").checked) {
            selectedParkingTypes.push("open");
        }
        if (document.getElementById("valet") && document.getElementById("valet").checked) {
            selectedParkingTypes.push("valet");
        }
        if (document.getElementById("ev-charging") && document.getElementById("ev-charging").checked) {
            selectedParkingTypes.push("ev-charging");
        }
        if (document.getElementById("handicap") && document.getElementById("handicap").checked) {
            selectedParkingTypes.push("handicap");
        }

        // Get selected security features - using specific IDs from your HTML
        const selectedSecurityFeatures = [];
        if (document.getElementById("cctv") && document.getElementById("cctv").checked) {
            selectedSecurityFeatures.push("cctv");
        }
        if (document.getElementById("guard") && document.getElementById("guard").checked) {
            selectedSecurityFeatures.push("guard");
        }
        if (document.getElementById("gated") && document.getElementById("gated").checked) {
            selectedSecurityFeatures.push("gated");
        }

        // Get selected payment options - using specific IDs from your HTML
        const selectedPaymentOptions = [];
        if (document.getElementById("online") && document.getElementById("online").checked) {
            selectedPaymentOptions.push("online");
        }
        if (document.getElementById("cash") && document.getElementById("cash").checked) {
            selectedPaymentOptions.push("cash");
        }
        if (document.getElementById("wallet") && document.getElementById("wallet").checked) {
            selectedPaymentOptions.push("wallet");
        }

        let visibleCount = 0;

        console.log("Filter Debug Info:");
        console.log("Selected Parking Types:", selectedParkingTypes);
        console.log("Selected Security Features:", selectedSecurityFeatures);
        console.log("Selected Payment Options:", selectedPaymentOptions);
        console.log("Vehicle Type:", vehicleType);
        console.log("Price Range:", minPrice, "-", maxPrice);

        parkingData.forEach((spot, index) => {
            if (!spot.element) return;

            let isVisible = true;
            let filterReasons = [];

            // Vehicle type filter
            if (vehicleType && !spot.vehicleTypes.includes(vehicleType)) {
                isVisible = false;
                filterReasons.push(`Vehicle type: ${vehicleType} not in ${spot.vehicleTypes}`);
            }

            // Location filter (simplified - you can enhance this)
            if (location) {
                const locationMap = {
                    'north': ['viman', 'hinjewadi'],
                    'south': ['hadapsar', 'swargate'],
                    'east': ['koregaon', 'shivaji'],
                    'west': ['hinjewadi']
                };
                if (locationMap[location] && !locationMap[location].some(loc => spot.location.includes(loc))) {
                    isVisible = false;
                    filterReasons.push(`Location: ${location} doesn't match ${spot.location}`);
                }
            }

            // Price range filter
            if (spot.price < minPrice || spot.price > maxPrice) {
                isVisible = false;
                filterReasons.push(`Price: ${spot.price} not in range ${minPrice}-${maxPrice}`);
            }

            // Parking type filter - only apply if at least one parking type is selected
            if (selectedParkingTypes.length > 0) {
                const hasMatchingParkingType = selectedParkingTypes.some(type => 
                    spot.parkingTypes.includes(type)
                );
                if (!hasMatchingParkingType) {
                    isVisible = false;
                    filterReasons.push(`Parking type: ${selectedParkingTypes} doesn't match ${spot.parkingTypes}`);
                }
            }

            // Security features filter - only apply if at least one security feature is selected
            if (selectedSecurityFeatures.length > 0) {
                const hasMatchingSecurityFeature = selectedSecurityFeatures.some(feature => 
                    spot.securityFeatures.includes(feature)
                );
                if (!hasMatchingSecurityFeature) {
                    isVisible = false;
                    filterReasons.push(`Security: ${selectedSecurityFeatures} doesn't match ${spot.securityFeatures}`);
                }
            }

            // Payment options filter - only apply if at least one payment option is selected
            if (selectedPaymentOptions.length > 0) {
                const hasMatchingPaymentOption = selectedPaymentOptions.some(option => 
                    spot.paymentOptions.includes(option)
                );
                if (!hasMatchingPaymentOption) {
                    isVisible = false;
                    filterReasons.push(`Payment: ${selectedPaymentOptions} doesn't match ${spot.paymentOptions}`);
                }
            }

            console.log(`Spot ${index} (${spot.title}):`, isVisible ? "VISIBLE" : "HIDDEN", filterReasons);

            // Show/hide the parking card
            if (isVisible) {
                spot.element.style.display = 'block';
                spot.element.style.opacity = '1';
                spot.element.style.transform = 'translateY(0)';
                visibleCount++;
            } else {
                spot.element.style.display = 'none';
                spot.element.style.opacity = '0';
                spot.element.style.transform = 'translateY(10px)';
            }
        });

        // Update the count
        const countElement = document.querySelector('.count');
        if (countElement) {
            countElement.textContent = visibleCount;
        }

        // Show message if no results
        showNoResultsMessage(visibleCount === 0);
    }

    // Show/hide no results message
    function showNoResultsMessage(show) {
        let noResultsMsg = document.querySelector('.no-results-message');
        
        if (show && !noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-search" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                    <h3>No parking spots found</h3>
                    <p>Try adjusting your filters to see more results</p>
                    <button onclick="clearAllFilters()" style="margin-top: 15px; padding: 10px 20px; background: #4dabf7; color: white; border: none; border-radius: 5px; cursor: pointer;">Clear All Filters</button>
                </div>
            `;
            document.querySelector('.parking-cards').appendChild(noResultsMsg);
        } else if (!show && noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    // Clear all filters function
    window.clearAllFilters = function() {
        // Reset dropdowns
        document.getElementById("vehicle-type").value = "";
        document.getElementById("location").value = "";
        document.getElementById("duration").value = "";
        document.getElementById("time-slot").value = "";
        
        // Reset price sliders
        minPriceSlider.value = 50;
        maxPriceSlider.value = 500;
        updatePriceRange();
        
        // Reset all checkboxes to their default state (all unchecked for testing)
        document.querySelectorAll('.checkbox-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Then check the default ones to show all spots
        [].forEach(id => {
            const checkbox = document.getElementById(id);
            if (checkbox) checkbox.checked = true;
        });
        
        // Apply filters to show all relevant spots
        filterParkingSpots();
    }

    // Enhanced sort function
    function sortParkingSpots(criteria) {
        const parkingCardsContainer = document.querySelector('.parking-cards');
        const sortedData = [...parkingData].sort((a, b) => {
            switch (criteria) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'rating':
                    return b.rating - a.rating;
                case 'nearest':
                default:
                    return a.title.localeCompare(b.title);
            }
        });

        // Reorder DOM elements based on sorted data
        sortedData.forEach(spot => {
            if (spot.element) {
                parkingCardsContainer.appendChild(spot.element);
            }
        });
    }

    // View toggle functionality
    const viewToggle = document.querySelector(".view-toggle")
    const parkingCardsContainer = document.querySelector(".parking-cards")
    viewToggle.addEventListener("click", function () {
        if (parkingCardsContainer.classList.contains("list-view")) {
            parkingCardsContainer.classList.remove("list-view")
            this.innerHTML = '<i class="fas fa-th-list"></i>'
        } else {
            parkingCardsContainer.classList.add("list-view")
            this.innerHTML = '<i class="fas fa-th-large"></i>'
        }
    })

    // Details button functionality
    const detailsButtons = document.querySelectorAll(".details-btn")
    detailsButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const parkingCard = this.closest(".parking-card")
            const parkingTitle = parkingCard.querySelector(".card-title").textContent
            const parkingLocation = parkingCard.querySelector(".location").textContent
            const parkingPrice = parkingCard.querySelector(".price").textContent

            alert(
                `Booking details for ${parkingTitle}\nLocation: ${parkingLocation}\nPrice: ${parkingPrice}\n\nThis would open a detailed booking page in a real application.`,
            )
        })
    })

    // Mobile menu toggle
    const mobileMenuToggle = document.createElement("button")
    mobileMenuToggle.className = "mobile-menu-toggle"
    mobileMenuToggle.innerHTML = '<i class="fas fa-bars"></i>'

    const header = document.querySelector(".header")
    const mainNav = document.querySelector(".main-nav")

    // Only add mobile menu toggle if screen width is below 768px
    function checkScreenSize() {
        if (window.innerWidth < 768) {
            if (!document.querySelector(".mobile-menu-toggle")) {
                header.insertBefore(mobileMenuToggle, mainNav)
                mainNav.style.display = "none"
            }
        } else {
            if (document.querySelector(".mobile-menu-toggle")) {
                document.querySelector(".mobile-menu-toggle").remove()
                mainNav.style.display = "block"
            }
        }
    }

    // Check on load and resize
    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    // Toggle mobile menu
    document.addEventListener("click", (e) => {
        if (e.target.closest(".mobile-menu-toggle")) {
            if (mainNav.style.display === "none" || mainNav.style.display === "") {
                mainNav.style.display = "block"
            } else {
                mainNav.style.display = "none"
            }
        }
    })

    // Add responsive styles for list view
    const style = document.createElement("style")
    style.textContent = `
        .parking-cards.list-view {
            display: flex;
            flex-direction: column;
        }
        
        .parking-cards.list-view .parking-card {
            display: grid;
            grid-template-columns: 1fr 2fr 1fr;
            align-items: center;
            gap: 20px;
        }
        
        .parking-cards.list-view .card-provider,
        .parking-cards.list-view .card-title,
        .parking-cards.list-view .card-tags {
            grid-column: 2;
        }
        
        .parking-cards.list-view .card-price,
        .parking-cards.list-view .details-btn {
            grid-column: 3;
            grid-row: span 2;
        }

        .parking-card {
            transition: all 0.3s ease;
        }
        
        @media (max-width: 768px) {
            .parking-cards.list-view .parking-card {
                grid-template-columns: 1fr;
            }
            
            .parking-cards.list-view .card-provider,
            .parking-cards.list-view .card-title,
            .parking-cards.list-view .card-tags,
            .parking-cards.list-view .card-price,
            .parking-cards.list-view .details-btn {
                grid-column: 1;
            }
        }
    `
    document.head.appendChild(style)

    // Initialize filters on page load
    filterParkingSpots();
})