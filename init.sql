CREATE DATABASE IF NOT EXISTS good_hamburger;
USE good_hamburger;

-- Tabla de items del menú
CREATE TABLE IF NOT EXISTS menu_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    type ENUM('sandwich', 'extra') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de órdenes
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sandwich_id INT,
    has_fries BOOLEAN DEFAULT FALSE,
    has_soft_drink BOOLEAN DEFAULT FALSE,
    subtotal DECIMAL(10, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sandwich_id) REFERENCES menu_items(id)
);

-- Insertar datos iniciales del menú
INSERT INTO menu_items (name, price, type) VALUES
('Burger', 5.00, 'sandwich'),
('Egg', 4.50, 'sandwich'),
('Bacon', 7.00, 'sandwich'),
('Fries', 2.00, 'extra'),
('Soft drink', 2.50, 'extra');