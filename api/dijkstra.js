function dijkstra(graph, start, destination) {
    const distances = {};
    const previous = {};
    const queue = new Set();
  
    // Initialize distances and queue
    for (let node in graph) {
      distances[node] = Infinity;
      previous[node] = null;
      queue.add(node);
    }
    distances[start] = 0;
  
    while (queue.size > 0) {
      // Get the node with the smallest distance
      let currentNode = Array.from(queue).reduce((minNode, node) => 
        distances[node] < distances[minNode] ? node : minNode
      );
  
      if (currentNode === destination) {
        // Reconstruct the shortest path
        const path = [];
        let temp = destination;
        while (temp) {
          path.unshift(temp);
          temp = previous[temp];
        }
        return { path, distance: distances[destination] };
      }
  
      queue.delete(currentNode);
  
      for (let neighbor in graph[currentNode]) {
        const alt = distances[currentNode] + graph[currentNode][neighbor];
        if (alt < distances[neighbor]) {
          distances[neighbor] = alt;
          previous[neighbor] = currentNode;
        }
      }
    }
  
    return { path: [], distance: Infinity }; // No path found
  }
  
  module.exports = dijkstra;
  