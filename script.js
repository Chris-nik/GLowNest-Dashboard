// --- GLOWNEST FRONTEND LOGIC ---

// 1. TikTok Comments Auto-Count & Price Logic
document.getElementById('service-select').addEventListener('change', function() {
    const selectedServiceId = this.value;
    const quantityInput = document.getElementById('quantity'); 
    const commentContainer = document.getElementById('comment-container');
    const commentTextarea = document.getElementById('custom-comments');
    const displayPrice = document.getElementById('display-price');

    if (selectedServiceId === "262") {
        quantityInput.readOnly = true; // Manual ရိုက်လို့မရအောင် ပိတ်ထားမယ်
        commentContainer.style.display = 'block'; 
        
        commentTextarea.addEventListener('input', function() {
            const lines = this.value.split('\n').filter(line => line.trim() !== "");
            const count = lines.length;
            
            quantityInput.value = count;
            
            // ShweBoost Price (11900 per 1000) ကို 2x တင်ထားတဲ့ GlowNest Price
            const pricePerUnit = 11900 / 1000; 
            const total = pricePerUnit * count;
            displayPrice.innerText = Math.ceil(total) + " MMK";
        });
    } else {
        quantityInput.readOnly = false;
        commentContainer.style.display = 'none';
    }
});

// 2. PLACE ORDER FUNCTION (အဓိက အပိုင်း)
async function placeOrder() {
    const submitBtn = document.getElementById('place-order-btn');
    const userEmail = localStorage.getItem('userEmail'); // သိမ်းထားတဲ့ Email ကိုယူမယ်
    const serviceId = document.getElementById('service-select').value;
    const link = document.getElementById('link-input').value;
    const quantity = document.getElementById('quantity').value;
    const comments = document.getElementById('custom-comments').value; // Comment စာသားများယူမယ်
    
    // Price ကို စာသားထဲကနေ ကိန်းဂဏန်းအဖြစ်ပြောင်းမယ်
    const chargeText = document.getElementById('display-price').innerText;
    const charge = parseInt(chargeText.replace(/[^0-9]/g, ''));

    if (!link || !quantity || quantity <= 0) {
        return alert("Link နှင့် Quantity ကို မှန်ကန်စွာ ထည့်သွင်းပေးပါ။");
    }

    try {
        submitBtn.disabled = true;
        submitBtn.innerText = "Processing...";

        const orderData = {
            userEmail: userEmail,
            serviceId: serviceId,
            serviceName: document.getElementById('service-select').options[document.getElementById('service-select').selectedIndex].text,
            link: link,
            quantity: quantity,
            charge: charge,
            comments: comments // Backend ဆီသို့ Comment များ ပို့လိုက်ပြီ!
        };

        const response = await axios.post('https://မင်းရဲ့-render-link.onrender.com/api/order', orderData);

        if (response.data.success) {
            alert("✅ Order အောင်မြင်ပါသည်။ Order ID: " + response.data.orderId);
            window.location.reload(); // Page ကို refresh လုပ်ပြီး balance update ကြည့်မယ်
        } else {
            alert("❌ Error: " + response.data.error);
        }
    } catch (err) {
        console.error("Order Error:", err);
        alert("Server နှင့် ချိတ်ဆက်မှု မရရှိပါ။");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerText = "PLACE ORDER NOW";
    }
}

// ခလုတ်ကို နှိပ်ရင် placeOrder function အလုပ်လုပ်အောင် ချိတ်မယ်
document.getElementById('place-order-btn').addEventListener('click', placeOrder);