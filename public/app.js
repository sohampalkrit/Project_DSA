const map = L.map('map').setView([20.5937, 78.9629], 5);  // Centered in India
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);

// Coordinates for nodes (A to F)
const nodeCoordinates = {
  'A': [22.5726, 88.3639],   // Kolkata
  'B': [28.7041, 77.1025],   // Delhi
  'C': [19.0760, 72.8777],   // Mumbai
  'D': [13.0827, 80.2707],   // Chennai
  'E': [12.9716, 77.5946],   // Bangalore
  'F': [25.3176, 82.9739]    // Varanasi
};

const markers = {};
for (let node in nodeCoordinates) {
  markers[node] = L.marker(nodeCoordinates[node]).addTo(map)
    .bindPopup(node).openPopup();
}

// Fetch taxis and populate the dropdown
async function fetchTaxis() {
  const response = await fetch('/api/taxis');
  const taxis = await response.json();

  const taxiSelect = document.getElementById('taxi');
  taxis.forEach(taxi => {
    const option = document.createElement('option');
    option.value = taxi.id;
    option.text = taxi.name + ' (Location: ' + taxi.location + ')';
    taxiSelect.appendChild(option);
  });
}

fetchTaxis();

// Book a taxi and calculate the shortest path
async function bookTaxi() {
  const taxiId = document.getElementById('taxi').value;
  const start = document.getElementById('start').value;
  const end = document.getElementById('end').value;

  const response = await fetch('/api/book-taxi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taxiId, start, destination: end })
  });

  const data = await response.json();
  document.getElementById('result').innerText = `Taxi: ${data.taxi}, Shortest path: ${data.shortestPath.join(' -> ')}, Distance: ${data.distance} km`;

  // Draw the shortest path on the map
  if (window.currentPathLayer) {
    map.removeLayer(window.currentPathLayer);
  }

  const latlngs = data.shortestPath.map(node => nodeCoordinates[node]);
  window.currentPathLayer = L.polyline(latlngs, { color: 'blue' }).addTo(map);
}
