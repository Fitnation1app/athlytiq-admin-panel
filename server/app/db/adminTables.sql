

ALTER TABLE users
ADD COLUMN status VARCHAR(10) NOT NULL DEFAULT 'active',
ADD CONSTRAINT status_check CHECK (status IN ('active', 'suspended'));

UPDATE users SET status = 'active' WHERE status IS NULL;

ALTER TABLE users
ADD COLUMN phone_no VARCHAR(11),
ADD CONSTRAINT phone_no_check CHECK (phone_no ~ '^\d{11}$');


ALTER TABLE communities
ADD COLUMN community_status VARCHAR(10);

UPDATE communities SET community_status = 'active' WHERE community_status IS NULL;

ALTER TABLE communities
ALTER COLUMN community_status SET NOT NULL,
ADD CONSTRAINT community_status_check CHECK (community_status IN ('active', 'restricted'));
