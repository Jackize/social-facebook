'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('users', [{
      id: 1,
      name: 'admin',
      username: 'admin',
      password: '$2a$10$46nlDZWl2LjKnC8Jmoc9huTPQxTxc3LDuB6CDZW0BQAnHHfY3LuG6',
      avatarPic: 'https://www.pinterest.com/pin/703756186551584/',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: 'hao',
      username: 'hao',
      password: '$2a$10$46nlDZWl2LjKnC8Jmoc9huTPQxTxc3LDuB6CDZW0BQAnHHfY3LuG6',
      avatarPic: 'https://www.pinterest.com/pin/21532904461022255/',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
    await queryInterface.bulkInsert('posts', [{
      id: 1,
      content: 'admin',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      content: 'hao',
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
    await queryInterface.bulkInsert('stories', [{
      id: 1,
      img: 'https://www.pinterest.com/pin/21532904461022255/',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      img: 'https://www.pinterest.com/pin/703756186551584/',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
    await queryInterface.bulkInsert('likes', [{
      id: 1,
      userId: 1,
      postId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }])
    await queryInterface.bulkInsert('comments', [{
      id: 1,
      content: 'very good',
      userId: 1,
      postId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
    await queryInterface.bulkInsert('conversations', [{
      id: 1,
      user1Id: 1,
      user2Id: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
    await queryInterface.bulkInsert('messages', [{
      id: 1,
      conversationId: 1,
      senderId: 2,
      content: 'u do so best',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      conversationId: 1,
      senderId: 1,
      content: 'Thank you!!!',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
    await queryInterface.bulkInsert('relationships', [{
      id: 1,
      followerUserId: 1,
      followedUserId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      followerUserId: 2,
      followedUserId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('relationships', null, {})
    await queryInterface.bulkDelete('messages', null, {})
    await queryInterface.bulkDelete('stories', null, {})
    await queryInterface.bulkDelete('comments', null, {})
    await queryInterface.bulkDelete('likes', null, {})
    await queryInterface.bulkDelete('posts', null, {})
    await queryInterface.bulkDelete('conversations', null, {})
    await queryInterface.bulkDelete('users', null, {})
  }
};
