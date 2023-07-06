CREATE VIEW CommentDetails AS
SELECT C.comment_id, C.post_id, C.user_id, C.content, C.timestamp, U.username AS user_username, P.content AS post_content
FROM Comment AS C
JOIN Users AS U ON C.user_id = U.user_id
JOIN Post AS P ON C.post_id = P.post_id;

SELECT * FROM CommentDetails