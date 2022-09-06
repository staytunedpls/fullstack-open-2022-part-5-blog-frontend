import "./index.css";

import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

const Notification = ({ message, type }) => {
  const notification_class = `notification ${type}`;
  if (message === null) {
    return null;
  } else {
    return <div className={notification_class}>{message}</div>;
  }
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const [notificationMessage, setNotificationMessage] = useState(null);
  const [notificationType, setNotificationType] = useState("");

  const newBlogRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      setUser(user);
      blogService.setToken(user.token);
      setUsername("");
      setPassword("");

      setNotificationMessage(`Successful log in by ${user.username}`);
      setNotificationType("success");
      setTimeout(() => setNotificationMessage(null), 5000);
    } catch (exception) {
      setNotificationMessage("Invalid credentials");
      setNotificationType("error");
      setTimeout(() => setNotificationMessage(null), 5000);
    }
  };

  const addBlog = async (newBlog) => {
    newBlogRef.current.toggleVisibility();

    try {
      const returnedBlog = await blogService.add(newBlog);
      setBlogs(blogs.concat(returnedBlog));

      setNotificationMessage(
        `a new blog ${returnedBlog.title} by ${newBlog.author} added`
      );
      setNotificationType("success");
      setTimeout(() => setNotificationMessage(null), 5000);
    } catch (error) {
      setNotificationMessage(
        `Could not add new blog, got error: ${error.message}`
      );
      setNotificationType("error");
      setTimeout(() => setNotificationMessage(null), 5000);
    }
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedUser");
  };

  const loginForm = () => (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      console.log("Removing...");
      await blogService.deleteEntry(blog.id);
      setBlogs(blogs.filter(blogElement => blogElement.id !== blog.id));
    }
  };

  const blogList = () => (
    <div>
      <h2>Blogs</h2>
      <p>
        {user.username} logged in<button onClick={logout}>logout</button>
      </p>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} removeBlog={removeBlog} loggedUser={user}/>
      ))}
    </div>
  );

  if (user === null) {
    return (
      <div>
        <Notification message={notificationMessage} type={notificationType} />
        {loginForm()}
      </div>
    );
  } else {
    return (
      <div>
        <Notification message={notificationMessage} type={notificationType} />
        {blogList()}
        <Togglable buttonLabel="new blog" ref={newBlogRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
      </div>
    );
  }
};

export default App;
