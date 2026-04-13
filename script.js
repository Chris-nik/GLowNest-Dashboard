// --- NEW: TikTok Comments Auto-Count Logic ---
document.getElementById('service-select').addEventListener('change', function() {
    const selectedServiceId = this.value;
    const quantityInput = document.getElementById('quantity'); 
    const commentContainer = document.getElementById('comment-container');
    const commentTextarea = document.getElementById('custom-comments');

    // If ID is 262 (TikTok Comments)
    if (selectedServiceId === "262") {
        quantityInput.style.display = 'none'; // Hide manual box
        commentContainer.style.display = 'block'; // Show textarea
        
        commentTextarea.addEventListener('input', function() {
            const lines = this.value.split('\n').filter(line => line.trim() !== "");
            const count = lines.length;
            
            // Auto-fill hidden quantity for the order
            quantityInput.value = count;
            
            // Calculate 2x price: (Price / 1000) * count
            const pricePerUnit = 11900 / 1000; 
            const total = pricePerUnit * count;
            document.getElementById('display-price').innerText = total.toFixed(0) + " MMK";
        });
    } else {
        quantityInput.style.display = 'block';
        commentContainer.style.display = 'none';
    }
});