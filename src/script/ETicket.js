
function downloadTicket() {
    const ticket = document.getElementById("ticket-pdf");

    // Temporarily make ticket visible for rendering
    ticket.style.display = "block";

    const opt = {
        margin:       [10, 10, 10, 10],
        filename:     'eco_parking_ticket.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, scrollY: 0 },
        jsPDF:        { unit: 'pt', format: 'a4', orientation: 'portrait' }
    };

    // Small delay to ensure rendering
    setTimeout(() => {
        html2pdf().set(opt).from(ticket).save().then(() => {
            ticket.style.display = "none";
        });
    }, 100); // small delay helps rendering sometimes
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
