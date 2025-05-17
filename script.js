// CoreLink script.js

// Global variables
let products = [];
let filteredProducts = [];
let cart = [];

// Elements
const productContainer = document.getElementById('product-container');
const categoryFilter = document.getElementById('category-filter');
const conditionToggle = document.getElementById('condition-toggle');
const budgetFilter = document.getElementById('budget-filter');
const cartContainer = document.getElementById('cart-container');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const compatibilityWarnings = document.getElementById('compatibility-warnings');

// Load products from JSON file
async function loadProducts() {
    try {
        const response = await fetch('products.json');
        products = await response.json();
        filteredProducts = products;
        renderProducts(filteredProducts);
        populateCategoryFilter();
    } catch (err) {
        console.error('Error loading products:', err);
    }
}

// Render product cards
function renderProducts(items) {
    productContainer.innerHTML = '';
    if(items.length === 0) {
        productContainer.innerHTML = '<p>No products found for selected filters.</p>';
        return;
    }
    items.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <h3>${product.name}</h3>
            <p>${product.specs}</p>
            <p>₹${product.price} <span class="condition-tag">${product.condition === 'refurbished' ? '(Refurbished)' : ''}</span></p>
            <button onclick="addToCart('${product.id}')">Add to Cart</button>
        `;
        productContainer.appendChild(card);
    });
}

// Populate category filter options
function populateCategoryFilter() {
    const categories = [...new Set(products.map(p => p.category))];
    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);
    });
}

// Filter products based on category, condition, and budget
function applyFilters() {
    let filtered = [...products];

    // Category filter
    const selectedCategory = categoryFilter.value;
    if (selectedCategory !== 'all') {
        filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Condition toggle filter
    if (!conditionToggle.checked) {  // If toggle off, only new products
        filtered = filtered.filter(p => p.condition === 'new');
    }

    // Budget filter
    const selectedBudget = budgetFilter.value;
    if (selectedBudget !== 'all') {
        const [min, max] = selectedBudget.split('-').map(x => Number(x));
        filtered = filtered.filter(p => p.price >= min && p.price <= max);
    }

    filteredProducts = filtered;
    renderProducts(filteredProducts);
}

// Cart functions
function addToCart(id) {
    const product = products.find(p => p.id === id);
    if(!product) return;

    // Check compatibility warning
    if(hasCompatibilityConflict(product)) {
        alert('Warning: This product may be incompatible with your current build!');
    }

    cart.push(product);
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    cartContainer.innerHTML = '';
    let total = 0;
    cart.forEach((item, idx) => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <span>${item.name} - ₹${item.price}</span>
            <button onclick="removeFromCart(${idx})">Remove</button>
        `;
        cartContainer.appendChild(div);
    });
    cartTotal.textContent = `Total: ₹${total}`;
    cartCount.textContent = `Items: ${cart.length}`;

    // Show compatibility warnings
    showCompatibilityWarnings();
}

// Basic compatibility check (example)
function hasCompatibilityConflict(newProduct) {
    // For demo, check CPU & Motherboard socket mismatch
    if(newProduct.category === 'CPU') {
        const motherboard = cart.find(p => p.category === 'Motherboard');
        if(motherboard && motherboard.socket !== newProduct.socket) {
            return true;
        }
    }
    if(newProduct.category === 'Motherboard') {
        const cpu = cart.find(p => p.category === 'CPU');
        if(cpu && cpu.socket !== newProduct.socket) {
            return true;
        }
    }
    return false;
}

// Show compatibility warnings for all cart items
function showCompatibilityWarnings() {
    let warnings = [];
    const cpu = cart.find(p => p.category === 'CPU');
    const motherboard = cart.find(p => p.category === 'Motherboard');

    if(cpu && motherboard && cpu.socket !== motherboard.socket) {
        warnings.push('CPU and Motherboard socket do not match!');
    }

    // Add more compatibility checks here...

    if(warnings.length > 0) {
        compatibilityWarnings.innerHTML = warnings.map(w => `<p class="warning">${w}</p>`).join('');
    } else {
        compatibilityWarnings.innerHTML = '';
    }
}

// Event listeners for filters
categoryFilter.addEventListener('change', applyFilters);
conditionToggle.addEventListener('change', applyFilters);
budgetFilter.addEventListener('change', applyFilters);

// Initialization
loadProducts();
updateCart();
