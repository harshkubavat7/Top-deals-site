let dealsData = [];
let sortDescending = true;

fetch('deals.json')
  .then(res => res.json())
  .then(data => {
    dealsData = data;

    // Populate categories dynamically
    const categories = [...new Set(dealsData.map(d => d.category))];
    const categorySelect = document.getElementById('categoryFilter');
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.toLowerCase();
      option.textContent = cat;
      categorySelect.appendChild(option);
    });

    renderDeals(dealsData);
  });

function renderDeals(deals) {
  const container = document.getElementById('deals-container');
  container.innerHTML = '';

  if (deals.length === 0) {
    container.innerHTML = '<p>No deals found.</p>';
    return;
  }

  deals.forEach(deal => {
    const card = document.createElement('div');
    card.className = 'deal-card';

    const discountBadge = document.createElement('div');
    discountBadge.className = 'discount-badge';
    discountBadge.textContent = `${deal.discount}% OFF`;

    const img = document.createElement('img');
    img.src = deal.image;
    img.alt = deal.title;

    const title = document.createElement('div');
    title.className = 'deal-title';
    title.textContent = deal.title;

    const prices = document.createElement('div');
    prices.className = 'deal-prices';
    prices.innerHTML = `₹${deal.salePrice} <span class="old-price">₹${deal.originalPrice}</span>`;

    const button = document.createElement('a');
    button.className = 'deal-button';
    button.href = `${deal.url}?tag=smartshop08e3-21`;
    button.target = '_blank';
    button.textContent = 'View Deal';

    card.appendChild(discountBadge);
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(prices);
    card.appendChild(button);

    container.appendChild(card);
  });
}

// Search functionality
document.getElementById('search').addEventListener('input', e => {
  filterAndRender();
});

// Category filter
document.getElementById('categoryFilter').addEventListener('change', () => {
  filterAndRender();
});

// Sort by discount
document.getElementById('sortDiscount').addEventListener('click', () => {
  sortDescending = !sortDescending;
  filterAndRender();
});

// Combined filter function
function filterAndRender() {
  const query = document.getElementById('search').value.toLowerCase();
  const category = document.getElementById('categoryFilter').value;

  let filtered = dealsData.filter(deal =>
    deal.title.toLowerCase().includes(query) &&
    (category === 'all' || deal.category.toLowerCase() === category)
  );

  filtered = filtered.sort((a, b) =>
    sortDescending ? b.discount - a.discount : a.discount - b.discount
  );

  renderDeals(filtered);
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then(() => console.log("✅ Service Worker Registered"))
    .catch(err => console.error("Service Worker failed:", err));
}

// Register Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/service-worker.js")
    .then(() => console.log("✅ Service Worker Registered"))
    .catch(err => console.error("SW failed:", err));
}

// OneSignal Push Config
window.OneSignal = window.OneSignal || [];
OneSignal.push(function() {
  OneSignal.init({
    appId: "YOUR-ONESIGNAL-APP-ID", // Replace with your OneSignal ID
  });
});

let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = "block"; // Show button
});

installBtn.addEventListener("click", async () => {
  installBtn.style.display = "none";
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install: ${outcome}`);
    deferredPrompt = null;
  }
});
