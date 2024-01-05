import { createNewBlog, deleteBlog, getBlogByName, getBlogByTag, getBlogNameById, getBlogs, updateBlog } from './blogs';
import { getImage } from './image';
import { connection } from '../db';
import { DB } from '..';
import { addPostsTag, deletePostTags, getBlogPostTag } from './post_tags';
import { getAllTags } from './tags';
import { createNewComment, deleteCommentById, getAllComments, getAllPostComments } from './comments';
import { checkIfValidAdmin } from './admins';


export const DataBase = ({app}: DB) => {
  //#region BLOG

  // Get all Blogs
  getBlogs(app, connection);

  // Get Blog By Name
  getBlogByName(app, connection);

  // Add to blogs
  createNewBlog(app, connection);

  // Delete Blog by ID
  deleteBlog(app, connection);

  // Update Blog by ID
  updateBlog(app, connection);

  // Get Blog Name from ID 
  getBlogNameById(app, connection);

  // Get Blog by TagID 
  getBlogByTag(app, connection);

  //#endregion

  //#region IMAGES

  // Get Image
  getImage(app);

  //#endregion

  //#region POST TAGS

  // Add All Post Tags 
  addPostsTag(app, connection);

  // Delete All Post Tags 
  deletePostTags(app, connection);
  
  // Get All Post Tags
  getBlogPostTag(app, connection)

  //#endregion

  //#region TAGS

  // Get All Tags
  getAllTags(app, connection)

  //#endregion

  //#region COMMENTS
  
  // Create New Comment
  createNewComment(app, connection);
  
  // Get All Post Comment
  getAllPostComments(app, connection);

  // Get All Comments
  getAllComments(app, connection);

  // Delete Comment By Id
  deleteCommentById(app, connection);

  //#endregion

  //#region ADMINS

  // CheckValid Name and Password
  checkIfValidAdmin(app, connection)

  //#endregion
};
