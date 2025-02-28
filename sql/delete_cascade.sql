CREATE TABLE join_groups(
    id SERIAL PRIMARY KEY,
    user_id uuid NOT NULL,
    FOREIGN KEY (user_id) REFERENCES profiles(id),
    group_id INT NOT NULL,
    FOREIGN KEY (group_id) REFERENCES groups(id),
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.update_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_join_groups
BEFORE UPDATE ON join_groups
FOR EACH ROW EXECUTE FUNCTION update_timestamp();