import User from './users';
import Post from './posts';
import Story from './stories';
import Like from './likes';
import Comment from './comments';
import Relationship from './relationships';
import Conversation from './conversations';
import Message from './messages';

Post.hasMany(Like);
Like.belongsTo(Post);

Post.hasMany(Comment);
Comment.belongsTo(Post);

User.hasMany(Comment);
Comment.belongsTo(User);

// User.hasMany(Conversation);
// Conversation.belongsTo(User);

User.hasMany(Conversation, { foreignKey: 'user1_id' });
User.hasMany(Conversation, { foreignKey: 'user2_id' });

Conversation.belongsTo(User, { as: 'user1', foreignKey: 'user1_id' });
Conversation.belongsTo(User, { as: 'user2', foreignKey: 'user2_id' });

// User.hasMany(Message, { as:'sent_messages', foreignKey: 'sender_id' });
// User.hasMany(Message, { as:'received_messages', foreignKey: 'receiver_id' });
// User.belongsToMany(Conversation, { as:'conversations', foreignKey: 'user_id' });

// Conversation.hasMany(Message, { as:'messages', foreignKey: 'conversation_id' });
// Conversation.belongsToMany(User, { as:'users', foreignKey: 'conversation_id' });

// Message.belongsTo(Conversation, {as:'conversation', foreignKey: 'conversation_id'});
// Message.belongsTo(User, {as:'sender', foreignKey: 'sender_id'});
// Message.belongsTo(User, {as:'receiver', foreignKey: 'receiver_id'});

// User.hasMany(Message)
// Message.belongsTo(User);

Conversation.hasMany(Message);
Message.belongsTo(Conversation);

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
Conversation.sync({ alter: true });
Message.sync({ alter: true });
export { User, Post, Story, Like, Comment,Relationship, Conversation, Message };
