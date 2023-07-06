
--Trigger on likes to notifications
CREATE TRIGGER trg_InsertLikeNotification
ON PostLike
AFTER INSERT
AS
BEGIN
    DECLARE @user_id INT, @post_id INT, @notification_type VARCHAR(50), @timestamp DATETIME;
    
    SELECT @user_id = user_id, @post_id = post_id, @timestamp = timestamp
    FROM inserted;
    
    SET @notification_type = 'Like';
    
    INSERT INTO Notification (user_id, notification_type, related_id, timestamp)
    VALUES (@user_id, @notification_type, @post_id, @timestamp);
END;

--Trigger for Reactions on Comments
CREATE TRIGGER trg_InsertCommentReactionNotification
ON CommentReaction_New
AFTER INSERT
AS
BEGIN
    DECLARE @user_id INT,@comment_id INT, @notification_type VARCHAR(50), @timestamp DATETIME;
    
    SELECT @user_id = user_id,@comment_id=comment_id, @timestamp = timestamp
    FROM inserted;
    
    SET @notification_type = 'Comment Reaction';
  
    INSERT INTO Notification (user_id, notification_type,related_id, timestamp)
    VALUES (@user_id, @notification_type,@comment_id, @timestamp);
END;
select * from Notification
select * from PostLike
select * from CommentReaction_New

--Trigger after a comment is inserted
CREATE TRIGGER trg_InsertCommentNotification
ON Comment
AFTER INSERT
AS
BEGIN
    DECLARE @user_id INT, @post_id INT, @notification_type VARCHAR(50), @timestamp DATETIME;
    
    SELECT @user_id = user_id, @post_id = post_id, @timestamp = timestamp
    FROM inserted;
    
    SET @notification_type = 'New Comment';
    
    INSERT INTO Notification (user_id, notification_type, related_id, timestamp)
    VALUES (@user_id, @notification_type, @post_id, @timestamp);
END;
select * from notification
CREATE TRIGGER trg_InsertFollower
ON Followers
AFTER INSERT
AS
BEGIN
    DECLARE @user_id INT, @follower_id INT, @notification_type VARCHAR(50), @timestamp DATETIME;
    
    SELECT @user_id = user_id, @follower_id = FollowerID, @timestamp = FollowDate
    FROM inserted;
    
    SET @notification_type = 'Follow';
    
    INSERT INTO Notification (user_id, notification_type, related_id, timestamp)
    VALUES (@user_id, @notification_type, @follower_id, @timestamp);
END;
select * from followers


