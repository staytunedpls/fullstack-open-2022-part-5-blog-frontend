import { useState } from 'react';
import PropTypes from 'prop-types';
import blogService from '../services/blogs';

function Blog({ blog, removeBlog, loggedUser }) {
  const [detailsVisible, setDetailsVisibility] = useState(false);
  const [likes, setLikes] = useState(blog.likes);

  const toggleDetailsVisibility = () => {
    setDetailsVisibility(!detailsVisible);
  };
  const blogStyle = { border: '1px solid', margin: '10px', padding: '5px' };
  const detailsStyle = { display: detailsVisible ? '' : 'none' };
  const removeButtonStyle = {
    backgroundColor: '#ff9999',
    display: blog.user.id === loggedUser.id ? '' : 'none',
  };

  const likeBlog = async () => {
    const newBlog = { ...blog, likes: likes + 1 };
    const returnedBlog = await blogService.update(blog.id, newBlog);
    setLikes(returnedBlog.likes);
  };

  return (
    <div style={blogStyle}>
      &quot;{blog.title}&quot; {blog.author}&nbsp;
      <button type="button" onClick={toggleDetailsVisibility}>
        {detailsVisible ? 'hide' : 'view'}
      </button>
      <div style={detailsStyle}>
        url: {blog.url}
        <br />
        likes: {likes}{' '}
        <button type="button" onClick={likeBlog}>
          like
        </button>
        <br />
        creator: {blog.user.username}
        <br />
        <button
          type="button"
          style={removeButtonStyle}
          onClick={() => removeBlog(blog)}
        >
          remove
        </button>
      </div>
    </div>
  );
}

Blog.propTypes = {
  blog: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
    }),
    title: PropTypes.string,
    author: PropTypes.string,
    url: PropTypes.string,
    likes: PropTypes.number,
    id: PropTypes.string.isRequired,
  }).isRequired,
  removeBlog: PropTypes.func.isRequired,
  loggedUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default Blog;
