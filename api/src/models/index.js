import User from './users';
import Post from './posts';
import Story from './stories';
import Like from './likes';
import Comment from './comments';
import Relationship from './relationships';

Post.hasMany(Like);
Like.belongsTo(Post);

Post.hasMany(Comment);
Comment.belongsTo(Post);

User.hasMany(Comment);
Comment.belongsTo(User);

User.hasMany(Post);
Post.belongsTo(User);

User.hasMany(Story);
Story.belongsTo(User);

Post.sync({ alter: true });
User.sync({ alter: true });
Story.sync({ alter: true });
Like.sync({ alter: true });
Comment.sync({ alter: true });
Relationship.sync({ alter: true });
export { User, Post, Story, Like, Comment,Relationship };
