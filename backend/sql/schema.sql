DROP TABLE IF EXISTS claims;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  phone VARCHAR(40),
  role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(160) NOT NULL,
  description TEXT NOT NULL,
  report_type VARCHAR(20) NOT NULL CHECK (report_type IN ('Lost', 'Found')),
  report_status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (report_status IN ('Active', 'Resolved')),
  category VARCHAR(80) NOT NULL,
  location VARCHAR(120) NOT NULL,
  image_url TEXT NOT NULL,
  contact_email VARCHAR(160) NOT NULL,
  contact_phone VARCHAR(40),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

CREATE TABLE claims (
  id SERIAL PRIMARY KEY,
  item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  claimant_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  contact_email VARCHAR(160) NOT NULL,
  contact_phone VARCHAR(40),
  status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_hash CHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_items_type ON items(report_type);
CREATE INDEX idx_items_status ON items(report_status);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_location ON items(location);
CREATE INDEX idx_items_owner ON items(owner_id);
CREATE INDEX idx_items_created ON items(created_at DESC);
CREATE INDEX idx_claims_item ON claims(item_id);
CREATE INDEX idx_claims_claimant ON claims(claimant_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_sessions_hash ON sessions(session_hash);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
