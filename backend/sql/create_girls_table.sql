CREATE TABLE IF NOT EXISTS girls (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  state VARCHAR(20) NOT NULL CHECK (state IN (
    'Registered', 'Approved', 'Member', 'Leaver', 'Left', 'Rejected'
  ))
);
