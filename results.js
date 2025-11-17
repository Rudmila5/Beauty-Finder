document.addEventListener('DOMContentLoaded', () => {
  const apiBaseURL = window.location.origin.includes('github.io') 
    ? 'https://beautyfinder-production.up.railway.app'  
    : 'http://localhost:4000';

  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');

  if (searchQuery && searchQuery.trim() !== '') {
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = decodeURIComponent(searchQuery);
    fetchSearchResults(searchQuery);
  } else {
    displayErrorMessage('No search query found. Please try searching for a product or ingredient.');
  }

  async function fetchSearchResults(query) {
    try {
      const response = await fetch(`${apiBaseURL}/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      displayResults(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      displayErrorMessage('Error fetching products. Please try again later.');
    }
  }

  function displayResults(data) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '';
    if (!data || data.length === 0) {
      resultsContainer.innerHTML = '<p>No products found matching your search.</p>';
      return;
    }

    data.forEach(product => {
      const productDiv = document.createElement('div');
      productDiv.classList.add('product-card');
      productDiv.innerHTML = `
        <img class="product-image" 
             src="${product.image_url || 'https://via.placeholder.com/150'}" 
             alt="${product.product_name}" 
             onerror="this.onerror=null;this.src='https://via.placeholder.com/150';">
        <p class="brand">${product.brand_name}</p>
        <p class="product-title">
          <a href="${product.product_URL}" target="_blank">${product.product_name}</a>
        </p>
        <p class="category">${product.category_name}</p>
      `;
      resultsContainer.appendChild(productDiv);
    });
  }

  function displayErrorMessage(message) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = `<p class="error-message">${message}</p>`;
  }
});


