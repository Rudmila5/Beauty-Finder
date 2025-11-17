document.addEventListener('DOMContentLoaded', () => {
  const apiBaseURL = window.location.origin.includes('github.io') 
    ? 'https://beautyfinder-production.up.railway.app'  
    : 'http://localhost:4000';

  const searchInput = document.getElementById('search-input');
  const resultsContainer = document.getElementById('results-container');
  const loadingDiv = document.getElementById('loading');
  const searchForm = document.getElementById('searchForm');

 
  searchForm.addEventListener('submit', e => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) fetchSearchResults(query);
  });

  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search');
  if (searchQuery && searchQuery.trim() !== '') {
    searchInput.value = decodeURIComponent(searchQuery);
    fetchSearchResults(searchQuery);
  }

  async function fetchSearchResults(query) {
    resultsContainer.innerHTML = '';
    loadingDiv.style.display = 'block';

    try {
      const response = await fetch(`${apiBaseURL}/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      displayResults(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      displayErrorMessage('Error fetching products. Please try again later.');
    } finally {
      loadingDiv.style.display = 'none';
    }
  }

  function displayResults(data) {
    resultsContainer.innerHTML = '';
    if (!data || data.length === 0) {
      displayErrorMessage('No products found matching your search.');
      return;
    }

    data.forEach(product => {
   
      const img = new Image();
      img.src = product.image_url || 'https://via.placeholder.com/150';
      img.alt = product.product_name;
      img.classList.add('product-image');
      img.onerror = () => {
        img.src = 'https://via.placeholder.com/150';
      };

      img.onload = () => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-card');

        productDiv.appendChild(img);


        const brand = document.createElement('p');
        brand.classList.add('brand');
        brand.textContent = product.brand_name;
        productDiv.appendChild(brand);

        const title = document.createElement('p');
        title.classList.add('product-title');
        title.innerHTML = `<a href="${product.product_URL}" target="_blank">${product.product_name}</a>`;
        productDiv.appendChild(title);

        const category = document.createElement('p');
        category.classList.add('category');
        category.textContent = product.category_name;
        productDiv.appendChild(category);

        resultsContainer.appendChild(productDiv);
      };
    });
  }

  function displayErrorMessage(message) {
    resultsContainer.innerHTML = `<p class="error-message">${message}</p>`;
  }
});

