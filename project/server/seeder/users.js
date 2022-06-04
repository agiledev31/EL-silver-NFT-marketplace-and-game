let faker =require('faker');
const User= require('../models/User');

let users = [];

for (let i=1; i < 100; i += 2){
    let user = new User();

  user.username = faker.internet.userName();
  user.email = faker.internet.email();
  user.fullName = faker.name.findName();
  user.image = `https://avatars.dicebear.com/api/bottts/${user.fullName}.svg`;
  user.setPassword('Asdf123');
    users.push(user);
}

let adminUser = new User();
adminUser.username = 'admin';
adminUser.email = 'admin@gmail.com';
adminUser.fullName = 'Admin';
adminUser.role = 2;
adminUser.setPassword("Asdf123");
users.push(adminUser);

module.exports = users;