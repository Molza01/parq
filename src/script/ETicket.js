

function downloadTicket() {
  const ticket = document.getElementById("ticket-pdf");

  // Temporarily show the ticket
  ticket.style.display = "block";

  const opt = {
    margin:       10,
    filename:     'eco_parking_ticket.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, scrollY: 0 },
    jsPDF:        { unit: 'pt', format: 'a4', orientation: 'portrait' }
  };

  setTimeout(() => {
    html2pdf().set(opt).from(ticket).save().then(() => {
      ticket.style.display = "none"; // Hide it again
    });
  }, 300); // Wait to ensure DOM updates before snapshot
}


        // Add some interactive sparkle effect on click
        document.addEventListener('click', function(e) {
            createSparkle(e.clientX, e.clientY);
        });

        function createSparkle(x, y) {
            const sparkle = document.createElement('div');
            sparkle.style.position = 'fixed';
            sparkle.style.left = x + 'px';
            sparkle.style.top = y + 'px';
            sparkle.style.width = '10px';
            sparkle.style.height = '10px';
            sparkle.style.background = 'radial-gradient(circle, #fff, transparent)';
            sparkle.style.borderRadius = '50%';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '1000';
            sparkle.style.animation = 'sparkleAnim 0.6s ease-out forwards';
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 600);
        }

        // Add sparkle animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes sparkleAnim {
                0% { 
                    transform: scale(0) rotate(0deg); 
                    opacity: 1; 
                }
                100% { 
                    transform: scale(1.5) rotate(180deg); 
                    opacity: 0; 
                }
            }
        `;
        document.head.appendChild(style);

        // getting ticket content values

        const query = new URLSearchParams(window.location.search);

        document.getElementById('slot').textContent = query.get("slot");

        document.getElementById('date').textContent = query.get("date");

        document.getElementById('time').textContent = query.get("time") ;

        document.getElementById('duration').textContent = query.get("duration");

        document.getElementById('bookingid').textContent = query.get("Bookingid");

        document.getElementById('vehicletype').textContent = query.get("vehicle");

        document.getElementById('Amount').textContent = query.get("amount");
