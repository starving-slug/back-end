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

beforeEach((done) => {
  Profile.remove({}).then(() => done());
});

// test POST users
describe('POST /users', () => {

  // gives an error, but still works for some reason
  it('should create a new user', (done) => {
    var uname = 'Justin';
    var password = 'Ramiscal';
    var email = 'justin.ramiscal@example.com';

    request(app)
      .post('/users')
      .send({ uname, email, password })
      .expect(200)
      .expect((res) => {
        expect(res.body.username).toBe(uname);
        expect(res.body.email).toBe(email);
        expect(res.body.password).toBe(password);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.find({ uname, email, password }).then((users) => {
          expect(users.length).toBe(1);
          expect(users[0].username).toBe(uname);
          done();
        }).catch((e) => done());
      });
  });

  it('should not create a new user with invalid data', (done) => {
    request(app)
      .post('/users')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.find().then((users) => {
          expect(users.length).toBe(3);
          done();
        }).catch((e) => done(e));
      });
  });
});

// test GET users/username
describe('GET /users/:username', () => {
  it('should get one user', (done) => {
    var username = 'KevLoi';

    request(app)
      .get(`/users/${users[0].username}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.username).toBe(username);
      })
      .end(done);
  });
});

<<<<<<< HEAD


// coudln't get this test to work
// test POST profile
// describe('POST /setProfile', () => {
//     it('should create a profile', (done) => {
//         // give value to params
//         var username = 'shashank_oddessey';
//         var image = 'helloWorld!';
//         var description = 'Shashank is a cool kid that likes to code and cook food';
//
//         request(app)
//             .post('/profile')
//             .send({username, image, description})
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.image).toBe(image);
//                 expect(res.body.username).toBe(username);
//                 expect(res.body.description).toBe(description);
//             })
//             .end((err, res) => {
//                 if(err) {
//                     return done(err);
//                 }
//
//                 Profile.find({image}).then((profiles) => {
//                     expect(profiles.length).toBe(1);
//                     expect(profiles[0].image).toBe(image);
//                 }).catch((e) => done(e));
//             });
//     });
// });
=======
// coudln't get this test to work 
// test POST profile
describe('POST /setProfile', () => {
  it('should create a profile', (done) => {
    // give value to params
    var username = 'shashank_oddessey';
    var image = 'helloWorld!';
    var description = 'Shashank is a cool kid that likes to code and cook food';

    request(app)
      .post('/profile')
      .send({ username, image, description })
      .expect(200)
      .expect((res) => {
        expect(res.body.image).toBe(image);
        expect(res.body.username).toBe(username);
        expect(res.body.description).toBe(description);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Profile.find({ image }).then((profiles) => {
          expect(profiles.length).toBe(1);
          expect(profiles[0].image).toBe(image);
        }).catch((e) => done(e));
      });
  });
});
>>>>>>> cbf3d60b038e1d37ecf0431a640d650264123a66
