
async function showSection(section) {
  const res = await fetch('products.json');
  const data = await res.json();
  let html = '';

  if (section === 'budget') {
    html += '<h2>Select Your Budget</h2>';
    html += '<ul><li>₹5000–₹10000</li><li>₹11000–₹25000</li><li>₹25000–₹50000</li><li>₹50000–₹100000</li></ul>';
  } else if (data[section]) {
    html += `<h2>${section.toUpperCase()}</h2><ul>`;
    data[section].forEach(item => {
      html += `<li><strong>${item.name}</strong> - ₹${item.price} <br> ${item.specs}</li>`;
    });
    html += '</ul>';
  } else {
    html = 'No data found.';
  }

  document.getElementById('content').innerHTML = html;
}
