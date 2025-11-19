const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Restaurant data (can be moved to database later)
const restaurants = {
  jollibee: {
    name: 'Jollibee',
    cuisine: 'Filipino Fast Food',
    rating: 4.8,
    menu: {
      'MCDO Meals': [
        { name: '1-pc Chickenjoy w/ Rice', description: 'Crispy fried chicken with garlic rice and gravy', price: 99 },
        { name: '2-pc Chickenjoy w/ Jolly Spaghetti', description: 'Two pieces of Chickenjoy with sweet-style spaghetti', price: 199 }
      ],
      'Burgers': [
        { name: 'Yumburger', description: 'Classic burger with special dressing', price: 45 },
        { name: 'Cheesy Deluxe Burger', description: 'Burger with cheese, bacon, and mushrooms', price: 99 }
      ],
      'Jolly Spaghetti & Others': [
        { name: 'Jolly Spaghetti', description: 'Sweet-style spaghetti with hotdog slices', price: 75 },
        { name: 'Palabok', description: 'Rice noodles with shrimp sauce and toppings', price: 85 }
      ]
    },
    locations: [
      { name: 'SM City Cebu', address: 'North Reclamation Area' },
      { name: 'Ayala Center Cebu', address: 'Cebu Business Park' },
      { name: "Robinson's Cybergate", address: 'Fuente Osmeña' },
      { name: 'Colon Street', address: 'Downtown Cebu City' },
      { name: 'IT Park', address: 'Apas, Lahug' },
      { name: 'Banilad Town Centre', address: 'Maria Luisa Road, Banilad' }
    ]
  },
  'mang-inasal': {
    name: 'Mang Inasal',
    cuisine: 'Grilled Chicken Specialist',
    rating: 4.7,
    menu: {
      'Paa & Pecho Meals': [
        { name: 'PM1 - Paa Large w/ Unlimited Rice', description: 'Chicken leg quarter with unlimited rice and soup', price: 135 },
        { name: 'PM2 - Pecho Large w/ Unlimited Rice', description: 'Chicken breast with unlimited rice and soup', price: 150 }
      ],
      'Ihaw-Sarap Meals': [
        { name: 'Pork BBQ (2 sticks) w/ Rice', description: 'Grilled pork skewers with rice and drink', price: 119 },
        { name: 'Bangus (Milkfish) w/ Rice', description: 'Grilled milkfish belly with rice and soup', price: 165 }
      ]
    },
    locations: [
      { name: 'SM City Cebu', address: 'North Reclamation Area' },
      { name: 'Ayala Center Cebu', address: 'Cebu Business Park' },
      { name: 'Gaisano Country Mall', address: 'Banilad' },
      { name: 'JY Square Mall', address: 'Lahug' },
      { name: 'Elizabeth Mall', address: 'Fuente Osmeña' }
    ]
  }
  // Add other restaurants here...
};

// API Routes

// Get all restaurants
app.get('/api/restaurants', (req, res) => {
  const restaurantList = Object.keys(restaurants).map(id => ({
    id,
    name: restaurants[id].name,
    cuisine: restaurants[id].cuisine,
    rating: restaurants[id].rating
  }));
  res.json(restaurantList);
});

// Get specific restaurant details
app.get('/api/restaurants/:id', (req, res) => {
  const restaurant = restaurants[req.params.id];
  if (restaurant) {
    res.json({ id: req.params.id, ...restaurant });
  } else {
    res.status(404).json({ error: 'Restaurant not found' });
  }
});

// Get restaurant menu
app.get('/api/restaurants/:id/menu', (req, res) => {
  const restaurant = restaurants[req.params.id];
  if (restaurant) {
    res.json({ menu: restaurant.menu });
  } else {
    res.status(404).json({ error: 'Restaurant not found' });
  }
});

// Get restaurant locations
app.get('/api/restaurants/:id/locations', (req, res) => {
  const restaurant = restaurants[req.params.id];
  if (restaurant) {
    res.json({ locations: restaurant.locations });
  } else {
    res.status(404).json({ error: 'Restaurant not found' });
  }
});

// Search restaurants
app.get('/api/search', (req, res) => {
  const query = req.query.q?.toLowerCase();
  if (!query) {
    return res.json([]);
  }

  const results = Object.keys(restaurants)
    .filter(id => {
      const restaurant = restaurants[id];
      return restaurant.name.toLowerCase().includes(query) ||
             restaurant.cuisine.toLowerCase().includes(query);
    })
    .map(id => ({
      id,
      name: restaurants[id].name,
      cuisine: restaurants[id].cuisine,
      rating: restaurants[id].rating
    }));

  res.json(results);
});

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🍽️  Cebu Food Guide server is running on http://localhost:${PORT}`);
  console.log(`📱 API endpoints available at http://localhost:${PORT}/api`);
});

module.exports = app;