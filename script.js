// --- GLOWNEST FRONTEND LOGIC ---

// 1. TikTok Comments Auto-Count & Price Logic
document.getElementById('service-select').addEventListener('change', function() {
    const selectedServiceId = this.value;
    const quantityInput = document.getElementById('quantity'); 
    const commentContainer = document.getElementById('comment-container');
    const commentTextarea = document.getElementById('custom-comments');
    const displayPrice = document.getElementById('display-price');

    // TikTok Custom Comments ID: 262
    if (selectedServiceId === "262") {
        quantityInput.readOnly = true; 
        commentContainer.style.display = 'block'; 
        
        commentTextarea.addEventListener('input', function() {
            const lines = this.value.split('\n').filter(line => line.trim() !== "");
            const count = lines.length;
            
            quantityInput.value = count;
            
            // Price calculation (GlowNest 2x Pricing)
            const pricePerUnit = 11900 / 1000; 
            const total = pricePerUnit * count;
            displayPrice.innerText = Math.ceil(total) + " MMK";
        });
    } else {
        quantityInput.readOnly = false;
        commentContainer.style.display = 'none';
        quantityInput.value = ""; // Clear values if service changed
        displayPrice.innerText = "0 MMK";
    }
});

// 2. PLACE ORDER FUNCTION
async function placeOrder() {
    const submitBtn = document.getElementById('place-order-btn');
    const userEmail = localStorage.getItem('userEmail'); 
    const serviceSelect = document.getElementById('service-select');
    const serviceId = serviceSelect.value;
    const link = document.getElementById('link-input').value;
    const quantity = document.getElementById('quantity').value;
    const comments = document.getElementById('custom-comments').value; 
    
    // Price logic
    const chargeText = document.getElementById('display-price').innerText;
    const charge = parseInt(chargeText.replace(/[^0-9]/g, '')) || 0;

    // Validation
    if (!userEmail) return alert("ကျေးဇူးပြု၍ အရင် Login ဝင်ပါ။");
    if (!link) return alert("Link ထည့်သွင်းပေးပါ။");
    if (!quantity || quantity <= 0) return alert("Quantity အနည်းဆုံး ၁ ခု ရှိရပါမည်။");

    try {
        submitBtn.disabled = true;
        submitBtn.innerText = "Processing...";

        const orderData = {
            userEmail: userEmail,
            serviceId: serviceId,
            serviceName: serviceSelect.options[serviceSelect.selectedIndex].text,
            link: link,
            quantity: quantity,
            charge: charge,
            comments: comments // TikTok Comments အတွက် အရေးကြီးဆုံးအပိုင်း
        };

        // Render URL (GlowNest-API)
        const response = await axios.post('https://glownest-api.onrender.com/api/order', orderData);

        if (response.data.success) {
            alert("✅ Order အောင်မြင်ပါသည်။ Order ID: " + response.data.orderId);
            window.location.reload(); 
        } else {
            alert("❌ Error: " + response.data.error);
        }
    } catch (err) {
        console.error("Order Error:", err);
        alert("Server Error: Render API သို့ ချိတ်ဆက်၍မရပါ။");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "PLACE ORDER NOW";
    }
}

// Event Listener for Place Order Button
document.getElementById('place-order-btn').addEventListener('click', placeOrder);