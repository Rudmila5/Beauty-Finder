document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const searchTerm = params.get('search');

  if (!searchTerm) return;

  const resultsContainer = document.getElementById('results-container');

  try {
    const response = await fetch(`https://beautyfinder-production.up.railway.app/search?query=${encodeURIComponent(searchTerm)}`);
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      resultsContainer.innerHTML = '<p>No results found.</p>';
      return;
    }

resultsContainer.innerHTML = data.map(item => `
  <div class="product-card" onclick="window.open('${item.product_url}', '_blank')">
    <img src="${item.image_url || 'https://via.placeholder.com/150'}" alt="${item.product_name}">
    <h3 class="product-title">${item.product_name}</h3>
    <p class="brand">${item.brand_name}</p>
  </div>
`).join('');

  } catch (error) {
    console.error('Error fetching data:', error);
    resultsContainer.innerHTML = '<p>There was an error loading results.</p>';
    console.log(data);
  }
});
