
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) CHECK (price > 0),
  category_id INTEGER,
  description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP,
  UNIQUE (name, category_id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  subtotal DECIMAL(10,2) NOT NULL,
  tax_rate DECIMAL(5,4) DEFAULT 0.0825,
  tax_amount DECIMAL(10,2) GENERATED ALWAYS AS (subtotal * tax_rate) STORED,
  total DECIMAL(10,2) GENERATED ALWAYS AS (subtotal + tax_amount) STORED
);

CREATE TABLE sales (
  id SERIAL,
  sale_date DATE NOT NULL,
  amount DECIMAL(10,2),
  region VARCHAR(50)
) PARTITION BY RANGE (sale_date);

CREATE TEMPORARY TABLE temp_calculations (
  id INTEGER,
  value DECIMAL(15,5),
  result TEXT
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  total DECIMAL(10,2) CHECK (total > 0),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);