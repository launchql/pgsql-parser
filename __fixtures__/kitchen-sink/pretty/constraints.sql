CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  total DECIMAL(10,2) CHECK (total > 0),
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT unique_user_date UNIQUE (user_id, created_at),
  CONSTRAINT check_status CHECK (status IN ('pending', 'completed', 'cancelled'))
);

ALTER TABLE products ADD CONSTRAINT fk_category 
  FOREIGN KEY (category_id) 
  REFERENCES categories(id) 
  ON UPDATE CASCADE 
  ON DELETE SET NULL 
  DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE products ADD CONSTRAINT check_price CHECK (price > 0);

ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);
