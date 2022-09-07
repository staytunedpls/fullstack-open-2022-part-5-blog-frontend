import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Blog from './Blog';

test('blog renders title and author, but not url or number of likes by default', () => {
  const blog = {
    title: 'test blog title',
    author: 'test blog author',
    url: 'test blog url',
    likes: 1000,
    user: { id: 'userid', username: 'user' },
    id: 'blogid',
  };
  const loggedUser = { id: 'userid' };
  const { container } = render(
    <Blog blog={blog} removeBlog={() => {}} loggedUser={loggedUser} />
  );
  const header = container.querySelector('.blog-header');
  expect(header).toBeVisible();

  const details = container.querySelector('.blog-details');
  expect(details).not.toBeVisible();

  const detailsThroughUrl = screen.getByText('test blog url', { exact: false });
  expect(detailsThroughUrl).not.toBeVisible();

  const detailsThroughLikes = screen.getByText('1000', { exact: false });
  expect(detailsThroughLikes).not.toBeVisible();
});
