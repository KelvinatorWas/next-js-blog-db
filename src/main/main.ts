import { createNewBlog, getBlogByName, getBlogs } from './blogs';
import { getImage } from './image';
import { connection } from '../db';
import { DB } from '..';


export const DataBase = ({app}: DB) => {
  // Get all Blogs
  getBlogs(app, connection);

  // Get Blog By Name
  getBlogByName(app, connection);

  // Add to blogs
  createNewBlog(app, connection);

  // Get Image
  getImage(app);

};
