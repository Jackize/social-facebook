import User from './users.js';
import Post from './posts.js';
import Story from './stories.js';
import Like from './likes.js';
import Comment from './comments.js';
import Relationship from './relationships.js';
import Conversation from './conversations.js';
import Message from './messages.js';

Post.hasMany(Like);
Like.belongsTo(Post);

Post.hasMany(Comment);
Comment.belongsTo(Post);

User.hasMany(Comment);
Comment.belongsTo(User);

User.hasMany(Conversation, { foreignKey: "user1_id" });
User.hasMany(Conversation, { foreignKey: "user2_id" });

Conversation.belongsTo(User, { as: "user1", foreignKey: "user1_id" });
Conversation.belongsTo(User, { as: "user2", foreignKey: "user2_id" });

Conversation.hasMany(Message);
Message.belongsTo(Conversation);

User.hasMany(Post);
Post.belongsTo(User);

User.hasMany(Story);
Story.belongsTo(User);

Post.sync();
User.sync();
Story.sync();
Like.sync();
Comment.sync();
Relationship.sync();
Conversation.sync();
Message.sync();
export { User, Post, Story, Like, Comment, Relationship, Conversation, Message };
