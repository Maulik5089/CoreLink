// script.js

let products = [];
let cart = [];

// Fetch products from JSON
fetch('products.json')
  .then(res => res.json())
  .then(data => {
    products = data;
    displayProducts(products);
  });

// Display product cards
function displayProducts(productsList) {
  const area = document.getElementById('product-area');
  area.innerHTML = '';
  productsList.forEach(product => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="images/${product.image}" alt="${product.name}">
      <h4>${product.name}</h4>
      <p>${product.specs}</p>
      <p>₹${product.price}</p>
      <button class="add-to-cart" onclick="addToCart('${product.id}')">Add to Cart</button>
    `;
    area.appendChild(card);
  });
}

// Add product to cart
function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (product) {
    cart.push(product);
    updateCart();
  }
}

// Update cart UI
function updateCart() {
  const cartEl = document.getElementById('cart');
  const totalPriceEl = document.getElementById('total-price');
  cartEl.innerHTML = '<h2>Your Build</h2>';
  let total = 0;
  cart.forEach(item => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <strong>${item.name}</strong> - ₹${item.price}
    `;
    cartEl.appendChild(el);
    total += item.price;
  });
  const totalEl = document.createElement('div');
  totalEl.className = 'total-price';
  totalEl.id = 'total-price';
  totalEl.textContent = `Total: ₹${total}`;
  cartEl.appendChild(totalEl);
}

// Toggle cart visibility
function toggleCart() {
  const cart = document.getElementById('cart');
  cart.classList.toggle('open');
}
