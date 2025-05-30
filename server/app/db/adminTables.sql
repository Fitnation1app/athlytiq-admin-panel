

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


INSERT INTO posts (
    id,
    user_id,
    content,
    media_url,
    post_type,
    workout_post_id,
    challenge_post_id,
    created_at,
    updated_at,
    report_count
) VALUES (
    gen_random_uuid(),
    '79ef6b55-7ac4-4693-a5b1-bab28c270e6f',
    'This is a sample text post for testing purposes.',
    NULL,
    '{text}',       
    NULL,
    NULL,
    now(),
    now(),
    0
);


-- Function to update report_count in posts table
CREATE OR REPLACE FUNCTION update_report_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts
  SET report_count = (
    SELECT COUNT(*)
    FROM reported_posts
    WHERE reported_post_id = COALESCE(NEW.reported_post_id, OLD.reported_post_id)
  )
  WHERE id = COALESCE(NEW.reported_post_id, OLD.reported_post_id);

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;


-- Trigger for INSERT
CREATE TRIGGER trg_report_count_insert
AFTER INSERT ON reported_posts
FOR EACH ROW
EXECUTE FUNCTION update_report_count();


-- Trigger for DELETE
CREATE TRIGGER trg_report_count_delete
AFTER DELETE ON reported_posts
FOR EACH ROW
EXECUTE FUNCTION update_report_count();
