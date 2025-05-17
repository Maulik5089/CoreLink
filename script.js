let allData = null;

async function fetchData() {
  if (allData) return allData;
  try {
    const res = await fetch('products.json');
    allData = await res.json();
    return allData;
  } catch (err) {
    console.error('Data fetch error:', err);
    document.getElementById('content').innerHTML = '<p class="error">Failed to load data.</p>';
    return null;
  }
}

function renderBudget() {
  return `
    <h2>Select Your Budget</h2>
    <div class="budget-options">
      <button>₹5000 – ₹10000</button>
      <button>₹11000 – ₹25000</button>
      <button>₹25000 – ₹50000</button>
      <button>₹50000 – ₹100000</button>
    </div>
  `;
}

function renderSection(section, data) {
  if (!data || !data[section]) return '<p>No data available for this section.</p>';
  return `
    <h2>${section.charAt(0).toUpperCase() + section.slice(1)}</h2>
    <div class="cards">
      ${data[section]
        .map(item => `
          <div class="card">
            <h3>${item.name}</h3>
            <p class="price">₹${item.price}</p>
            <p class="specs">${item.specs}</p>
          </div>
        `)
        .join('')}
    </div>
  `;
}

async function showSection(section) {
  const content = document.getElementById('content');
  content.classList.remove('fade-in');
  content.innerHTML = '<p>Loading...</p>';

  if (section === 'budget') {
    content.innerHTML = renderBudget();
    content.classList.add('fade-in');
    return;
  }

  const data = await fetchData();
  if (!data) return;

  content.innerHTML = renderSection(section, data);
  content.classList.add('fade-in');
}

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-tabs button').forEach(btn => {
    btn.addEventListener('click', () => showSection(btn.dataset.section));
  });
});
