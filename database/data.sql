-- User table
CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
	 firstname VARCHAR(255) NOT NULL,
	 lastname VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL 
);
CREATE TABLE Post (
    post_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    content VARCHAR(MAX) NOT NULL,
	image VARCHAR(255),
    timestamp DATETIME NOT NULL,
    CONSTRAINT FK_Post_User FOREIGN KEY (user_id) REFERENCES Users (user_id)
);

CREATE TABLE Followers (
    FollowerID INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    FollowerUserID INT NOT NULL,
    FollowDate DATETIME NOT NULL,
    CONSTRAINT FK_Followers_UserID FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT FK_Followers_FollowerUserID FOREIGN KEY (FollowerUserID) REFERENCES Users(user_id)
);
CREATE TABLE Following (
    FollowingID INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    FollowingUserID INT NOT NULL,
    FollowDate DATETIME NOT NULL,
    CONSTRAINT FK_Following_UserID FOREIGN KEY (user_id) REFERENCES Users(user_id),
    CONSTRAINT FK_Following_FollowingUserID FOREIGN KEY (FollowingUserID) REFERENCES Users(user_id)
);

-- Comment table
CREATE TABLE Comment (
    comment_id INT IDENTITY(1,1) PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content VARCHAR(MAX) NOT NULL,
    timestamp DATETIME NOT NULL,
	parent_comment_id INT,
    CONSTRAINT FK_Comment_Post FOREIGN KEY (post_id) REFERENCES Post (post_id),
    CONSTRAINT FK_Comment_User FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Reply (
    reply_id INT IDENTITY(1,1) PRIMARY KEY,
    comment_id INT NOT NULL,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content VARCHAR(MAX) NOT NULL,
    timestamp DATETIME NOT NULL,
    isDeleted BIT DEFAULT 0,
    CONSTRAINT FK_Reply_Comment FOREIGN KEY (comment_id) REFERENCES Comment (comment_id),
    CONSTRAINT FK_Reply_Post FOREIGN KEY (post_id) REFERENCES Post (post_id),
    CONSTRAINT FK_Reply_User FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Notification (
    notification_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    related_id INT NOT NULL,
    timestamp DATETIME NOT NULL,
    CONSTRAINT FK_Notification_User FOREIGN KEY (user_id) REFERENCES Users (user_id)
);
CREATE TABLE PostLike (
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    timestamp DATETIME NOT NULL,
    PRIMARY KEY (post_id, user_id),
    CONSTRAINT FK_PostLike_Post FOREIGN KEY (post_id) REFERENCES Post (post_id),
    CONSTRAINT FK_PostLike_User FOREIGN KEY (user_id) REFERENCES Users (user_id)
);
CREATE TABLE CommentReaction_New (
    comment_id INT NOT NULL,
    user_id INT NOT NULL,
    reaction VARCHAR(50) NOT NULL,
    timestamp DATETIME NOT NULL,
    PRIMARY KEY (comment_id, user_id),
    CONSTRAINT FK_CommentReaction_New_Comment FOREIGN KEY (comment_id) REFERENCES Comment (comment_id),
    CONSTRAINT FK_CommentReaction_New_User FOREIGN KEY (user_id) REFERENCES Users (user_id)
);

CREATE TABLE user_details (
    profile_id INT PRIMARY KEY,
    user_id INT FOREIGN KEY REFERENCES Users(user_id),
    profile_pic_url VARCHAR(255),
    cover_pic_url VARCHAR(255),
    contact_no VARCHAR(20),
    address VARCHAR(255),
    bio VARCHAR(MAX),
    relationship_status VARCHAR(50),
    gender CHAR(1)
);
Drop Table Profile

SELECT * FROM PostLike
INSERT INTO Users (firstname, lastname, username, email, password)
VALUES ('Emily', 'Johnson', 'emilyj', 'emilyj@example.com', 'password456');
INSERT INTO Users (firstname, lastname, username, email, password)
VALUES ('David', 'Brown', 'davidbrown', 'davidbrown@example.com', 'passwordxyz');
INSERT INTO Users (firstname, lastname, username, email, password)
VALUES ('Sarah', 'Williams', 'sarahw', 'sarahw@example.com', 'passwordabc');

-- Inserting sample data into the Post table
INSERT INTO Post (post_id, user_id, content, timestamp)
VALUES
    (1, 1, 'Check out this beautiful sunset!', '2023-06-28 10:00:00'),
    (2, 2, 'Excited for my upcoming trip!', '2023-06-28 11:30:00'),
    (3, 1, 'Here is a picture of my pet dog.', '2023-06-28 12:15:00');
Select
-- Inserting sample data into the Follower table
INSERT INTO Follower (follower_id, user_id, followed_user_id)
VALUES
    (1, 2, 1),  -- Jane Smith follows John Doe
    (2, 3, 1),  -- Alex Johnson follows John Doe
    (3, 1, 3);  -- John Doe follows Alex Johnson

-- Inserting sample data into the Comment table
INSERT INTO Comment (comment_id, post_id, user_id, content, timestamp)
VALUES
    (1, 1, 2, 'Amazing view!', '2023-06-28 10:30:00'),
    (2, 1, 3, 'I wish I could be there!', '2023-06-28 11:00:00'),
    (3, 3, 2, 'Your dog is so adorable!', '2023-06-28 12:30:00');

INSERT INTO Comment (post_id, user_id, content, timestamp)
VALUES (1, 2, 'This is the best comment!', GETDATE());

select * from Comment
select * from Notification
-- Inserting sample data into the Notification table
INSERT INTO Notification (notification_id, user_id, notification_type, related_id, timestamp)
VALUES
    (1, 1, 'like', 1, '2023-06-28 10:05:00'),
    (2, 2, 'comment', 1, '2023-06-28 10:35:00'),
    (3, 3, 'follow', 1, '2023-06-28 11:10:00');

	-- Inserting sample data into the PostLike table
INSERT INTO PostLike (post_id, user_id, timestamp)
VALUES
    (1, 2, '2023-06-28 10:05:00'),  -- User 2 likes Post 1
    (1, 3, '2023-06-28 10:10:00'),  -- User 3 likes Post 1
    (2, 1, '2023-06-28 11:15:00');  -- User 1 likes Post 2
INSERT INTO PostLike (post_id, user_id, timestamp)
VALUES
    (2, 2, GETDATE()); 
	select * from PostLike
select * from Notification
	-- User 2 likes Post 1
-- Inserting sample data into the CommentReaction table
INSERT INTO CommentReaction_New(comment_id, user_id, reaction, timestamp)
VALUES
    (1, 2, 'like', '2023-06-28 10:35:00'),     -- User 3 likes Comment 1
    (3, 1, 'love', '2023-06-28 10:40:00'),     -- User 2 loves Comment 1
    (6, 1, 'like', '2023-06-28 11:20:00');     -- User 1 likes Comment 2
	INSERT INTO CommentReaction_New(comment_id, user_id, reaction, timestamp)
VALUES
    (3, 2, 'like', '2023-06-28 10:35:00');     -- User 3 likes Comment 1
select * from CommentReaction_New
select * from Notification

SELECT *
FROM FollowerCount;

SELECT *
FROM PostLikeCount;






