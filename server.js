const express = require('express');
const cors = require('cors');
const dijkstra = require('./api/dijkstra'); // Dijkstra's algorithm implementation

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from the public directory

// Sample data for taxis
const taxis = [
  { id: 1, name: 'Taxi 1', location: 'NITK' },
  { id: 2, name: 'Taxi 2', location: 'Mangalore City Center' },
  { id: 3, name: 'Taxi 3', location: 'Kudroli Gokarnath Temple' },
];

// Graph structure for Dijkstra's algorithm with distances in kilometers
const graph = {
  'NITK': { 'Mangalore City Center': 17, 'Surathkal Beach': 2, 'Panambur Beach': 4 },
  'Mangalore City Center': { 'NITK': 17, 'Kudroli Gokarnath Temple': 3, 'Milagres Church': 2 },
  'Panambur Beach': { 'NITK': 4, 'Tannirbhavi Beach': 6 },
  'Tannirbhavi Beach': { 'Panambur Beach': 6, 'Mangalore Beach': 9 },
  'Surathkal Beach': { 'NITK': 2 },
  'Someshwara Beach': { 'Mangalore City Center': 13 },
  'Mangalore Beach': { 'Tannirbhavi Beach': 9 },
  'Mangaladevi Temple': { 'Mangalore City Center': 8 },
  'Kudroli Gokarnath Temple': { 'Mangalore City Center': 3 },
  'Kadri Manjunath Temple': { 'Mangalore City Center': 5 },
  'Sultan Battery': { 'Mangalore City Center': 4 },
  'Polali Rajarajeshwari Temple': { 'Mangalore City Center': 16 },
  'St. Aloysius Chapel': { 'Mangalore City Center': 2 },
  'Rosario Cathedral': { 'Mangalore City Center': 2 },
  'Milagres Church': { 'Mangalore City Center': 2 },
};

// Endpoint to get list of taxis
app.get('/api/taxis', (req, res) => {
  res.json(taxis);
});

// Endpoint to book a taxi and calculate the shortest path
app.post('/api/book-taxi', (req, res) => {
  const { taxiId, start, destination } = req.body;
  const selectedTaxi = taxis.find(taxi => taxi.id === parseInt(taxiId));

  // Calculate the shortest path using Dijkstra's algorithm
  const result = dijkstra(graph, start, destination);
  
  res.json({ taxi: selectedTaxi.name, shortestPath: result.path, distance: result.distance });
});

// Start the server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
