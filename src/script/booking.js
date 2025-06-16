// intro animation script
const words = ["Parking", "Booking", "Payment"];
let i = 0, j = 0;
let currentWord = "";
let isDeleting = false;
const typewriter = document.getElementById("typewriter-text");

function type() {
  currentWord = words[i];
  if (isDeleting) {
    typewriter.textContent = currentWord.substring(0, j--);
    if (j < 0) {
      isDeleting = false;
      i = (i + 1) % words.length;
    }
  } else {
    typewriter.textContent = currentWord.substring(0, j++);
    if (j > currentWord.length + 2) {
      isDeleting = true;
    }
  }
  setTimeout(type, isDeleting ? 60 : 120);
}
type();


class ParkingBookingSystem {
    constructor() {
        this.selectedDate = null;
        this.startTime = '09:00';
        this.endTime = '10:00';
        this.selectedTier = null;
        this.selectedSpots = [];
        this.currentStep = 1;
        
        // Vehicle types configuration
        this.vehicleTypes = [
            {
                name: '2 Wheeler',
                icon: '🛵',
                pricing: { 'classic-plus': 149, 'prime': 149, 'classic': 99 }
            },
            {
                name: '3 Wheeler',
                icon: '🛺',
                pricing: { 'classic-plus': 199, 'prime': 199, 'classic': 149 }
            },
            {
                name: '4 Wheeler',
                icon: '🚗',
                pricing: { 'classic-plus': 299, 'prime': 299, 'classic': 199 }
            },
            {
                name: 'EV Vehicle',
                icon: '🔋',
                pricing: { 'classic-plus': 249, 'prime': 249, 'classic': 149 }
            },
            {
                name: 'Heavy Vehicle',
                icon: '🚛',
                pricing: { 'classic-plus': 499, 'prime': 499, 'classic': 349 }
            }
        ];
        
        this.currentVehicleIndex = 0; // Start with 2 Wheeler
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.generateParkingGrid();
        this.updateVehicleDisplay();
        this.updatePricing(); // Initialize pricing on load
        this.updateDurationDisplay();
        this.updateUI();
    }
    
    bindEvents() {
        // Date selection
        document.querySelectorAll('.date-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.selectDate(e.currentTarget);
            });
        });
        
        // Time dropdown events
        this.bindTimeDropdownEvents();
        
        // Vehicle navigation
        document.getElementById('prev-vehicle').addEventListener('click', () => {
            this.changeVehicleType(-1);
        });
        
        document.getElementById('next-vehicle').addEventListener('click', () => {
            this.changeVehicleType(1);
        });
        
        // Tier selection
        document.querySelectorAll('.tier').forEach(tier => {
            tier.addEventListener('click', (e) => {
                this.selectTier(e.currentTarget);
            });
        });
        
        // Navigation buttons
        document.getElementById('next-btn').addEventListener('click', () => {
            this.nextStep();
        });
        
        document.getElementById('back-btn').addEventListener('click', () => {
            this.previousStep();
        });
        
        document.getElementById('confirm-booking').addEventListener('click', () => {
            this.confirmBooking();
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.time-dropdown')) {
                this.closeAllDropdowns();
            }
        });
    }
    
    bindTimeDropdownEvents() {
        // Start time dropdown
        const startTimeBtn = document.getElementById('start-time-btn');
        const startTimeMenu = document.getElementById('start-time-menu');
        
        startTimeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown('start-time');
        });
        
        startTimeMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('time-option')) {
                this.selectStartTime(e.target.dataset.time, e.target.textContent);
            }
        });
        
        // End time dropdown
        const endTimeBtn = document.getElementById('end-time-btn');
        const endTimeMenu = document.getElementById('end-time-menu');
        
        endTimeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown('end-time');
        });
        
        endTimeMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('time-option')) {
                this.selectEndTime(e.target.dataset.time, e.target.textContent);
            }
        });
    }
    
    toggleDropdown(type) {
        const menu = document.getElementById(`${type}-menu`);
        const btn = document.getElementById(`${type}-btn`);
        
        // Close other dropdown
        const otherType = type === 'start-time' ? 'end-time' : 'start-time';
        const otherMenu = document.getElementById(`${otherType}-menu`);
        const otherBtn = document.getElementById(`${otherType}-btn`);
        
        otherMenu.classList.remove('show');
        otherBtn.classList.remove('active');
        
        // Toggle current dropdown
        menu.classList.toggle('show');
        btn.classList.toggle('active');
        
        if (type === 'end-time') {
            this.updateEndTimeOptions();
        }
    }
    
    closeAllDropdowns() {
        document.querySelectorAll('.time-dropdown-menu').forEach(menu => {
            menu.classList.remove('show');
        });
        document.querySelectorAll('.time-dropdown-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    }
    
    selectStartTime(time, displayText) {
        this.startTime = time;
        document.getElementById('start-time-display').textContent = displayText;
        
        // Update end time if it's before or equal to start time
        if (this.timeToMinutes(this.endTime) <= this.timeToMinutes(this.startTime)) {
            const nextHour = this.addHours(this.startTime, 1);
            this.endTime = nextHour;
            document.getElementById('end-time-display').textContent = this.formatTimeDisplay(nextHour);
        }
        
        this.updateDurationDisplay();
        this.updateSummary();
        this.closeAllDropdowns();
    }
    
    selectEndTime(time, displayText) {
        if (this.timeToMinutes(time) > this.timeToMinutes(this.startTime)) {
            this.endTime = time;
            document.getElementById('end-time-display').textContent = displayText;
            this.updateDurationDisplay();
            this.updateSummary();
        }
        this.closeAllDropdowns();
    }
    
    updateEndTimeOptions() {
        const endTimeMenu = document.getElementById('end-time-menu');
        const options = endTimeMenu.querySelectorAll('.time-option');
        
        options.forEach(option => {
            const optionTime = option.dataset.time;
            if (this.timeToMinutes(optionTime) <= this.timeToMinutes(this.startTime)) {
                option.classList.add('disabled');
            } else {
                option.classList.remove('disabled');
            }
        });
    }
    
    timeToMinutes(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        return hours * 60 + minutes;
    }
    
    addHours(timeString, hours) {
        const totalMinutes = this.timeToMinutes(timeString) + (hours * 60);
        const newHours = Math.floor(totalMinutes / 60);
        const newMinutes = totalMinutes % 60;
        
        // Ensure we don't go beyond 21:00 (9 PM)
        if (newHours > 21) {
            return '21:00';
        }
        
        return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;
    }
    
    formatTimeDisplay(timeString) {
        const [hours, minutes] = timeString.split(':').map(Number);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    }
    
    updateDurationDisplay() {
        const startMinutes = this.timeToMinutes(this.startTime);
        const endMinutes = this.timeToMinutes(this.endTime);
        const durationMinutes = endMinutes - startMinutes;
        
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        
        let durationText = '';
        if (hours > 0) {
            durationText += `${hours} hour${hours > 1 ? 's' : ''}`;
        }
        if (minutes > 0) {
            if (hours > 0) durationText += ' ';
            durationText += `${minutes} minute${minutes > 1 ? 's' : ''}`;
        }
        
        document.getElementById('duration-display').textContent = durationText || '0 minutes';
        
        // Check if selected-duration element exists before updating
        const selectedDurationElement = document.getElementById('selected-duration');
        if (selectedDurationElement) {
            selectedDurationElement.textContent = durationText || '0 minutes';
        }
    }
    
    changeVehicleType(direction) {
        const newIndex = this.currentVehicleIndex + direction;
        
        if (newIndex >= 0 && newIndex < this.vehicleTypes.length) {
            this.currentVehicleIndex = newIndex;
            this.updateVehicleDisplay();
            this.updatePricing(); // Update pricing when vehicle type changes
            this.clearTierSelection(); // Clear previous tier selection
            this.updateSummary();
        }
    }
    
    updateVehicleDisplay() {
        const currentVehicle = this.vehicleTypes[this.currentVehicleIndex];
        
        document.getElementById('vehicle-icon').textContent = currentVehicle.icon;
        document.getElementById('vehicle-name').textContent = currentVehicle.name;
        document.getElementById('current-vehicle-type').textContent = currentVehicle.name;
        
        const prevBtn = document.getElementById('prev-vehicle');
        const nextBtn = document.getElementById('next-vehicle');
        
        prevBtn.disabled = this.currentVehicleIndex === 0;
        nextBtn.disabled = this.currentVehicleIndex === this.vehicleTypes.length - 1;
        
        // Check if selected-vehicle-type element exists before updating
        const selectedVehicleTypeElement = document.getElementById('selected-vehicle-type');
        if (selectedVehicleTypeElement) {
            selectedVehicleTypeElement.textContent = currentVehicle.name;
        }
    }
    
    updatePricing() {
        const currentVehicle = this.vehicleTypes[this.currentVehicleIndex];
        
        // Update pricing display for each tier based on current vehicle type
        document.getElementById('classic-plus-price').textContent = `Rs. ${currentVehicle.pricing['classic-plus']}`;
        document.getElementById('prime-price').textContent = `Rs. ${currentVehicle.pricing['prime']}`;
        document.getElementById('classic-price').textContent = `Rs. ${currentVehicle.pricing['classic']}`;
        
        // If a tier is already selected, update the total amount
        if (this.selectedTier) {
            this.updateTotalAmount();
        }
    }
    
    clearTierSelection() {
        document.querySelectorAll('.tier').forEach(tier => {
            tier.classList.remove('selected');
        });
        this.selectedTier = null;
        
        // Check if selected-tier element exists before updating
        const selectedTierElement = document.getElementById('selected-tier');
        if (selectedTierElement) {
            selectedTierElement.textContent = '-';
        }
        
        document.getElementById('total-amount').textContent = 'Rs. 0';
    }
    
    selectDate(item) {
        document.querySelectorAll('.date-item').forEach(i => {
            i.classList.remove('active');
        });
        
        item.classList.add('active');
        this.selectedDate = item.dataset.date;
        
        const day = item.querySelector('.day').textContent;
        const date = item.querySelector('.date').textContent;
        const month = item.querySelector('.month').textContent;
        
        // Check if selected-date element exists before updating
        const selectedDateElement = document.getElementById('selected-date');
        if (selectedDateElement) {
            selectedDateElement.textContent = `${day}, ${date} ${month}`;
        }
    }
    
    selectTier(tier) {
        document.querySelectorAll('.tier').forEach(t => {
            t.classList.remove('selected');
        });
        
        tier.classList.add('selected');
        this.selectedTier = tier.dataset.tier;
        
        const tierName = tier.querySelector('h4').textContent;
        const price = tier.querySelector('.price').textContent;
        
        // Check if selected-tier element exists before updating
        const selectedTierElement = document.getElementById('selected-tier');
        if (selectedTierElement) {
            selectedTierElement.textContent = `${tierName} (${price})`;
        }
        
        this.updateTotalAmount();
    }
    
    generateParkingGrid() {
        const grid = document.getElementById('parking-grid');
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
        const spotsPerRow = 15;
        
        grid.innerHTML = '';
        
        rows.forEach(row => {
            for (let i = 1; i <= spotsPerRow; i++) {
                const spot = document.createElement('div');
                const spotId = `${row}${i}`;
                spot.className = 'parking-spot';
                spot.dataset.spot = spotId;
                spot.textContent = i;
                
                const random = Math.random();
                if (random < 0.6) {
                    spot.classList.add('available');
                } else if (random < 0.75) {
                    spot.classList.add('bestseller');
                } else {
                    spot.classList.add('occupied');
                }
                
                if (!spot.classList.contains('occupied')) {
                    spot.addEventListener('click', () => {
                        this.selectParkingSpot(spot);
                    });
                }
                
                grid.appendChild(spot);
            }
        });
    }
    
    selectParkingSpot(spot) {
        const spotId = spot.dataset.spot;
        
        if (spot.classList.contains('selected')) {
            spot.classList.remove('selected');
            spot.classList.add('available');
            this.selectedSpots = this.selectedSpots.filter(s => s !== spotId);
        } else {
            document.querySelectorAll('.parking-spot.selected').forEach(s => {
                s.classList.remove('selected');
                s.classList.add('available');
            });
            this.selectedSpots = [];
            
            spot.classList.remove('available', 'bestseller');
            spot.classList.add('selected');
            this.selectedSpots.push(spotId);
        }
        
        // Check if selected-spot element exists before updating
        const selectedSpotElement = document.getElementById('selected-spot');
        if (selectedSpotElement) {
            selectedSpotElement.textContent = this.selectedSpots.join(', ') || '-';
        }
        
        this.updateTotalAmount();
    }
    
    updateTotalAmount() {
        if (this.selectedTier && this.selectedSpots.length > 0) {
            const currentVehicle = this.vehicleTypes[this.currentVehicleIndex];
            const hourlyRate = currentVehicle.pricing[this.selectedTier] || 0;
            
            // Calculate duration in hours
            const startMinutes = this.timeToMinutes(this.startTime);
            const endMinutes = this.timeToMinutes(this.endTime);
            const durationHours = Math.max(1, Math.ceil((endMinutes - startMinutes) / 60));
            
            const total = hourlyRate * durationHours * this.selectedSpots.length;
            document.getElementById('total-amount').textContent = `Rs. ${total}`;
        } else if (this.selectedSpots.length === 0) {
            document.getElementById('total-amount').textContent = 'Rs. 0';
        }
    }
    
    updateSummary() {
        const startDisplay = this.formatTimeDisplay(this.startTime);
        const endDisplay = this.formatTimeDisplay(this.endTime);
        
        // Check if selected-time element exists before updating
        const selectedTimeElement = document.getElementById('selected-time');
        if (selectedTimeElement) {
            selectedTimeElement.textContent = `${startDisplay} - ${endDisplay}`;
        }
        
        this.updateTotalAmount();
    }
    
    nextStep() {
        if (this.currentStep === 1) {
            if (!this.selectedDate || !this.selectedTier) {
                alert('Please complete all selections before proceeding.');
                return;
            }
            
            document.getElementById('parking-layout').style.display = 'block';
            document.getElementById('back-btn').style.display = 'inline-block';
            document.getElementById('next-btn').textContent = 'Proceed to Payment';
            this.currentStep = 2;
        } else if (this.currentStep === 2) {
            if (this.selectedSpots.length === 0) {
                alert('Please select at least one parking spot.');
                return;
            }
            
            document.getElementById('booking-summary').style.display = 'block';
            document.getElementById('next-btn').style.display = 'none';
            this.currentStep = 3;
        }
    }
    
    previousStep() {
        if (this.currentStep === 2) {
            document.getElementById('parking-layout').style.display = 'none';
            document.getElementById('back-btn').style.display = 'none';
            document.getElementById('next-btn').textContent = 'Select Spots';
            this.currentStep = 1;
        } else if (this.currentStep === 3) {
            document.getElementById('booking-summary').style.display = 'none';
            document.getElementById('next-btn').style.display = 'inline-block';
            this.currentStep = 2;
        }
    }
    
    confirmBooking() {
       const bookingId = 'PB' + Math.random().toString(36).substr(2, 9).toUpperCase();
        const currentVehicle = this.vehicleTypes[this.currentVehicleIndex];
        
        // Get display elements safely
        const selectedDateText = document.getElementById('selected-date')?.textContent || 'N/A';
        const selectedTimeText = document.getElementById('selected-time')?.textContent || 'N/A';
        const selectedDurationText = document.getElementById('selected-duration')?.textContent || this.calculateDurationText();
        const totalAmountText = document.getElementById('total-amount')?.textContent || 'Rs. 0';
        
       console.log(`Booking Confirmed! 
        
Booking ID: ${bookingId}
Date: ${selectedDateText}
Time: ${selectedTimeText}
Duration: ${selectedDurationText}
Vehicle Type: ${currentVehicle.name}
Parking Spots: ${this.selectedSpots.join(', ')}
Total Amount: ${totalAmountText}

Thank you for choosing Park Easy!`);



// URL METHOD TO TO PASSES THE VALUES FOR TICKETS (VALUES ARE ATAAKEN IN  ETicket.js file )
const params = new URLSearchParams({

    Bookingid : bookingId , 
    date : selectedDateText ,
    time : selectedTimeText ,
    duration :  selectedDurationText,
    vehicle : currentVehicle.name , 
    slot : this.selectedSpots.join(', ') , 
    amount : totalAmountText , 

});

window.location.href = "ticket.html?" + params.toString();

        this.resetBooking();
       
    }
    
    calculateDurationText() {
        const startMinutes = this.timeToMinutes(this.startTime);
        const endMinutes = this.timeToMinutes(this.endTime);
        const durationMinutes = endMinutes - startMinutes;
        
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        
        let durationText = '';
        if (hours > 0) {
            durationText += `${hours} hour${hours > 1 ? 's' : ''}`;
        }
        if (minutes > 0) {
            if (hours > 0) durationText += ' ';
            durationText += `${minutes} minute${minutes > 1 ? 's' : ''}`;
        }
        
        return durationText || '0 minutes';
    }
    
    resetBooking() {
        this.selectedDate = null;
        this.startTime = '09:00';
        this.endTime = '10:00';
        this.selectedTier = null;
        this.selectedSpots = [];
        this.currentVehicleIndex = 0;
        this.currentStep = 1;
        
        document.querySelectorAll('.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        document.getElementById('parking-layout').style.display = 'none';
        document.getElementById('booking-summary').style.display = 'none';
        document.getElementById('back-btn').style.display = 'none';
        document.getElementById('next-btn').style.display = 'inline-block';
        document.getElementById('next-btn').textContent = 'Select Spots';
        
        // Reset time displays
        document.getElementById('start-time-display').textContent = '09:00 AM';
        document.getElementById('end-time-display').textContent = '10:00 AM';
        
        this.updateVehicleDisplay();
        this.updatePricing();
        this.updateDurationDisplay();
        
        // Reset summary elements safely
        const elementsToReset = [
            'selected-date', 'selected-time', 'selected-duration', 
            'selected-spot', 'selected-tier'
        ];
        
        elementsToReset.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = '-';
            }
        });
        
        document.getElementById('total-amount').textContent = 'Rs. 0';
        
        this.generateParkingGrid();
    }
    
    updateUI() {
        const todayElement = document.querySelector('.date-item.today');
        if (todayElement) {
            todayElement.click();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ParkingBookingSystem();
});