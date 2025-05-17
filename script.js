// Global state
let productsData = {};
let cart = [];
let filters = {
  includeRefurbished: false,
  showCompatibleOnly: false,
};
let currentSection = 'home';

// Utility: Load products.json and store globally
async function loadProducts() {
  try {
    const res = await fetch('products.json');
    productsData = await res.json();
  } catch (e) {
    console.error('Failed to load products.json:', e);
  }
}

// Utility: Check compatibility for an item based on cart and filters
function isCompatible(item) {
  if (!filters.showCompatibleOnly) return true;
  
  // Simple compatibility checks example
  if (item.category === 'Motherboards') {
    // Must match CPU socket in cart if CPU exists
    const cpu = cart.find(p => p.category === 'Processors');
    if (cpu && cpu.socket !== item.socket) return false;
  }
  if (item.category === 'RAM') {
    const motherboard = cart.find(p => p.category === 'Motherboards');
    if (motherboard && motherboard.ramType !== item.ramType) return false;
  }
  // Add more compatibility rules here...
  
  return true;
}

// Render products list for given section/category
function renderProducts(section) {
  if (!productsData[section]) {
    document.getElementById('content').innerHTML = `<p>No data found for ${section}</p>`;
    return;
  }
  let html = `<h2>${section}</h2><div class="product-grid">`;
  productsData[section].forEach(item => {
    if (!filters.includeRefurbished && item.condition === 'refurbished') return;
    if (!isCompatible(item)) return;
    html += `
      <div class="product-card">
        <img src="${item.image || 'images/placeholder.png'}" alt="${item.name}" />
        <h3>${item.name}</h3>
        <p>${item.specs}</p>
        <p>₹${item.price} - ${item.condition}</p>
        <button onclick="addToCart('${section}', '${item.id}')">Add to Cart</button>
      </div>`;
  });
  html += '</div>';
  document.getElementById('content').innerHTML = html;
}

// Add item to cart by section and product id
function addToCart(section, id) {
  const item = productsData[section].find(p => p.id === id);
  if (!item) return alert('Item not found!');
  
  // Compatibility warning if needed (simple example)
  if (!isCompatible(item)) {
    if (!confirm('Warning: This item may be incompatible with your current build. Add anyway?')) return;
  }
  
  cart.push(item);
  alert(`${item.name} added to cart!`);
  renderCart();
}

// Render the cart sidebar or content area
function renderCart() {
  if (cart.length === 0) {
    document.getElementById('content').innerHTML = '<h2>Your cart is empty</h2>';
    return;
  }
  let total = 0;
  let html = `<h2>Your Cart</h2><ul class="cart-list">`;
  cart.forEach((item, index) => {
    total += item.price;
    html += `<li>${item.name} - ₹${item.price} <button onclick="removeFromCart(${index})">Remove</button></li>`;
  });
  html += `</ul><h3>Total: ₹${total}</h3>`;
  document.getElementById('content').innerHTML = html;
}

// Remove item from cart by index
function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

// Show budget build options & results
function showBudgetBuild() {
  const budgets = [
    { label: '₹5,000–₹10,000', min: 5000, max: 10000 },
    { label: '₹11,000–₹25,000', min: 11000, max: 25000 },
    { label: '₹26,000–₹50,000', min: 26000, max: 50000 },
    { label: '₹51,000+', min: 51000, max: Infinity }
  ];

  let html = `<h2>Budget Builds</h2><ul class="budget-list">`;
  budgets.forEach(budget => {
    html += `<li><button onclick="suggestBuild(${budget.min}, ${budget.max})">${budget.label}</button></li>`;
  });
  html += '</ul><div id="budget-results"></div>';
  document.getElementById('content').innerHTML = html;
}

// Suggest a build within budget range
function suggestBuild(min, max) {
  const allProducts = Object.values(productsData).flat();
  const filtered = allProducts.filter(p => {
    if (!filters.includeRefurbished && p.condition === 'refurbished') return false;
    if (p.price < min || p.price > max) return false;
    if (!isCompatible(p)) return false;
    return true;
  });
  
  // Group by category and pick cheapest per category to try build a combo
  const categories = [...new Set(filtered.map(p => p.category))];
  let build = [];
  categories.forEach(cat => {
    const items = filtered.filter(p => p.category === cat);
    if (items.length) {
      build.push(items.reduce((a, b) => (a.price < b.price ? a : b)));
    }
  });

  let html = '<h3>Suggested Build:</h3><ul>';
  let total = 0;
  build.forEach(item => {
    html += `<li>${item.name} - ₹${item.price}</li>`;
    total += item.price;
  });
  html += `</ul><h4>Total: ₹${total}</h4>`;

  document.getElementById('budget-results').innerHTML = html;
}

// Apply filter toggles and refresh current view
function applyFilters() {
  filters.includeRefurbished = document.getElementById('refurbishedToggle').checked;
  filters.showCompatibleOnly = document.getElementById('compatibilityToggle').checked;

  if (currentSection === 'budget') {
    showBudgetBuild();
  } else if (currentSection === 'Cart') {
    renderCart();
  } else if (currentSection === 'home') {
    showHome();
  } else {
    renderProducts(currentSection);
  }
}

// Home page content with category cards
function showHome() {
  currentSection = 'home';
  let html = `
    <h1>Welcome to CoreLink</h1>
    <p>Build your perfect PC with smart compatibility and budget options.</p>
    <div class="category-cards">
      ${Object.keys(productsData).map(cat => `
        <div class="category-card" onclick="showSection('${cat}')">
          <h3>${cat}</h3>
          <p>${productsData[cat].length} Products</p>
        </div>`).join('')}
    </div>
  `;
  document.getElementById('content').innerHTML = html;
}

// Main showSection handler
async function showSection(section) {
  currentSection = section;
  if (Object.keys(productsData).length === 0) {
    await loadProducts();
  }

  if (section === 'home') {
    showHome();
  } else if (section === 'budget') {
    showBudgetBuild();
  } else if (section === 'Cart') {
    renderCart();
  } else {
    renderProducts(section);
  }
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  showSection('home');
});
