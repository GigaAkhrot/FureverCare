/* emergency.js - handles Emergency page interactions:
   - AOS init
   - LocalStorage: welcome name & visitor counter
   - Clock + Geolocation in ticker
*/

document.addEventListener("DOMContentLoaded", () => {
  if (window.AOS) AOS.init({ once: false, duration: 700 });

  // keys
  const KEY_NAME = "furever_firstname";
  const KEY_VIS = "furever_visitors";

  // elements
  const topLeft = document.getElementById("topLeft");
  const topRight = document.getElementById("topRight");
  const welcomeNameEl = document.getElementById("welcomeName");
  const visitorCounter = document.getElementById("visitorCounter");
  const visitCountText = document.getElementById("visitCountText");
  const localClock = document.getElementById("localClock");
  const tickerText = document.getElementById("tickerText");

  // helpers
  function getVisits() {
    return parseInt(localStorage.getItem(KEY_VIS) || "0", 10);
  }
  function bumpVisit() {
    let v = getVisits();
    v++;
    localStorage.setItem(KEY_VIS, v);
    if (visitorCounter) visitorCounter.textContent = 1000 + v;
    if (visitCountText) visitCountText.textContent = `Visited ${v} times`;
    return v;
  }

  function initUser() {
    const name = localStorage.getItem(KEY_NAME);
    const visits = getVisits();
    if (name) {
      if (welcomeNameEl) welcomeNameEl.textContent = name;
      if (topLeft)
        topLeft.innerHTML = `Hi, ${name}! (<span id="visitCountText">Visited ${visits} times</span>)`;
    } else {
      if (welcomeNameEl)
        welcomeNameEl.innerHTML =
          'Guest <button id="setNameBtn" class="btn btn-link btn-sm">Set Name</button>';
      if (topLeft)
        topLeft.innerHTML = `Hi, Guest! (<span id="visitCountText">Visited ${visits} times</span>)`;

      // attach button
      const setNameBtn = document.getElementById("setNameBtn");
      setNameBtn?.addEventListener("click", () => {
        const v = prompt("Enter your first name:") || "";
        if (v.trim()) {
          localStorage.setItem(KEY_NAME, v.trim());
          initUser();
        }
      });
    }
  }

  bumpVisit();
  initUser();

  // ticker clock + geolocation
  let coords = { lat: "--", long: "--" };

  function updateClock() {
    const now = new Date().toLocaleTimeString();
    if (localClock) localClock.textContent = now;

    const name = localStorage.getItem(KEY_NAME) || "Guest";
    const visits = getVisits();
    if (tickerText)
      tickerText.textContent = `${name} • Visitors: ${1000 + visits} • Location: ${coords.lat}, ${coords.long}`;
    if (topRight)
      topRight.textContent = `${now} | Lat: ${coords.lat}, Long: ${coords.long}`;
  }

  setInterval(updateClock, 1000);
  updateClock();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        coords.lat = pos.coords.latitude.toFixed(2);
        coords.long = pos.coords.longitude.toFixed(2);
      },
      () => {},
      { maximumAge: 600000, timeout: 7000 }
    );
  }
});

