let allProducts = {};
let cart = [];

async function loadProducts() {
  const res = await fetch('products.json');
  allProducts = await res.json();
  renderCategory('processors');
}

function renderCategory(category) {
  const container = document.getElementById('product-list');
  container.innerHTML = '';
  if (!allProducts[category]) return;

  allProducts[category].forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.specs}</p>
      <p><strong>₹${product.price}</strong> 
        ${product.condition === 'refurbished' ? '<span class="refurb-tag">Refurbished</span>' : ''}
      </p>
      <button onclick='addToCart(${JSON.stringify(product)})'>Add to Cart</button>
    `;
    container.appendChild(card);
  });
}

function addToCart(product) {
  cart.push(product);
  renderCart();
}

function renderCart() {
  const cartBox = document.getElementById('cart-box');
  cartBox.innerHTML = '<h3>Your Cart</h3>';
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;
    cartBox.innerHTML += `
      <div class="cart-item">
        <span>${item.name} - ₹${item.price}</span>
        <button onclick='removeFromCart(${index})'>X</button>
      </div>
    `;
  });

  cartBox.innerHTML += `<h4>Total: ₹${total}</h4>`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function filterByBudget(min, max) {
  const container = document.getElementById('product-list');
  container.innerHTML = '';

  for (const cat in allProducts) {
    allProducts[cat].forEach(product => {
      if (product.price >= min && product.price <= max) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>${product.specs}</p>
          <p><strong>₹${product.price}</strong></p>
          <button onclick='addToCart(${JSON.stringify(product)})'>Add to Cart</button>
        `;
        container.appendChild(card);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', loadProducts);
