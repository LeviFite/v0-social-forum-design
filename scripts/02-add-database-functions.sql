-- Function to increment topic reply count
CREATE OR REPLACE FUNCTION increment_topic_replies(topic_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE forum_topics 
  SET 
    reply_count = reply_count + 1,
    last_reply_at = NOW()
  WHERE id = topic_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update topic counts when replies are deleted
CREATE OR REPLACE FUNCTION decrement_topic_replies(topic_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE forum_topics 
  SET reply_count = GREATEST(reply_count - 1, 0)
  WHERE id = topic_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update topic reply count when replies are added
CREATE OR REPLACE FUNCTION update_topic_on_reply_insert()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM increment_topic_replies(NEW.topic_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update topic reply count when replies are deleted
CREATE OR REPLACE FUNCTION update_topic_on_reply_delete()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM decrement_topic_replies(OLD.topic_id);
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_update_topic_on_reply_insert ON forum_replies;
CREATE TRIGGER trigger_update_topic_on_reply_insert
  AFTER INSERT ON forum_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_topic_on_reply_insert();

DROP TRIGGER IF EXISTS trigger_update_topic_on_reply_delete ON forum_replies;
CREATE TRIGGER trigger_update_topic_on_reply_delete
  AFTER DELETE ON forum_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_topic_on_reply_delete();
