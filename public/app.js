const map = L.map('map').setView([12.9141, 74.8560], 13);  // Centered in Mangalore
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);

// Coordinates for Mangalore locations
const nodeCoordinates = {
  'NITK': [13.0105121, 74.7937911],
  'Mangalore City Center': [12.91723, 74.85603],
  'Panambur Beach': [12.8472, 74.8642],
  'Tannirbhavi Beach': [12.89846, 74.81242],
  'Someshwara Beach': [12.8753, 74.8142],
  'Surathkal Beach': [12.980712, 74.803145],
  'Mangalore Beach': [12.91723, 74.85603],
  'Mangaladevi Temple': [12.85627, 74.83952],
  'Kudroli Gokarnath Temple': [12.876046, 74.831726],
  'Kadri Manjunath Temple': [12.885778,74.855583],
  'Sultan Battery': [12.8753, 74.8433],
  'Polali Rajarajeshwari Temple': [12.933954, 74.955291],
  'St. Aloysius Chapel': [12.873611, 74.845278],
  'Rosario Cathedral': [-32.9442426 , -60.650538799],
  'Milagres Church': [12.86686, 74.84437],
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
