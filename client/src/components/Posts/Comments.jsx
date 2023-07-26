import React, { useState, useEffect } from "react";
import axios from "axios";

const Comment = ({ post_id, showComments, userId, items }) => {
  // State to hold comments and replies for the post
  const [comments, setComments] = useState([]);

  // Function to fetch comments and replies for the post
  const fetchComments = () => {
    const post = items.find((item) => item.post_id === post_id);
    if (post) {
      setComments(post.comments.reverse());
    }
  };

  // ...

  // Function to handle adding a new comment
  const handleAddComment = async (commentContent) => {
    try {
      const response = await axios.post(
        `http://localhost:5050/posts/${post_id}/comments`,
        { user_id: userId, content: commentContent },
        { withCredentials: true }
      );

      if (response.data.success) {
        // If the comment is successfully added, update the comments state
        const newComment = {
          comment_id: response.data.comment_id,
          comment_content: commentContent,
          comment_user_id: userId,
          user: {
            username: response.data.username,
          },
          replies: [],
        };

        setComments([...comments, newComment]);
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Function to handle adding a new reply to a comment
  const handleAddReply = async (comment_id, replyContent) => {
    try {
      const response = await axios.post(
        `http://localhost:5050/posts/${post_id}/comments/${comment_id}`,
        {
          comment_id: comment_id,
          post_id: post_id,
          user_id: userId,
          content: replyContent,
        },
        { withCredentials: true }
      );
      console.log(response);
      if (response.data.success) {
        // If the reply is successfully added, update the comments state
        const newReply = {
          reply_id: response.data.reply_id,
          reply_content: replyContent,
          reply_user_id: userId,
          user: {
            username: response.data.username,
          },
        };

        const updatedComments = comments.map((comment) => {
          if (comment.comment_id === comment_id) {
            return {
              ...comment,
              replies: [...comment.replies, newReply],
            };
          }
          return comment.reverse;
        });

        setComments(updatedComments);
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  // ...

  useEffect(() => {
    // Fetch comments on component mount
    fetchComments();
  }, [post_id, items]);

  return (
    <div>
      {showComments[post_id] && (
        <div className="comment-div">
          {/* Comment form for the post */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const commentContent = e.target.elements.commentContent.value;
              handleAddComment(commentContent);
              e.target.elements.commentContent.value = "";
            }}
          >
            <input
              type="text"
              name="commentContent"
              placeholder="Add a comment..."
            />
            <button className="comment-btn" type="submit">
              Comment
            </button>
          </form>

          <h4>Comments:</h4>
          <ul>
            {comments.map((comment) => (
              <li key={comment.comment_id}>
                <div>
                  <span className="content-space">
                    <strong>{comment.user.username}</strong>
                  </span>
                  <p>
                    <span>{comment.comment_content}</span>
                  </p>
                </div>
                {comment.replies.length > 0 && (
                  <ul>
                    {comment.replies.map((reply) => (
                      <li key={reply.reply_id}>
                        <div className="reply-content">
                          <span className="content-space">
                            <strong>{reply.user.username}</strong>
                          </span>
                          <p>
                            <span>{reply.reply_content}</span>
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {/* Reply form for each comment */}
                <form
                  className="reply-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const replyContent = e.target.elements.replyContent.value;
                    handleAddReply(comment.comment_id, replyContent);
                    e.target.elements.replyContent.value = "";
                  }}
                >
                  <input
                    type="text"
                    name="replyContent"
                    placeholder="Add a reply..."
                  />
                  <button className="reply-btn" type="submit">
                    Reply
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Comment;
