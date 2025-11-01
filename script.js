document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const categoryFilters = document.getElementById('category-filters');
    const searchInput = document.getElementById('search-input');
    const sortBy = document.getElementById('sort-by');
    const priceRange = document.getElementById('price-range');

    let products = [];

    // Fetch products from the local JSON file
    fetch('products.json')
        .then(response => response.json())
        .then(data => {
            products = data;
            displayProducts(products);
            populateFilters(products);
        });

    // Display products in the grid
    function displayProducts(productsToDisplay) {
        productGrid.innerHTML = '';
        productsToDisplay.forEach(product => {
                        let imageTag = '';
            if (product.imageUrl) {
                imageTag = `<img src="${product.imageUrl}" alt="${product.name}">`;
            }

            const productCard = `
                <div class="card">
                    ${imageTag}
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p>$${product.price.toFixed(2)}</p>
                        <p>Rating: ${product.rating}</p>
                        <a href="#" class="btn">View Details</a>
                    </div>
                </div>
            `;
            productGrid.innerHTML += productCard;
        });
    }

    // Populate filter options
    function populateFilters(products) {
        const categories = [...new Set(products.map(p => p.category))];

        categories.forEach(category => {
            const checkbox = `
                <div>
                    <input type="checkbox" value="${category}" id="category-${category}">
                    <label for="category-${category}">${category}</label>
                </div>
            `;
            categoryFilters.innerHTML += checkbox;
        });
    }

    // Filter and sort products
    function filterAndSortProducts() {
        let filteredProducts = [...products];

        // Filter by search term
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
        }

        // Filter by category
        const selectedCategories = Array.from(categoryFilters.querySelectorAll('input:checked')).map(cb => cb.value);
        if (selectedCategories.length > 0) {
            filteredProducts = filteredProducts.filter(p => selectedCategories.includes(p.category));
        }

        // Filter by price
        const price = parseInt(priceRange.value);
        filteredProducts = filteredProducts.filter(p => p.price <= price);

        // Sort products
        const sortByValue = sortBy.value;
        if (sortByValue === 'price-asc') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortByValue === 'price-desc') {
            filteredProducts.sort((a, b) => b.price - a.price);
        } else if (sortByValue === 'rating-desc') {
            filteredProducts.sort((a, b) => b.rating - a.rating);
        }

        displayProducts(filteredProducts);
    }

    // Event listeners
    searchInput.addEventListener('input', filterAndSortProducts);
    categoryFilters.addEventListener('change', filterAndSortProducts);
    priceRange.addEventListener('input', filterAndSortProducts);
    sortBy.addEventListener('change', filterAndSortProducts);
});