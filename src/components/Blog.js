import { useState } from "react";
import blogService from "../services/blogs";

const Blog = ({ blog }) => {
  const [detailsVisible, setDetailsVisibility] = useState(false);
  const [likes, setLikes] = useState(blog.likes)

  const toggleDetailsVisibility = () => {
    setDetailsVisibility(!detailsVisible);
  };
  const blogStyle = { border: "1px solid", margin: "10px", padding: "5px" };
  const detailsStyle = { display: detailsVisible ? "" : "none" };

  const likeBlog = async () => {
    const newBlog = {...blog, likes: likes + 1}
    const returnedBlog = await blogService.update(blog.id, newBlog);
    setLikes(returnedBlog.likes);
  };

  return (
    <div style={blogStyle}>
      "{blog.title}" {blog.author}{" "}
      <button onClick={toggleDetailsVisibility}>
        {detailsVisible ? "hide" : "view"}
      </button>
      <div style={detailsStyle}>
        url: {blog.url}
        <br />
        likes: {likes} <button onClick={likeBlog}>like</button>
        <br />
        creator: {blog.user.username}
      </div>
    </div>
  );
};

export default Blog;
