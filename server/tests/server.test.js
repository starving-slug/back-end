const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { User } = require('./../models/user');
const { Profile } = require('./../models/profile');

// const users = [{
// <<<<<<< HEAD
//     _id: new ObjectID(),
//     email: 'kevinloi@example.com',
//     username: 'KevLoi',
//     password: 'febreezehawaiian'
// }, {
//     _id: new ObjectID(),
//     email: 'justinR@outlook.com',
//     username: 'JustinR',
//     password: 'stylingIsFun'
// }, {
//     _id: new ObjectID(),
//     email: 'shashank.guduru@gmail.com',
//     username: 'theShaGu',
//     password: '1234567'
// =======
//   _id: new ObjectID(),
//   email: 'test1@example.com',
//   username: 'test1',
//   first_name: "test1",
//   last_name: "baby1"
// },
// {
//   _id: new ObjectID(),
//   email: 'test2@example.com',
//   username: 'test2',
//   first_name: "test2",
//   last_name: "baby2"
// },
// {
//   _id: new ObjectID(),
//   email: 'test3@example.com',
//   username: 'test3',
//   first_name: "test3",
//   last_name: "baby3"
// >>>>>>> cbf3d60b038e1d37ecf0431a640d650264123a66
// }];

// test POST users
describe('POST /users', () => {
  let token = {
  	"id_token" : "eyJhbGciOiJSUzI1NiIsImtpZCI6ImFjMmI2M2ZhZWZjZjgzNjJmNGM1MjhlN2M3ODQzMzg3OTM4NzAxNmIifQ.eyJhenAiOiIxNjM2MjE0NzY2MjQtNTVjdXVrZTc4YzFrcm9sajhhNWZuZHA2ZXM5bnZvcHQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxNjM2MjE0NzY2MjQtNTVjdXVrZTc4YzFrcm9sajhhNWZuZHA2ZXM5bnZvcHQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDE2OTM0MjY0OTI3NTU4ODA5MTAiLCJlbWFpbCI6Imoua2V2bmxvaUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Im4xLXZOeHVNS3Y0YlRYRV81MDdrNHciLCJleHAiOjE1MjA0NTUwMTMsImlzcyI6ImFjY291bnRzLmdvb2dsZS5jb20iLCJqdGkiOiI0YjRmOWVjNjA3NDEyMzZiZTNjYzVlMGE3ODczMzFlOWM3ZDQ1ZDM0IiwiaWF0IjoxNTIwNDUxNDEzLCJuYW1lIjoiS2V2aW4gTG9pIiwicGljdHVyZSI6Imh0dHBzOi8vbGg0Lmdvb2dsZXVzZXJjb250ZW50LmNvbS8tRGpUTkxrN3BpeU0vQUFBQUFBQUFBQUkvQUFBQUFBQUFBQUEvQUdpNGdmeE1fUlA5eWQyZXRVaU16MmdYT3BjOVczb3BfUS9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiS2V2aW4iLCJmYW1pbHlfbmFtZSI6IkxvaSIsImxvY2FsZSI6ImVuIn0.ELciE9ZYcD02dhLJnIvYp8_fiInYtulKZMWRGDQ5PmC4zItkeQ0OPBGBBROMRUXI7Gf0W2BEI3ZDv8GhJA3aECM7Z5AY1vfRpItJHjuyK2OWP9QrYTwEqmoJjUw__T6CnUTOVAi0WTpEipldTDQBdZ3aiVDmyp6gsA-BXUmn8KTj4gZvOTYNrKbTi6DT_64a7a9GDqfGu1-rC7wkBCUjJStIadG4RJs6qxBysUc4Q1TjyIaT_Z91kofFZeB4wPuWwAv4KLjZ-RQU02kkO6AqFryPARBvkvIwGxZ9YmP4sZHBWXKXvqe545-CNouc48L5W9CF0jeCBAKpQHWlwgwi-A"
  }

  it('should return user session', (done) => {
    request(app)
      .post('/users')
      .send(token)
      .expect(200)
      // .expect((res) => {
      //   expect(res.body.id_token).toBe(token);
      // })
      .end((err) => {
        if (err) {
          return done(err);
        } else {
          done();
        }
      });
  });
});

describe('POST /recipes', () => {
  let recipe = {
    "name" : "Pizza Pie",
    "author" : "Shashank Guduru",
    "description" : "Making pizza and pie, not pizza pie",
    "photo" : "HelloWorld!",
    "price" : "$19.99",
    "ingredients" : {
      "amount" : "a lotta stuff",
      "text" : "even more stuff"
    },
    "directions" : "Make the pizza... and the pie... at the same time",
    "tags" : {
      "text" : "Pizza pizza",
      "path" : "pie pie"
    }
  }

  it('should return a new recipe', () => {
    
  })
})

// const users = [{
// <<<<<<< HEAD
//     _id: new ObjectID(),
//     email: 'kevinloi@example.com',
//     username: 'KevLoi',
//     password: 'febreezehawaiian'
// }, {
//     _id: new ObjectID(),
//     email: 'justinR@outlook.com',
//     username: 'JustinR',
//     password: 'stylingIsFun'
// }, {
//     _id: new ObjectID(),
//     email: 'shashank.guduru@gmail.com',
//     username: 'theShaGu',
//     password: '1234567'
// =======
//   _id: new ObjectID(),
//   email: 'test1@example.com',
//   username: 'test1',
//   first_name: "test1",
//   last_name: "baby1"
// },
// {
//   _id: new ObjectID(),
//   email: 'test2@example.com',
//   username: 'test2',
//   first_name: "test2",
//   last_name: "baby2"
// },
// {
//   _id: new ObjectID(),
//   email: 'test3@example.com',
//   username: 'test3',
//   first_name: "test3",
//   last_name: "baby3"
// >>>>>>> cbf3d60b038e1d37ecf0431a640d650264123a66
// }];
//
//
// //
// beforeEach((done) => {
//   Profile.remove({}).then(() => done());
// });
//
// // test POST users
// describe('POST /users', () => {
//
//   // gives an error, but still works for some reason
//   it('should create a new user', (done) => {
//     var uname = 'Justin';
//     var password = 'Ramiscal';
//     var email = 'justin.ramiscal@example.com';
//
//     request(app)
//       .post('/users')
//       .send({ uname, email, password })
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.username).toBe(uname);
//         expect(res.body.email).toBe(email);
//         expect(res.body.password).toBe(password);
//       })
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }
//
//         User.find({ uname, email, password }).then((users) => {
//           expect(users.length).toBe(1);
//           expect(users[0].username).toBe(uname);
//           done();
//         }).catch((e) => done());
//       });
//   });
//
//   it('should not create a new user with invalid data', (done) => {
//     request(app)
//       .post('/users')
//       .send({})
//       .expect(400)
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }
//
//         User.find().then((users) => {
//           expect(users.length).toBe(3);
//           done();
//         }).catch((e) => done(e));
//       });
//   });
// });
//
// // test GET users/username
// describe('GET /users/:username', () => {
//   it('should get one user', (done) => {
//     var username = 'KevLoi';
//
//     request(app)
//       .get(`/users/${users[0].username}`)
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.username).toBe(username);
//       })
//       .end(done);
//   });
// });
//
// <<<<<<< HEAD
//
//
// // coudln't get this test to work
// // test POST profile
// // describe('POST /setProfile', () => {
// //     it('should create a profile', (done) => {
// //         // give value to params
// //         var username = 'shashank_oddessey';
// //         var image = 'helloWorld!';
// //         var description = 'Shashank is a cool kid that likes to code and cook food';
// //
// //         request(app)
// //             .post('/profile')
// //             .send({username, image, description})
// //             .expect(200)
// //             .expect((res) => {
// //                 expect(res.body.image).toBe(image);
// //                 expect(res.body.username).toBe(username);
// //                 expect(res.body.description).toBe(description);
// //             })
// //             .end((err, res) => {
// //                 if(err) {
// //                     return done(err);
// //                 }
// //
// //                 Profile.find({image}).then((profiles) => {
// //                     expect(profiles.length).toBe(1);
// //                     expect(profiles[0].image).toBe(image);
// //                 }).catch((e) => done(e));
// //             });
// //     });
// // });
// =======
// // coudln't get this test to work
// // test POST profile
// describe('POST /setProfile', () => {
//   it('should create a profile', (done) => {
//     // give value to params
//     var username = 'shashank_oddessey';
//     var image = 'helloWorld!';
//     var description = 'Shashank is a cool kid that likes to code and cook food';
//
//     request(app)
//       .post('/profile')
//       .send({ username, image, description })
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.image).toBe(image);
//         expect(res.body.username).toBe(username);
//         expect(res.body.description).toBe(description);
//       })
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }
//
//         Profile.find({ image }).then((profiles) => {
//           expect(profiles.length).toBe(1);
//           expect(profiles[0].image).toBe(image);
//         }).catch((e) => done(e));
//       });
//   });
// });
// >>>>>>> cbf3d60b038e1d37ecf0431a640d650264123a66
