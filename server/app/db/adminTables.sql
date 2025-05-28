CREATE TABLE community (
  community_id SERIAL PRIMARY KEY,          
  community_name VARCHAR(255) NOT NULL,    
  members INTEGER DEFAULT 0,                
  owner VARCHAR(255) NOT NULL,             
  contact_no VARCHAR(20),                   
  email VARCHAR(255)                        
);


ALTER TABLE users
ADD COLUMN status VARCHAR(10) NOT NULL DEFAULT 'active',
ADD CONSTRAINT status_check CHECK (status IN ('active', 'suspended'));

UPDATE users SET status = 'active' WHERE status IS NULL;

ALTER TABLE users
ADD COLUMN phone_no VARCHAR(11),
ADD CONSTRAINT phone_no_check CHECK (phone_no ~ '^\d{11}$');

ALTER TABLE communities
ADD COLUMN member_count INTEGER DEFAULT 0 CHECK (member_count >= 0);

ALTER TABLE communities
ADD COLUMN member_count INTEGER DEFAULT 0 CHECK (member_count >= 0);
