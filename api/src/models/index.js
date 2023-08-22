const User = require('./users');
const Post = require('./posts');
const Story = require('./stories');
const Like = require('./likes');
const Comment = require('./comments');
const Relationship = require('./relationships');
const Conversation = require('./conversations');
const Message = require('./messages');

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

module.exports = { User, Post, Story, Like, Comment, Relationship, Conversation, Message };
