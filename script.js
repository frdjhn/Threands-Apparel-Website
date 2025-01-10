// Element selectors
const navbar = document.querySelector('.navbar');
const searchForm = document.querySelector('.search-form');
const cartItem = document.querySelector('.cart-items-container');
const searchBtn = document.querySelector('#search-btn');
const cartBtn = document.querySelector('#cart-btn');
const menuBtn = document.querySelector('#menu-btn');

// Menu toggle
menuBtn.onclick = () => {
    navbar.classList.toggle('active');
    closeOtherToggles(searchForm, cartItem);
};

// Search form toggle
searchBtn.onclick = () => {
    searchForm.classList.toggle('active');
    closeOtherToggles(navbar, cartItem);
};

// Cart toggle
cartBtn.onclick = () => {
    cartItem.classList.toggle('active');
    closeOtherToggles(navbar, searchForm);
};

// Close all toggles on scroll
window.onscroll = () => closeAllToggles(navbar, searchForm, cartItem);

// Close cart container when clicking outside
document.addEventListener('click', (e) => {
    if (!cartItem.contains(e.target) && !e.target.closest('#cart-btn')) {
        cartItem.classList.remove('active');
    }
    if (!searchForm.contains(e.target) && !e.target.closest('#search-btn')) {
        searchForm.classList.remove('active');
    }
});

// Close all toggles
function closeAllToggles(...elements) {
    elements.forEach(el => el.classList.remove('active'));
}

// Close other toggles except the current one
function closeOtherToggles(...elements) {
    elements.forEach(el => el.classList.remove('active'));
}



// Search function to filter items
function searchItems() {
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    const items = document.querySelectorAll('.box');

    items.forEach(item => {
        const itemName = item.querySelector('h3').textContent.toLowerCase();
        item.style.display = itemName.includes(searchQuery) ? 'block' : 'none';
    });
}





// Change main image
function changeMainImage(mainPhotoId, newSrc) {
    // Get the main photo element by its ID
    const mainPhoto = document.getElementById(mainPhotoId);
    // Change the src of the main photo to the clicked thumbnail's image source
    mainPhoto.src = newSrc;
}


    function goToCollection(itemId) {
        // Redirect to the collection page with the item ID as a hash
        window.location.href = `collection.html#${itemId}`;
    }

    document.addEventListener('DOMContentLoaded', () => {
        const hash = window.location.hash.substring(1); // Get the hash without the #
        if (hash) {
            const target = document.querySelector(`[data-item="${hash}"]`);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' }); // Scroll smoothly to the element
            }

        } document.addEventListener("DOMContentLoaded", () => {
            const hash = window.location.hash;
            if (hash) {
                const target = document.querySelector(hash);
                if (target) {
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }
        });
    });



   // JavaScript to handle "Add to Cart" and dynamic cart updates
document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.querySelector("#cart-items");
    const cartButton = document.querySelector("#cart-btn");
    const cartCount = document.querySelector("#cart-count");
    const cartContent = document.querySelector(".cart-items-container");

    let cartItems = [];

    // Update the cart count dynamically
    const updateCartCount = () => {
        cartCount.textContent = cartItems.length > 0 ? cartItems.length : "";
    };

    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll(".box .btn").forEach((button) => {
        button.addEventListener("click", (event) => {
            event.preventDefault();

            // Find the parent box of the clicked button
            const box = button.closest(".box");

            // Get the selected item details
            const title = box.querySelector("h3").textContent;
            const price = box.querySelector(".price").childNodes[0]?.textContent.trim() || "0"; // Discounted price
            const originalPrice = box.querySelector(".price span")?.textContent.trim() || "0"; // Original price
            const imageSrc = box.querySelector(".main-photo img").src; // Get the image source
            const selectedColor = box.querySelector(".colors span.selected")?.title || "No Color Selected";
            const selectedSize = box.querySelector(".sizes button.selected")?.textContent || "No Size Selected";

            // Check if both color and size are selected
            if (selectedColor === "No Color Selected" || selectedSize === "No Size Selected") {
                alert("Please select a color and size.");
                return;
            }

            // Check if the item is already in the cart
            const existingItem = cartItems.find(item =>
                item.title === title && item.color === selectedColor && item.size === selectedSize
            );

            if (existingItem) {
                alert("This item is already in the cart.");
                return;
            }

            // Create a cart item object
            const newItem = { title, price, originalPrice, color: selectedColor, size: selectedSize, quantity: 1 };

            // Add item to cart
            cartItems.push(newItem);

            // Create a cart item element
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <span class="fas fa-times"></span>
                <img src="${imageSrc}" alt="Item Image">
                <div class="content">
                    <h3>${title}</h3>
                    <p>Color: ${selectedColor}</p>
                    <p>Size: ${selectedSize}</p>
                    <div class="price">
                        <div class="price">${price} <span>${originalPrice}</span></div>
                    </div>
                    <div class="quantity-control"> Quantity:
                        <button class="decrease">-</button>
                        <input type="number" class="quantity" value="1" min="1">
                        <button class="increase">+</button>
                    </div>
                </div>
            `;

            // Add event listeners for quantity adjustment
            const decreaseBtn = cartItem.querySelector(".decrease");
            const increaseBtn = cartItem.querySelector(".increase");
            const quantityInput = cartItem.querySelector(".quantity");

            decreaseBtn.addEventListener("click", () => {
                let quantity = parseInt(quantityInput.value);
                if (quantity > 1) {
                    quantityInput.value = quantity - 1;
                    newItem.quantity = quantity - 1;
                }
            });

            increaseBtn.addEventListener("click", () => {
                let quantity = parseInt(quantityInput.value);
                quantityInput.value = quantity + 1;
                newItem.quantity = quantity + 1;
            });

            quantityInput.addEventListener("change", () => {
                let quantity = parseInt(quantityInput.value);
                if (quantity < 1 || isNaN(quantity)) {
                    quantity = 1;
                    quantityInput.value = 1;
                }
                newItem.quantity = quantity;
            });

            // Add delete functionality to the new cart item
            cartItem.querySelector(".fas.fa-times").addEventListener("click", () => {
                cartItems = cartItems.filter(item => !(item.title === newItem.title && item.color === newItem.color && item.size === newItem.size));
                cartItem.remove();
                updateCartCount();
            });

            // Add the new cart item to the cart container
            cartContent.appendChild(cartItem);

            // Update cart count
            updateCartCount();
        });
    });

    // Add event listeners to color and size options
    document.querySelectorAll(".colors span").forEach((colorOption) => {
        colorOption.addEventListener("click", () => {
            const colors = colorOption.closest(".colors").querySelectorAll("span");
            colors.forEach((span) => span.classList.remove("selected"));
            colorOption.classList.add("selected");
        });
    });

    document.querySelectorAll(".sizes button").forEach((sizeButton) => {
        sizeButton.addEventListener("click", () => {
            const sizes = sizeButton.closest(".sizes").querySelectorAll("button");
            sizes.forEach((button) => button.classList.remove("selected"));
            sizeButton.classList.add("selected");
        });
    });
});



// Initialize favorites list
const favoritesKey = 'userFavorites';
let favorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];

// Function to toggle favorite status
function toggleFavorite(element, itemId) {
    if (favorites.includes(itemId)) {
        favorites = favorites.filter(id => id !== itemId);
        element.classList.remove('active'); // Remove visual indicator
    } else {
        favorites.push(itemId);
        element.classList.add('active'); // Add visual indicator
        element.style.color = "#d3ad7f"; 
    }
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
}

// Function to display favorites in user.html
function displayFavorites() {
    const container = document.getElementById('user-favorites-container');
    if (!container) return;

    const items = [
        { id: 'sw-set1', image: 'street wear/BlackSW1.jpg', name: 'Crew Neck Short Sleeve T-Shirt & Drawstring Shorts' },
        { id: 'cw-set2', image: 'casual wear/ArmyGreenCW2.jpg', name: 'Long-Sleeved Shirt & Drawstring Casual Pants' },
        { id: 'fw-set2', image: 'formal wear/BurgundyFW2.jpg', name: "Men's Retro Herringbone Single Breasted Dress Waistcoat" },
    ];

    container.innerHTML = ''; // Clear existing content

    favorites.forEach(favoriteId => {
        const item = items.find(i => i.id === favoriteId);
        if (item) {
            const favoriteBox = document.createElement('div');
            favoriteBox.classList.add('box');
            favoriteBox.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="content">
                    <h3>${item.name}</h3>
                </div>
            `;
            container.appendChild(favoriteBox);
        }
    });
}

// Execute displayFavorites on user.html
if (document.getElementById('user-favorites-container')) {
    displayFavorites();
}

// Highlight active favorites on product.html
document.querySelectorAll('.fa-heart').forEach(heart => {
    const itemId = heart.getAttribute('onclick').match(/'([^']+)'/)[1];
    if (favorites.includes(itemId)) {
        heart.classList.add('active');
    }
});


// Call the loadFavorites function when the user.html page is loaded
if (document.title === 'Threands Apparel - User') {
    loadFavorites();
}





//BLOGS
function toggleContent(button) {
    const shortContent = button.previousElementSibling.previousElementSibling;
    const fullContent = button.previousElementSibling;
    
    if (fullContent.style.display === "none") {
        fullContent.style.display = "block";
        shortContent.style.display = "none";
        button.textContent = "read less";
    } else {
        fullContent.style.display = "none";
        shortContent.style.display = "block";
        button.textContent = "read more";
    }
}

document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting

    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    if (email === "admin@gmail.com" && password === "admin") {
        window.location.href = "home.html"; // Redirect to home.html
    } else {
        alert("Incorrect email or password.");
    }
});

