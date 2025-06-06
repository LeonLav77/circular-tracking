console.log("a");

// Helper functions for cookie management
function setCookie(name, value, days = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Check URL first, then cookie
const urlParams = new URLSearchParams(window.location.search);
let transactionId = urlParams.get("transaction_id");

if (transactionId) {
    // If found in URL, store it in cookie for future pages
    setCookie("transaction_id", transactionId);
    console.log("Transaction ID from URL:", transactionId);
} else {
    // If not in URL, check cookie
    transactionId = getCookie("transaction_id");
    console.log("Transaction ID from cookie:", transactionId);
}

console.log("Final transaction ID:", transactionId);

if (transactionId) {
    // Update cart with transaction ID
    fetch('/cart.js')
    .then(res => res.json())
    .then(cart => {
        return fetch('/cart/update.js', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                attributes: {
                    transaction_id: transactionId,
                }
            }),
        });
    })
    .catch(error => console.error('Error updating cart:', error));

    // Find all product forms (including "Buy It Now" forms)
    const productForms = document.querySelectorAll('form[action^="/cart/add"]');
    console.log("Found product forms:", productForms.length);
    
    productForms.forEach((form) => {
        // Check if the hidden input already exists
        if (!form.querySelector('input[name="properties[transaction_id]"]')) {
            const hiddenInput = document.createElement("input");
            hiddenInput.type = "hidden";
            hiddenInput.name = "properties[transaction_id]";
            hiddenInput.value = transactionId;
            form.appendChild(hiddenInput);
            console.log("Added transaction ID to form");
        }
    });
}