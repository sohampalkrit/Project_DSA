const express = require('express');
const cors = require('cors');
const dijkstra = require('./api/dijkstra'); // Dijkstra's algorithm implementation

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files from the public directory

// Sample data for taxis
const taxis = [
  { id: 1, name: 'Taxi 1', location: 'A' },
  { id: 2, name: 'Taxi 2', location: 'B' },
  { id: 3, name: 'Taxi 3', location: 'C' }
];

// Graph structure for Dijkstra's algorithm
const graph = {
  A: { B: 5, D: 7 },
  B: { A: 5, D: 3, C: 4 },
  C: { B: 4, E: 6 },
  D: { A: 7, B: 3, F: 8 },
  E: { C: 6, F: 5 },
  F: { D: 8, E: 5 }
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
