
function searchIngredients() {
  const searchTerm = document.getElementById('search-input').value.trim();

  if (!searchTerm) {
    alert('Please enter an ingredient to search.');
    return;
  }

  window.location.href = `results.html?search=${encodeURIComponent(searchTerm)}`;
}

document.getElementById('search-button').addEventListener('click', searchIngredients);