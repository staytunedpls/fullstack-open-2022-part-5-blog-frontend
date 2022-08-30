import { useState } from "react";

const Blog = ({ blog }) => {
  const [detailsVisible, setDetailsVisibility] = useState(false);

  const toggleDetailsVisibility = () => {
    setDetailsVisibility(!detailsVisible);
  };
  const blogStyle = { border: "1px solid", margin: "10px", padding: "5px" };
  const detailsStyle = { display: detailsVisible ? "" : "none" };

  return (
    <div style={blogStyle}>
      "{blog.title}" {blog.author}{" "}
      <button onClick={toggleDetailsVisibility}>
        {detailsVisible ? "hide" : "view"}
      </button>
      <div style={detailsStyle}>
        url: {blog.url}
        <br />
        likes: {blog.likes} <button>like</button>
        <br />
        creator: {blog.user.username}
      </div>
    </div>
  );
};

export default Blog;
