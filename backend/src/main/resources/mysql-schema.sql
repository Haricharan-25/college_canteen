-- CampusBite MySQL Database Schema & Sample Data Initialization
CREATE DATABASE IF NOT EXISTS campusbite_db;
USE campusbite_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'STUDENT',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Food Items Table
CREATE TABLE IF NOT EXISTS food (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    image_url TEXT,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    food_id BIGINT NOT NULL,
    food_name VARCHAR(120) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (food_id) REFERENCES food(id) ON DELETE RESTRICT
);

-- Insert Default Seed Users (Passwords stored plain/hashed for direct project demo)
INSERT INTO users (id, name, email, password, role) VALUES
(1, 'Admin Canteen Staff', 'admin@canteen.com', 'admin123', 'ADMIN'),
(2, 'Rahul Sharma', 'rahul@college.edu', 'student123', 'STUDENT'),
(3, 'Priya Patel', 'priya@college.edu', 'student123', 'STUDENT')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Insert Diverse Realistic Food Items Across Categories
INSERT INTO food (id, name, description, price, category, image_url, available) VALUES
(1, 'Masala Dosa with Sambar & Chutney', 'Crispy golden crepe made of fermented rice-lentil batter filled with mildly spiced potato masala, served with fresh coconut chutney and hot aromatic sambar.', 60.00, 'Breakfast', 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80', TRUE),
(2, 'Idli Vada Combo', 'Two steamed fluffy rice cakes and one crispy golden medu vada served with home-style spiced lentil sambar and tangy tomato chutney.', 50.00, 'Breakfast', 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80', TRUE),
(3, 'Paneer Butter Masala Meal', 'Rich creamy tomato gravy with tender cottage cheese cubes, served with 2 warm butter rotis, fragrant jeera rice, and cucumber salad.', 120.00, 'Lunch', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80', TRUE),
(4, 'Special Veg Biryani Combo', 'Dum-cooked long-grain basmati rice with farm vegetables, saffron, mint, and spices. Accompanied by creamy boondi raita and spicy salan.', 110.00, 'Lunch', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80', TRUE),
(5, 'Samosa Chaat Platter', 'Two crushed golden spiced potato samosas topped with warm chana masala, sweetened yoghurt, mint chutney, and tamarind drizzle.', 45.00, 'Snacks', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80', TRUE),
(6, 'Veg Grilled Cheese Sandwich', 'Three-layer grilled whole wheat bread stuffed with melted mozzarella, bell peppers, sweet corn, and house herb-mayo spread.', 70.00, 'Snacks', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80', TRUE),
(7, 'Pav Bhaji Extra Butter', 'Spiced buttery mashed vegetable medley slow-cooked on tawa, served with 2 toasted pav buns, lemon wedge, and chopped red onions.', 75.00, 'Snacks', 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop&q=80', TRUE),
(8, 'Kulhad Masala Chai', 'Freshly brewed strong Assam tea leaves boiled with crushed ginger, green cardamom, cloves, and whole milk, served piping hot.', 20.00, 'Beverages', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80', TRUE),
(9, 'Cold Coffee with Ice Cream', 'Chilled frothy dark coffee blended with milk, sweetened cream, and crowned with a generous scoop of vanilla ice cream and chocolate syrup.', 55.00, 'Beverages', 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80', TRUE),
(10, 'Fresh Mango Lassi', 'Rich, thick chilled yogurt beverage blended with sweet Alphonso mango pulp, cardamom, and roasted pistachio slivers.', 50.00, 'Beverages', 'https://images.unsplash.com/photo-1553787499-6f9133860278?w=600&auto=format&fit=crop&q=80', FALSE)
ON DUPLICATE KEY UPDATE name=VALUES(name);
