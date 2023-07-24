CREATE TRIGGER trgAfterInsertComment
ON Comments
AFTER INSERT
AS
BEGIN
    DECLARE @postId INT, @commentUserId INT, @postUserId INT;

    SELECT @postId = post_id, @commentUserId = user_id
    FROM inserted;

    -- Get the user ID of the post owner
    SELECT @postUserId = user_id
    FROM Posts
    WHERE post_id = @postId;

    -- Insert a new row into the Notifications table for the comment
    INSERT INTO Notifications (user_id, type, source_user_id, post_id)
    VALUES (@postUserId, 'comment', @commentUserId, @postId);
END;

CREATE TRIGGER trg_PostLike
ON PostLike
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @postId INT;
    DECLARE @likedByUserId INT;
    
    SELECT @postId = post_id, @likedByUserId = user_id
    FROM inserted;
    
    INSERT INTO Notifications (user_id, type, source_user_id, post_id)
    VALUES (@postId, 'like', @likedByUserId, @postId);
END;

CREATE TRIGGER trg_Followers
ON Followers
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @followerUserId INT;
    DECLARE @followedUserId INT;
    
    SELECT @followerUserId = follower_user_id, @followedUserId = followed_user_id
    FROM inserted;
    
    INSERT INTO Notifications (user_id, type, source_user_id, post_id)
    VALUES (@followedUserId, 'follow', @followerUserId, NULL);
END;















//OLDER VERSION









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
    SET @details = 'You have received a new like';


    INSERT INTO Notification (user_id, notification_type, related_id, timestamp,details)
    VALUES (@user_id, @notification_type, @post_id, @timestamp,@details);
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



CREATE TRIGGER trg_InsertFollower
ON Followers
AFTER INSERT
AS
BEGIN
    DECLARE @user_id INT, @follower_id INT, @notification_type VARCHAR(50), @timestamp DATETIME;
    
    SELECT @user_id = user_id, @follower_id = FollowerID, @timestamp = FollowDate
    FROM inserted;
    
    SET @notification_type = 'Follow';
    SET @details = 'Someone has followed you'

    INSERT INTO Notification (user_id, notification_type, related_id, timestamp,details)
    VALUES (@user_id, @notification_type, @follower_id, @timestamp,@details);
END;
select * from followers


CREATE TRIGGER DeletePostTrigger
ON Post
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Delete comments associated with the deleted post
    DELETE FROM Comments
    WHERE post_id IN (SELECT post_id FROM DELETED);
    
    -- Delete likes associated with the deleted post
    DELETE FROM Likes
    WHERE post_id IN (SELECT post_id FROM DELETED);
END;

