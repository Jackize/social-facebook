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
      name: 'admin',
      username: 'admin',
      password: '$2a$10$46nlDZWl2LjKnC8Jmoc9huTPQxTxc3LDuB6CDZW0BQAnHHfY3LuG6',
      avatarPic: 'https://yt3.ggpht.com/gXyQQzMtsKl1n_FQ9FwhjyPTcJhjkYdj4UcD17ivv0Zf_nVRKTQvpf3NkiqQC4LV23zKW9Wr-WE=s48-c-k-c0x00ffffff-no-nd-rj',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'John Doe',
      username: 'John Doe',
      password: '$2a$10$46nlDZWl2LjKnC8Jmoc9huTPQxTxc3LDuB6CDZW0BQAnHHfY3LuG6',
      avatarPic: 'https://yt3.ggpht.com/1uBbLtImllQ4ZwojiH5oDGdnnOfoTLWDZb-IsGDpWSH1AxMlKJ7l361dNF9tf7Jdvuj8zajEyQ=s48-c-k-c0x00ffffff-no-nd-rj',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
    await queryInterface.bulkInsert('posts', [{
      content: 'admin',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      content: 'hao',
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
    await queryInterface.bulkInsert('stories', [{
      img: 'https://www.pinterest.com/pin/21532904461022255/',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      img: 'https://www.pinterest.com/pin/703756186551584/',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
    await queryInterface.bulkInsert('likes', [{
      userId: 1,
      postId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }])
    await queryInterface.bulkInsert('comments', [{
      content: 'very good',
      userId: 1,
      postId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
    await queryInterface.bulkInsert('conversations', [{
      user1Id: 1,
      user2Id: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }])
    await queryInterface.bulkInsert('messages', [{
      conversationId: 1,
      senderId: 2,
      content: 'u do so best',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      conversationId: 1,
      senderId: 1,
      content: 'Thank you!!!',
      createdAt: new Date(),
      updatedAt: new Date()
    }])
    await queryInterface.bulkInsert('relationships', [{
      followerUserId: 1,
      followedUserId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
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
