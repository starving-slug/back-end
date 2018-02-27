const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {User} = require('./../models/user');
const {Profile} = require('./../models/profile');

// const todos = [{
//   _id: new ObjectID(),
//   text: 'First test todo'
// }, {
//   _id: new ObjectID(),
//   text: 'Second test todo',
//   completed: true,
//   completedAt: 333
// }];

// beforeEach((done) => {
//   Todo.remove({}).then(() => {
//     return Todo.insertMany(todos);
//   }).then(() => done());
// });

// const users = [{
//     _id: new ObjectID(),
//     email: 'kevinloi@example.com',
//     username: 'KevLoi',
//     password: 'iHateJullig'
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
// }];

// erase all user and profile data before testing
beforeEach((done) => {
    User.remove({}).then(() => {
        done());
    });
    // User.remove({}).then(() => {
    //     return User.insertMany(users);
    // }).then(() => done());
});
//
// beforeEach((done) => {
//     Profile.remove({}).then(() => done());
// });

// test POST users
describe('POST /users', () => {
    // send POST request to user collection
    it('should create new users', (done) => {
        var username = 'Danny';
        var password = 'Boyyyyy';
        var email = 'danny.boyd@example.com';

        request(app)
            .post('/users')
            .send({email, username, password})
            .expect(200)
            .expect((res) => {
                expect(res.body.username).toBe(username);
                expect(res.body.email).toBe(email);
                expect(res.body.password).toBe(password);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.find({username, email, password}).then((users) => {
                    expect(users.length).toBe(1);
                    expect(users[0].username).toBe(username);
                    done();
                }).catch((e) => done(e));
            });
            // User.find({uname}).then((users) => {
            //     // expect(users.length().toBe(1));
            //     expect(users[2].username).toBe(uname);
            //     done();
            // }).catch((e) => done(e));
    });

    // // empty array to make sure it runs correctly
    // it('should not create a new user with invalid data', (done) => {
    //     request(app)
    //         .post('/users')
    //         .send({})
    //         .expect(400)
    //         .end((err, res) => {
    //             if(err) {
    //                 return done(err);
    //             }
    //
    //             User.find().then((users) => {
    //                 expect(users.length).toBe(3);
    //                 done();
    //             }).catch((e) => done(e));
    //         });
    // })
});

// // test GET users/username
// describe('GET /users/:username', () => {
//     it('should get one user', (done) => {
//         var username = 'KevLoi';
//
//         request(app)
//             .get(`/users/${users[0].username}`)
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.username).toBe(username);
//             })
//             .end(done);
//     });
// });

// test POST setProfile
// describe('POST /setProfile', () => {
//     it('should create a profile', (done) => {
//         var username = "shashank_oddessey";
//         var image = "HelloWorld";
//         var description = "Shashank likes to code and cook food";
//
//         request(app)
//             .post('/setProfile')
//             .send({username, image, description})
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.username).toBe(username);
//                 expect(res.body.image).toBe(image);
//                 expect(res.body.description).toBe(description);
//             })
//             .end((err, res) => {
//                 if(err) {
//                     return done(err);
//                 }
//
//                 Profile.find({username}).then((profiles) => {
//                     expect(profiles.length).toBe(1);
//                     expect(profiles[0].username).toBe(username);
//                     done();
//                 }).catch((e) => done(e));
//             });
//     });
// });


// describe('GET /users/:username', () => {
//     it('should get user', (done) => {
//
//         request(app)
//             .get(`/users/${users[0].username}`)
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.user.text).toBe(user[0].text);
//             })
//             .end(done)
//     });
// })

// describe('POST /users', () => {
//     it('should create a new user', (done) => {
//         var text = 'Test user';
//
//         request(app)
//             .post('/users')
//             .send({text})
//             .expect(200)
//             .expect((res) => {
//                 expect(res.body.text).toBe(text);
//             })
//             .end((err, res)) => {
//                 if(err) {
//                     return done(err);
//                 }
//             }
//
//             User.find({text}).then((users) => {
//                 expect(users.length().toBe(1));
//                 expect(users[0].text).toBe(text);
//                 done();
//             }).catch((e) => done(e));
//     });
// });

// describe('POST /todos', () => {
//   it('should create a new todo', (done) => {
//     var text = 'Test todo text';
//
//     request(app)
//       .post('/todos')
//       .send({text})
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.text).toBe(text);
//       })
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }
//
//         Todo.find({text}).then((todos) => {
//           expect(todos.length).toBe(1);
//           expect(todos[0].text).toBe(text);
//           done();
//         }).catch((e) => done(e));
//       });
//   });
//
//   it('should not create todo with invalid body data', (done) => {
//     request(app)
//       .post('/todos')
//       .send({})
//       .expect(400)
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }
//
//         Todo.find().then((todos) => {
//           expect(todos.length).toBe(2);
//           done();
//         }).catch((e) => done(e));
//       });
//   });
// });
//
// describe('GET /todos', () => {
//   it('should get all todos', (done) => {
//     request(app)
//       .get('/todos')
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.todos.length).toBe(2);
//       })
//       .end(done);
//   });
// });
//
// describe('GET /todos/:id', () => {
//   it('should return todo doc', (done) => {
//     request(app)
//       .get(`/todos/${todos[0]._id.toHexString()}`)
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.todo.text).toBe(todos[0].text);
//       })
//       .end(done);
//   });
//
//   it('should return 404 if todo not found', (done) => {
//     var hexId = new ObjectID().toHexString();
//
//     request(app)
//       .get(`/todos/${hexId}`)
//       .expect(404)
//       .end(done);
//   });
//
//   it('should return 404 for non-object ids', (done) => {
//     request(app)
//       .get('/todos/123abc')
//       .expect(404)
//       .end(done);
//   });
// });
//
// describe('DELETE /todos/:id', () => {
//   it('should remove a todo', (done) => {
//     var hexId = todos[1]._id.toHexString();
//
//     request(app)
//       .delete(`/todos/${hexId}`)
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.todo._id).toBe(hexId);
//       })
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }
//
//         Todo.findById(hexId).then((todo) => {
//           expect(todo).toNotExist();
//           done();
//         }).catch((e) => done(e));
//       });
//   });
//
//   it('should return 404 if todo not found', (done) => {
//     var hexId = new ObjectID().toHexString();
//
//     request(app)
//       .delete(`/todos/${hexId}`)
//       .expect(404)
//       .end(done);
//   });
//
//   it('should return 404 if object id is invalid', (done) => {
//     request(app)
//       .delete('/todos/123abc')
//       .expect(404)
//       .end(done);
//   });
// });
//
// describe('PATCH /todos/:id', () => {
//   it('should update the todo', (done) => {
//     var hexId = todos[0]._id.toHexString();
//     var text = 'This should be the new text';
//
//     request(app)
//       .patch(`/todos/${hexId}`)
//       .send({
//         completed: true,
//         text
//       })
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.todo.text).toBe(text);
//         expect(res.body.todo.completed).toBe(true);
//         expect(res.body.todo.completedAt).toBeA('number');
//       })
//       .end(done);
//   });
//
//   it('should clear completedAt when todo is not completed', (done) => {
//     var hexId = todos[1]._id.toHexString();
//     var text = 'This should be the new text!!';
//
//     request(app)
//       .patch(`/todos/${hexId}`)
//       .send({
//         completed: false,
//         text
//       })
//       .expect(200)
//       .expect((res) => {
//         expect(res.body.todo.text).toBe(text);
//         expect(res.body.todo.completed).toBe(false);
//         expect(res.body.todo.completedAt).toNotExist();
//       })
//       .end(done);
//   });
// });
