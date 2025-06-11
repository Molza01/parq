document.addEventListener("DOMContentLoaded", () => {
  // Price Range Slider
  const minPriceSlider = document.getElementById("min-price")
  const maxPriceSlider = document.getElementById("max-price")
  const priceValues = document.querySelector(".price-values")

  // Update price range display
  function updatePriceRange() {
    const minPrice = Number.parseInt(minPriceSlider.value)
    const maxPrice = Number.parseInt(maxPriceSlider.value)

    // Ensure min doesn't exceed max
    if (minPrice > maxPrice) {
      minPriceSlider.value = maxPrice
    }

    priceValues.textContent = `₹${minPriceSlider.value} - ₹${maxPriceSlider.value}`
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

  // View toggle functionality
  const viewToggle = document.querySelector(".view-toggle")
  const parkingCards = document.querySelector(".parking-cards")
  viewToggle.addEventListener("click", function () {
    if (parkingCards.classList.contains("list-view")) {
      parkingCards.classList.remove("list-view")
      this.innerHTML = '<i class="fas fa-th-list"></i>'
    } else {
      parkingCards.classList.add("list-view")
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

  // Mock filter function - in a real app, this would filter based on selected criteria
  function filterParkingSpots() {
    console.log("Filtering parking spots based on selected criteria")
    // This would typically involve showing/hiding cards or fetching new data
  }

  // Mock sort function - in a real app, this would sort the parking spots
  function sortParkingSpots(criteria) {
    console.log(`Sorting parking spots by: ${criteria}`)
    // This would typically involve reordering the cards based on the selected criteria
  }

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
})

// Login page
function login(event) {
  event.preventDefault();
  alert("Login clicked! (Add actual login logic here)");
}