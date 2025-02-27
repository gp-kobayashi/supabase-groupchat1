CREATE TABLE trigger_update_group_members(
    user_id uuid NOT NULL,
    FOREIGN KEY (user_id) REFERENCES profiles(id),
    group_id INT NOT NULL,
    FOREIGN KEY (group_id) REFERENCES groups(id),
    role VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,
    invited_user uuid,
    FOREIGN KEY (invited_user) REFERENCES profiles(id),
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leave_at TIMESTAMP DEFAULT NULL,
    PRIMARY KEY (user_id, group_id)
);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.update_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_trigger_update_group_members
BEFORE UPDATE ON trigger_update_group_members
FOR EACH ROW EXECUTE FUNCTION update_timestamp();