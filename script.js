// --- GLOWNEST FRONTEND LOGIC ---

// CONFIGURATION: Base API URL on Render
const API_BASE_URL = "https://glownest-api-mavu.onrender.com";

// 1. TikTok Comments Auto-Count & Price Logic
const serviceSelectElem = document.getElementById('service-select');
if (serviceSelectElem) {
    serviceSelectElem.addEventListener('change', function() {
        const selectedServiceId = this.value;
        const quantityInput = document.getElementById('quantity'); 
        const commentContainer = document.getElementById('comment-container');
        const commentTextarea = document.getElementById('custom-comments');
        const displayPrice = document.getElementById('display-price');
        
        const noteDisplay = document.getElementById('service-note'); 
        const selectedService = typeof servicesData !== 'undefined' ? servicesData.find(s => s.serviceId === selectedServiceId) : null;
        
        if (noteDisplay) {
            if (selectedService && selectedService.description) {
                noteDisplay.innerHTML = "<strong>ဖတ်ရန်:</strong> " + selectedService.description;
                noteDisplay.style.display = 'block';
            } else {
                noteDisplay.style.display = 'none';
            }
        }

        // TikTok Custom Comments ID: 262
        if (selectedServiceId === "262") {
            if (quantityInput) quantityInput.readOnly = true; 
            if (commentContainer) commentContainer.style.display = 'block'; 
            
            if (commentTextarea) {
                commentTextarea.addEventListener('input', function() {
                    const lines = this.value.split('\n').filter(line => line.trim() !== "");
                    const count = lines.length;
                    if (quantityInput) quantityInput.value = count;
                    
                    const pricePerUnit = 11900 / 1000; 
                    const total = pricePerUnit * count;
                    if (displayPrice) displayPrice.innerText = Math.ceil(total) + " MMK";
                });
            }
        } else {
            if (quantityInput) {
                quantityInput.readOnly = false;
                quantityInput.value = "";
            }
            if (commentContainer) commentContainer.style.display = 'none';
            if (displayPrice) displayPrice.innerText = "0 MMK";
        }
    });
}

// 2. PLACE ORDER FUNCTION
async function placeOrder() {
    const submitBtn = document.getElementById('place-order-btn');
    const userEmail = localStorage.getItem('userEmail'); 
    const serviceSelect = document.getElementById('service-select');
    const serviceId = serviceSelect ? serviceSelect.value : "";
    const linkInput = document.getElementById('link-input');
    const link = linkInput ? linkInput.value : "";
    const quantityInput = document.getElementById('quantity');
    const quantity = quantityInput ? quantityInput.value : "";
    const commentsInput = document.getElementById('custom-comments');
    const comments = commentsInput ? commentsInput.value : ""; 
    
    const displayPriceElem = document.getElementById('display-price');
    const chargeText = displayPriceElem ? displayPriceElem.innerText : "0";
    const charge = parseInt(chargeText.replace(/[^0-9]/g, '')) || 0;

    if (!userEmail) return alert("ကျေးဇူးပြု၍ အရင် Login ဝင်ပါ။");
    if (!link) return alert("Link ထည့်သွင်းပေးပါ။");
    
    if (serviceId === "262") {
        const commentLines = comments.split('\n').filter(line => line.trim() !== "");
        if (commentLines.length < 10) {
            return alert("TikTok Comments အတွက် အနည်းဆုံး စာကြောင်း (၁၀) ကြောင်း ရိုက်ထည့်ပေးရပါမည်။");
        }
    } else if (!quantity || quantity <= 0) {
        return alert("Quantity အနည်းဆုံး ၁ ခု ရှိရပါမည်။");
    }

    try {
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerText = "Processing...";
        }

        const orderData = {
            userEmail: userEmail,
            serviceId: serviceId,
            serviceName: serviceSelect && serviceSelect.selectedIndex >= 0 ? serviceSelect.options[serviceSelect.selectedIndex].text : "",
            link: link,
            quantity: quantity,
            charge: charge,
            comments: comments 
        };

        const response = await axios.post(`${API_BASE_URL}/api/order`, orderData);

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
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = "PLACE ORDER NOW";
        }
    }
}

// 3. ADMIN ADD BALANCE FUNCTION
async function addBalance() {
    const emailElem = document.getElementById('admin-user-email');
    const amountElem = document.getElementById('admin-amount');
    const passElem = document.getElementById('admin-password');

    const email = emailElem ? emailElem.value : "";
    const amount = amountElem ? amountElem.value : "";
    const adminPassword = passElem ? passElem.value : "";

    if (!email || !amount || !adminPassword) {
        return alert("အချက်အလက်များ အားလုံး ဖြည့်သွင်းပါ။");
    }

    try {
        const response = await axios.post(`${API_BASE_URL}/api/admin/add-balance`, {
            email: email,
            amount: amount,
            adminPassword: adminPassword 
        });

        if (response.data.success) {
            alert("✅ Balance ထည့်သွင်းမှု အောင်မြင်ပါသည်။ လက်ကျန်ငွေ: " + response.data.newBalance + " MMK");
            location.reload();
        } else {
            alert("❌ Error: " + response.data.error);
        }
    } catch (err) {
        console.error("Admin Error:", err);
        alert("Server Error: Admin API သို့ ချိတ်ဆက်၍မရပါ။");
    }
}

// Event Listeners
const placeOrderBtn = document.getElementById('place-order-btn');
if (placeOrderBtn) {
    placeOrderBtn.addEventListener('click', placeOrder);
}

const addBalanceBtn = document.getElementById('add-balance-btn');
if (addBalanceBtn) {
    addBalanceBtn.addEventListener('click', addBalance);
}