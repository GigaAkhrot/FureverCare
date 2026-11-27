document.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) AOS.init({ once: false, duration: 700 });

  // keys
  const KEY_NAME = 'furever_firstname';
  const KEY_VIS = 'furever_visitors';
  const KEY_PET = 'furever_pet_profile';

  // DOM references
  const topLeft = document.getElementById('topLeft');
  const topRight = document.getElementById('topRight');
  const welcomeNameEl = document.getElementById('welcomeName');
  const visitCountText = document.getElementById('visitCountText');
  const visitorCounter = document.getElementById('visitorCounter');
  const localClock = document.getElementById('localClock');
  const tickerText = document.getElementById('tickerText');

  // global co-ords
  let coords = { lat: '--', long: '--' };

  // visits
  function getVisits() {
    return parseInt(localStorage.getItem(KEY_VIS) || '0', 10);
  }
  function bumpVisit() {
    let v = getVisits() + 1;
    localStorage.setItem(KEY_VIS, v);
    visitorCounter.textContent = 1000 + v;
    if (visitCountText) visitCountText.textContent = `Visited ${v} times`;
    return v;
  }

  // user
  function initUser() {
    const name = localStorage.getItem(KEY_NAME);
    if (name) {
      welcomeNameEl.textContent = name;
      topLeft.innerHTML = `Hi, ${name}! (<span id="visitCountText">Visited ${getVisits()} times</span>)`;
    } else {
      welcomeNameEl.innerHTML = 'Guest <button id="setNameBtn" class="btn btn-link btn-sm">Set Name</button>';
      const setNameBtn = document.getElementById('setNameBtn');
      setNameBtn?.addEventListener('click', () => {
        const v = prompt('Enter your first name:') || '';
        if (v.trim()) {
          localStorage.setItem(KEY_NAME, v.trim());
          initUser();
        }
      });
      topLeft.innerHTML = `Hi, Guest! (<span id="visitCountText">Visited ${getVisits()} times</span>)`;
    }
  }

  bumpVisit();
  initUser();

  // pet profile
  const petForm = document.getElementById('petProfileForm');
  const petSummary = document.getElementById('petSummary');

  function renderPet() {
    const raw = localStorage.getItem(KEY_PET);
    if (!raw) { petSummary.textContent = 'No pet saved.'; return; }
    const p = JSON.parse(raw);
    petSummary.innerHTML = `<strong>${p.name}</strong> — ${p.species}, ${p.breed || 'Unknown'}, ${p.age || 'N/A'} yrs`;
  }
  renderPet();

  petForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const p = {
      name: document.getElementById('petName').value.trim(),
      species: document.getElementById('petSpecies').value,
      breed: document.getElementById('petBreed').value.trim(),
      age: document.getElementById('petAge').value,
      vacc: document.getElementById('petVacc').value.trim()
    };
    localStorage.setItem(KEY_PET, JSON.stringify(p));
    renderPet();
  });

  document.getElementById('clearPet')?.addEventListener('click', () => {
    localStorage.removeItem(KEY_PET);
    renderPet();
  });

  // feeding chart
  const ctx = document.getElementById('feedingChart')?.getContext('2d');

  const ageLabels = ['0–3m', '4–6m', '7–12m', '1–3y', '4–6y', 'Senior'];

  const datasets = {
    puppy: {
      label: 'Puppy (g/day)',
      data: [80, 120, 180, 230, 270, 310],
      borderColor: '#C7A57A',
      backgroundColor: 'rgba(199,165,122,0.12)'
    },
    adultDog: {
      label: 'Adult Dog (g/day)',
      data: [250, 300, 320, 300, 280, 260],
      borderColor: '#1a1a2e',
      backgroundColor: 'rgba(26,26,46,0.06)'
    },
    kitten: {
      label: 'Kitten (g/day)',
      data: [40, 55, 70, 85, 100, 110],
      borderColor: '#f28e2b',
      backgroundColor: 'rgba(242,142,43,0.12)'
    },
    adultCat: {
      label: 'Adult Cat (g/day)',
      data: [50, 55, 60, 65, 70, 75],
      borderColor: '#80502c',
      backgroundColor: 'rgba(128,78,44,0.12)'
    },
    rabbit: {
      label: 'Rabbit (pellets g/day)',
      data: [30, 50, 70, 90, 100, 85],
      borderColor: '#d17c5c',
      backgroundColor: 'rgba(209,124,92,0.15)'
    },
    bird: {
      label: 'Bird (seeds g/day)',
      data: [5, 10, 15, 20, 18, 15],
      borderColor: '#4e79a7',
      backgroundColor: 'rgba(78,121,167,0.12)'
    },
    fish: {
      label: 'Fish (flakes g/day)',
      data: [1, 2, 3, 4, 4, 3],
      borderColor: '#59a14f',
      backgroundColor: 'rgba(89,161,79,0.12)'
    },
    reptile: {
      label: 'Reptile (g/day)',
      data: [10, 20, 25, 30, 28, 26],
      borderColor: '#e15759',
      backgroundColor: 'rgba(225,87,89,0.12)'
    },
  };

  if (ctx) {
    window.fchart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ageLabels,
        datasets: [datasets.puppy] // default dataset
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
          title: { display: true, text: 'Daily Feeding Guide (grams per day)' },
          tooltip: {
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: ${context.formattedValue} g/day`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Grams per Day' }
          },
          x: {
            title: { display: true, text: 'Age Group' }
          }
        }
      }
    });
  }

  // toggle buttons
  document.querySelectorAll('[data-chart]').forEach(btn => {
    btn.addEventListener('click', () => {
      const k = btn.getAttribute('data-chart');
      if (window.fchart && datasets[k]) {
        window.fchart.data.datasets = [datasets[k]];
        window.fchart.update();
      }
    });
  });



  // products
  const productData = [
    { id: 1, name: 'Healthy Kibble - Chicken', category: 'Dog Food', price: 24.99, img: 'images/Healthy Kibble - Chicken.png', desc: 'High protein adult dog food.' },
    { id: 2, name: 'Purrfect Tuna Meal', category: 'Cat Food', price: 18.00, img: 'images/Purrfect Tuna Meal.webp', desc: 'Grain-free tuna recipe.' },
    { id: 3, name: 'Squeaky Duck Toy', category: 'Toys', price: 6.50, img: 'images/Squeaky Duck Toy.webp', desc: 'Durable squeaky toy.' },
    { id: 4, name: 'Premium Groom Kit', category: 'Grooming', price: 29.99, img: 'images/Premium Groom Kit.webp', desc: 'Brushes, combs & scissors.' },
    { id: 5, name: 'Cloudbed Small', category: 'Bedding', price: 34.45, img: 'images/Cloudbed Small.webp', desc: 'Soft cozy bed for small pets.' },
    { id: 6, name: 'Omega Supplement', category: 'Supplements', price: 15.00, img: 'images/omega supplements.webp', desc: 'Supports coat health.' },
    { id: 7, name: 'Senior Care Kibble', category: 'Dog Food', price: 27.99, img: 'images/Senior Care Kibble.png', desc: 'Easier digestion for seniors.' }

  ];

  const productsGrid = document.getElementById('productsGrid');
  const searchBox = document.getElementById('searchBox');
  const filterCategory = document.getElementById('filterCategory');
  const sortPrice = document.getElementById('sortPrice');
  const noResults = document.getElementById('noResults');

  function currency(n) { return '$' + Number(n).toFixed(2); }
  function renderProducts(list) {
  if (!productsGrid) return;
  productsGrid.innerHTML = '';
  if (!list.length) {
    noResults?.classList.remove('d-none');
    return;
  }
  noResults?.classList.add('d-none');

  list.forEach(p => {
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-md-4 col-lg-3 d-flex'; // keep responsive
    col.innerHTML = `
      <div class="product-card card w-100 h-100">
        <img src="${p.img}" alt="${p.name}">
        <div class="p-2 d-flex flex-column flex-grow-1">
          <div class="fw-bold mb-1" style="min-height:46px;">${p.name}</div>
          <div class="tiny mb-2">${p.desc}</div>

          <div class="mt-auto">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <div class="text-muted tiny">${p.category}</div>
              <div class="fw-bold">${currency(p.price)}</div>
            </div>
            <div class="card-buttons">
              <button class="btn btn-sm btn-outline-secondary viewBtn flex-fill" data-id="${p.id}">View</button>
              <button class="btn btn-sm btn-primary buyBtn flex-fill" data-id="${p.id}">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    `;
    productsGrid.appendChild(col);
  });
}



  renderProducts(productData);
  function applyFilters() {
    const q = (searchBox?.value || '').toLowerCase().trim();
    const cat = (filterCategory?.value || 'all');
    let list = productData.filter(p => {
      const matchQ = p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      const matchCat = (cat === 'all') || (p.category === cat);
      return matchQ && matchCat;
    });
    const s = sortPrice?.value;
    if (s === 'asc') list.sort((a, b) => a.price - b.price);
    if (s === 'desc') list.sort((a, b) => b.price - a.price);
    renderProducts(list);
  }
  searchBox?.addEventListener('input', applyFilters);
  filterCategory?.addEventListener('change', applyFilters);
  sortPrice?.addEventListener('change', applyFilters);

  // product modal handling
  productsGrid?.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const id = +btn.dataset.id;
    const product = productData.find(x => x.id === id);
    if (!product) return;

    if (btn.classList.contains('viewBtn')) {
      document.getElementById('productModalTitle').textContent = product.name;
      document.getElementById('productModalBody').innerHTML = `
        <img src="${product.img}" alt="${product.name}" class="img-fluid mb-3 rounded">
        <p>${product.desc}</p>
        <p><strong>Category:</strong> ${product.category}</p>
        <p><strong>Price:</strong> ${currency(product.price)}</p>
      `;
      const modalBuyBtn = document.getElementById('modalBuyBtn');
      modalBuyBtn.onclick = () => alert(`Buy Now clicked for ${product.name} (demo)`);
      new bootstrap.Modal(document.getElementById('productModal')).show();
    }

    if (btn.classList.contains('buyBtn')) {
      alert(`Buy Now clicked for ${product.name} (demo)`);
    }
  });

  // clock nticker
  function updateClock() {
    const now = new Date().toLocaleTimeString();
    if (localClock) localClock.textContent = now;

    const name = localStorage.getItem(KEY_NAME) || 'Guest';
    const visits = getVisits();
    const petName = localStorage.getItem(KEY_PET) ? JSON.parse(localStorage.getItem(KEY_PET)).name : 'No pet saved';

    if (tickerText) {
      tickerText.textContent = `${name} • Pet: ${petName} • Visitors: ${1000 + visits} • Location: ${coords.lat}, ${coords.long}`;
    }
    if (topRight) {
      topRight.textContent = `${now} | Lat: ${coords.lat}, Long: ${coords.long}`;
    }
  }
  setInterval(updateClock, 1000);
  updateClock();

  // geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(pos => {
      coords.lat = pos.coords.latitude.toFixed(2);
      coords.long = pos.coords.longitude.toFixed(2);
    }, () => {
      coords.lat = 'N/A';
      coords.long = 'N/A';
    }, { maximumAge: 600000, timeout: 7000 });
  }
});


// ===============================
// useless
// ===============================

// document.addEventListener("DOMContentLoaded", () => {

//   // --- Visitor Counter ---
//   const visitCountKey = "fureverCareVisits";
//   let visits = localStorage.getItem(visitCountKey);
//   visits = visits ? parseInt(visits) + 1 : 1;
//   localStorage.setItem(visitCountKey, visits);
//   document.getElementById("visitCountText").textContent = `Visited ${visits} ${visits === 1 ? "time" : "times"}`;
//   document.getElementById("visitorCounter").textContent = visits;

//   // --- Welcome Name ---
//   const welcomeName = localStorage.getItem("fureverUserName") || "Guest";
//   document.getElementById("welcomeName").textContent = welcomeName;

//   // --- Local Time & Geolocation ---
//   const topRight = document.getElementById("topRight");
//   const localClock = document.getElementById("localClock");
//   function updateTime() {
//     const now = new Date();
//     localClock.textContent = now.toLocaleTimeString();
//     topRight.textContent = `${now.toLocaleTimeString()} | Lat: --, Long: --`;
//   }
//   setInterval(updateTime, 1000);
//   updateTime();

//   // --- Pet Profile Management ---
//   const petForm = document.getElementById("petProfileForm");
//   const petSummary = document.getElementById("petSummary");
//   const clearPetBtn = document.getElementById("clearPet");

//   function loadPet() {
//     const pet = JSON.parse(localStorage.getItem("petProfile") || "{}");
//     if (pet.name) {
//       document.getElementById("petName").value = pet.name || "";
//       document.getElementById("petSpecies").value = pet.species || "Dog";
//       document.getElementById("petBreed").value = pet.breed || "";
//       document.getElementById("petAge").value = pet.age || "";
//       document.getElementById("petWeight").value = pet.weight || "";
//       document.getElementById("petGender").value = pet.gender || "Male";
//       document.getElementById("petVacc").value = pet.vaccination || "";
//       document.getElementById("petNotes").value = pet.notes || "";
//       petSummary.textContent = `${pet.name} (${pet.species})`;
//     } else {
//       petSummary.textContent = "No pet saved.";
//     }
//   }

//   petForm.addEventListener("submit", e => {
//     e.preventDefault();
//     const pet = {
//       name: document.getElementById("petName").value.trim(),
//       species: document.getElementById("petSpecies").value,
//       breed: document.getElementById("petBreed").value,
//       age: document.getElementById("petAge").value,
//       weight: document.getElementById("petWeight").value,
//       gender: document.getElementById("petGender").value,
//       vaccination: document.getElementById("petVacc").value,
//       notes: document.getElementById("petNotes").value
//     };
//     localStorage.setItem("petProfile", JSON.stringify(pet));
//     loadPet();
//     alert("Pet profile saved!");
//   });

//   clearPetBtn.addEventListener("click", () => {
//     localStorage.removeItem("petProfile");
//     petForm.reset();
//     loadPet();
//   });

//   loadPet();

//   // --- Feeding Chart (Chart.js) ---
//   const feedingChartCtx = document.getElementById("feedingChart").getContext("2d");
//   const feedingData = {
//     puppy: [50, 70, 100, 120],
//     adultDog: [100, 120, 150, 180],
//     kitten: [30, 50, 70, 90],
//     adultCat: [70, 90, 120, 150],
//     rabbit: [20, 30, 40, 50],
//     bird: [5, 10, 15, 20],
//     fish: [1, 2, 3, 4],
//     reptile: [10, 15, 20, 25]
//   };
//   const feedingLabels = ["Morning", "Noon", "Evening", "Night"];

//   const feedingChart = new Chart(feedingChartCtx, {
//     type: "bar",
//     data: {
//       labels: feedingLabels,
//       datasets: [{
//         label: "Grams per meal",
//         data: feedingData.puppy,
//         backgroundColor: "rgba(255, 99, 132, 0.6)"
//       }]
//     },
//     options: {
//       responsive: true,
//       scales: { y: { beginAtZero: true } }
//     }
//   });

//   document.querySelectorAll("[data-chart]").forEach(btn => {
//     btn.addEventListener("click", () => {
//       const type = btn.getAttribute("data-chart");
//       feedingChart.data.datasets[0].data = feedingData[type];
//       feedingChart.update();
//     });
//   });

//   // --- Products Grid Filter/Search ---
//   const products = [
//     { name: "Dog Food - Chicken", category: "Dog Food", price: 20 },
//     { name: "Cat Food - Salmon", category: "Cat Food", price: 18 },
//     { name: "Bird Cage", category: "Bird Supplies", price: 45 },
//     { name: "Rabbit Hay Pack", category: "Rabbit Supplies", price: 12 },
//     { name: "Fish Tank", category: "Fish Supplies", price: 60 },
//     { name: "Reptile Heat Lamp", category: "Reptile Supplies", price: 35 },
//     { name: "Dog Chew Toy", category: "Toys", price: 10 },
//     { name: "Cat Grooming Brush", category: "Grooming", price: 8 },
//     { name: "Pet Bed - Large", category: "Bedding", price: 50 },
//     { name: "Vitamin Supplements", category: "Supplements", price: 25 }
//   ];

//   const productsGrid = document.getElementById("productsGrid");
//   const noResults = document.getElementById("noResults");

//   function renderProducts(list) {
//     productsGrid.innerHTML = "";
//     if (list.length === 0) {
//       noResults.classList.remove("d-none");
//       return;
//     } else {
//       noResults.classList.add("d-none");
//     }
//     list.forEach(p => {
//       const col = document.createElement("div");
//       col.className = "col";
//       col.innerHTML = `
//         <div class="card h-100 p-2">
//           <h6 class="mb-1">${p.name}</h6>
//           <p class="tiny mb-1">Category: ${p.category}</p>
//           <p class="tiny mb-0">Price: $${p.price}</p>
//         </div>
//       `;
//       productsGrid.appendChild(col);
//     });
//   }

//   renderProducts(products);

//   const searchBox = document.getElementById("searchBox");
//   const filterCategory = document.getElementById("filterCategory");
//   const sortPrice = document.getElementById("sortPrice");

//   function filterProducts() {
//     let filtered = products.filter(p => {
//       const searchText = searchBox.value.toLowerCase();
//       return p.name.toLowerCase().includes(searchText);
//     });
//     const category = filterCategory.value;
//     if (category !== "all") filtered = filtered.filter(p => p.category === category);

//     const sort = sortPrice.value;
//     if (sort === "asc") filtered.sort((a,b) => a.price - b.price);
//     if (sort === "desc") filtered.sort((a,b) => b.price - a.price);

//     renderProducts(filtered);
//   }

//   searchBox.addEventListener("input", filterProducts);
//   filterCategory.addEventListener("change", filterProducts);
//   sortPrice.addEventListener("change", filterProducts);

// });
