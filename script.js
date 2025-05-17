let allData = null; // cache for products.json

async function fetchData() {
  if (allData) return allData;
  try {
    const res = await fetch('products.json');
    if (!res.ok) throw new Error('Failed to fetch products');
    allData = await res.json();
    return allData;
  } catch (err) {
    console.error(err);
    document.getElementById('content').innerHTML = `<p class="error">Error loading data. Try refreshing.</p>`;
    return null;
  }
}

function renderBudget() {
  return `
    <h2>Select Your Budget</h2>
    <ul class="budget-list">
      <li>₹5000 – ₹10000</li>
      <li>₹11000 – ₹25000</li>
      <li>₹25000 – ₹50000</li>
      <li>₹50000 – ₹100000</li>
    </ul>
  `;
}

function renderSection(section, data) {
  if (!data || !data[section]) {
    return '<p>No data found for this section.</p>';
  }
  let html = `<h2>${section.charAt(0).toUpperCase() + section.slice(1)}</h2><ul class="product-list">`;
  data[section].forEach(item => {
    html += `
      <li>
        <strong>${item.name}</strong> - ₹${item.price} <br />
        <small>${item.specs}</small>
      </li>`;
  });
  html += '</ul>';
  return html;
}

async function showSection(section) {
  const content = document.getElementById('content');
  content.innerHTML = '<p>Loading...</p>';
  
  if (section === 'budget') {
    content.innerHTML = renderBudget();
    return;
  }
  
  const data = await fetchData();
  if (!data) return;
  
  content.innerHTML = renderSection(section, data);
}

// Setup event listeners after DOM loads
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-tabs button').forEach(button => {
    button.addEventListener('click', () => {
      showSection(button.dataset.section);
    });
  });
});
