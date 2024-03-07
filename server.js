const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Bromley23',
    port: 5432,
});

// User Registration Endpoint
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, email } = req.body; // Add email here
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING *', // Include email in the query
            [username, email, hashedPassword]
        );
        res.json({ message: 'User registered successfully', user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// User Login Endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const userResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (userResult.rows.length > 0) {
            const user = userResult.rows[0];

            const match = await bcrypt.compare(password, user.password_hash);
            if (match) {
                res.json({ message: 'Login successful', user: user, userId: user.user_id });
            } else {
                res.status(400).send('Invalid credentials');
            }
        } else {
            res.status(400).send('User not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Endpoint to get all food items with their ratings
app.get('/api/foods', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM foods');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Endpoint to add a new food item with ratings
app.post('/api/foods', async (req, res) => {
    try {
        const { name, spiceRating, sweetRating, sourRating, bitterRating, umamiRating, saltRating, isHot, isCold } = req.body;
        const result = await pool.query(
            'INSERT INTO foods (name, spice_rating, sour_rating, sweet_rating, bitter_rating, umami_rating, salt_rating, is_hot, is_cold) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [name, spiceRating, sourRating, sweetRating, bitterRating, umamiRating, saltRating, isHot, isCold]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Endpoint to delete a food item
app.delete('/api/foods/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const result = await pool.query('DELETE FROM foods WHERE name = $1 RETURNING *', [name]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Endpoint to update ratings for a specific food item
app.put('/api/foods/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const { taste, rating } = req.body;
        // Update the specific taste rating for the food item
        // Example: UPDATE foods SET spice_rating = $1 WHERE name = $2
        res.json({ message: `Rating for ${name} updated` });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.get('/api/recent-searches/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const result = await pool.query('SELECT * FROM recent_searches WHERE user_id = (SELECT user_id FROM users WHERE username = $1)', [username]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
app.get('/api/favorites/:username', async (req, res) => {
    try {
        const { username } = req.params;
        const result = await pool.query('SELECT foods.* FROM favorites JOIN foods ON favorites.food_id = foods.id WHERE favorites.user_id = (SELECT user_id FROM users WHERE username = $1)', [username]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
// Endpoint to save a recent search
app.post('/api/recent-searches', async (req, res) => {
    try {
        const { userId, searchTerm } = req.body;
        const result = await pool.query(
            'INSERT INTO recent_searches (user_id, query) VALUES ($1, $2) RETURNING *', 
            [userId, searchTerm]
        );
        res.json({ message: 'Search saved', search: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

// Endpoint to add to favorites
app.post('/api/favorites', async (req, res) => {
    try {
        const { userId, foodId } = req.body;
        const result = await pool.query('INSERT INTO favorites (user_id, food_id) VALUES ($1, $2) RETURNING *', [userId, foodId]);
        res.json({ message: 'Added to favorites', favorite: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});
// Endpoint to remove from favorites
app.delete('/api/favorites/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM favorites WHERE id = $1', [id]);
        res.json({ message: 'Removed from favorites' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

