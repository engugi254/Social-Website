--Procedure to create a new post
CREATE PROCEDURE CreatePost
    @user_id INT,
    @content VARCHAR(255)
AS
BEGIN
    INSERT INTO Post (user_id, content, timestamp)
    VALUES (@user_id, @content, GETDATE())
END

EXEC CreatePost 2, "A fOURTH POST" 
SELECT * FROM POST
--Procedure to insert a user
CREATE PROCEDURE InsertUser
    @firstname VARCHAR(255),
    @lastname VARCHAR(255),
    @username VARCHAR(255),
    @email VARCHAR(255),
    @password VARCHAR(255)
AS
BEGIN
    INSERT INTO Users (firstname, lastname, username, email, password)
    VALUES (@firstname, @lastname, @username, @email, @password);
END;

CREATE PROCEDURE sp_SelectUserByUsername
(
  @Username varchar(50)
)
AS
BEGIN
  SELECT *
  FROM Users
  WHERE username = @Username;
END;

SELECT * FROM Users
CREATE PROCEDURE DeleteUser
    @user_id INT
AS
BEGIN
    -- Update the isDeleted column in the Users table
    UPDATE Users
    SET isDeleted = 1
    WHERE user_id = @user_id;

    -- Update the isDeleted column in the Post table
    UPDATE Post
    SET isDeleted = 1
    WHERE user_id = @user_id;

    -- Update the isDeleted column in the Comment table
    UPDATE Comment
    SET isDeleted = 1
    WHERE user_id = @user_id;

    -- Update the isDeleted column in the Notification table
    UPDATE Notification
    SET isDeleted = 1
    WHERE user_id = @user_id;

    -- Update the isDeleted column in the user_details table
    UPDATE Profile
    SET isDeleted = 1
    WHERE user_id = @user_id;
END

EXEC DeleteUser 5
--Procedure to insert a follower
CREATE PROCEDURE InsertFollower
    @user_id INT,
    @follower_user_id INT
AS
BEGIN
    INSERT INTO Followers (user_id, FollowerUserID, FollowDate)
    VALUES (@user_id, @follower_user_id, GetDate());
END;

DROP PROCEDURE InsertFollower
EXEC InsertFollower 1,1006
SELECT * FROM Followers
SELECT * FROM Notification

--Procedure to insert a comment
CREATE PROCEDURE InsertComment
    @post_id INT,
    @user_id INT,
    @content VARCHAR(MAX)
AS
BEGIN
    INSERT INTO Comment (post_id, user_id, content, timestamp)
    VALUES (@post_id, @user_id, @content, GETDATE());
END;
SELECT * FROM Comment
DROP PROCEDURE InsertComment
EXEC InsertComment 2,5,"Another comment"
SELECT * FROM Comment
SELECT * FROM Notification

--Procedure that inserts reply
CREATE PROCEDURE InsertChildReply
    @post_id INT,
    @user_id INT,
    @content VARCHAR(MAX),
    @parent_comment_id INT 
AS
BEGIN
    DECLARE @timestamp DATETIME = GETDATE();

    INSERT INTO Comment (post_id, user_id, content, timestamp, parent_comment_id)
    VALUES (@post_id, @user_id, @content, @timestamp,
           SELECT comment_id FROM Comment WHERE comment_id = @parent_comment_id);
END;

EXEC InsertChildReply 1,3,"Reply Another Comment"
Drop procedure InsertChildReply
SELECT * FROM Comment
SELECT * FROM Notification

--Procedure for likes
CREATE PROCEDURE InsertPostLike
    @post_id INT,
    @user_id INT
    
AS
BEGIN
    INSERT INTO PostLike (post_id, user_id, timestamp)
    VALUES (@post_id, @user_id, GETDATE());
END;

SELECT * FROM  PostLike
SELECT * FROM Users

DROP PROCEDURE InsertPostLike
EXEC InsertPostLike 2,1005

SELECT * FROM PostLike
SELECT * FROM Notification

--Procedure to delete a user account with associated data
CREATE PROCEDURE DeleteUserAccount
    @user_id INT
AS
BEGIN
    -- Delete user's posts
    DELETE FROM Post
    WHERE user_id = @user_id;

    -- Delete user's comments
    DELETE FROM Comment
    WHERE user_id = @user_id;

    -- Delete user's followers
    DELETE FROM Followers
    WHERE user_id = @user_id OR FollowerUserID = @user_id;

    -- Delete user's following
    DELETE FROM Following
    WHERE user_id = @user_id OR FollowingUserID = @user_id;

    -- Delete user's notifications
    DELETE FROM Notification
    WHERE user_id = @user_id;

    -- Finally, delete the user
    DELETE FROM Users
    WHERE user_id = @user_id;
END;

--Procedure to delete a post
CREATE PROCEDURE DeletePost
    @post_id INT
AS
BEGIN
    -- Delete the post
    DELETE FROM Post
    WHERE post_id = @post_id;

    -- Delete associated comments
    DELETE FROM Comment
    WHERE post_id = @post_id;
END;

--Procedure to delete a particular comment
CREATE PROCEDURE DeleteComment
    @comment_id INT
AS
BEGIN
    -- Delete the comment
    DELETE FROM Comment
    WHERE comment_id = @comment_id;
END;

--Procedure to Add profile of a user
CREATE PROCEDURE AddUserDetails
    @profile_id INT,
    @user_id INT,
    @profile_pic_url VARCHAR(255),
    @cover_pic_url VARCHAR(255),
    @contact_no VARCHAR(20),
    @address VARCHAR(255),
    @bio VARCHAR(MAX),
    @relationship_status VARCHAR(50),
    @gender CHAR(1)
AS
BEGIN
    INSERT INTO user_details (profile_id, user_id, profile_pic_url, cover_pic_url, contact_no, address, bio, relationship_status, gender)
    VALUES (@profile_id, @user_id, @profile_pic_url, @cover_pic_url, @contact_no, @address, @bio, @relationship_status, @gender);
END;

--Procedure to delete the profile of a user
CREATE PROCEDURE DeleteProfile
    @profile_id INT
AS
BEGIN
    DELETE FROM Profile
    WHERE profile_id = @profile_id;
END;

--Procedure to calculate the total number of followers a follower has
CREATE PROCEDURE GetFollowerCount
    @user_id INT
AS
BEGIN
    DECLARE @follower_count INT;

    SELECT @follower_count = COUNT(*) 
    FROM Followers
    WHERE user_id = @user_id;

    SELECT @follower_count AS follower_count;
END;
EXEC GetFollowerCount 1

--Procedure to calculate the total number of likes a post has
CREATE PROCEDURE GetPostLikeCount
    @post_id INT
AS
BEGIN
    DECLARE @like_count INT;
    SELECT @like_count = COUNT(*)
    FROM PostLike
    WHERE post_id = @post_id;

    SELECT @like_count AS like_count;
END;
DROP PROCEDURE GetPostLikeCount
EXEC GetPostLikeCount 2