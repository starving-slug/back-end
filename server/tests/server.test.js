const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { User } = require('./../models/user');
const { Profile } = require('./../models/profile');
const { Recipe } = require('./../models/recipe');

// test POST users
// works properly, just need to update the token before running it
// describe('POST /users', () => {
//   let token = {
//   	"id_token" : "eyJhbGciOiJSUzI1NiIsImtpZCI6ImFjMmI2M2ZhZWZjZjgzNjJmNGM1MjhlN2M3ODQzMzg3OTM4NzAxNmIifQ.eyJhenAiOiIxNjM2MjE0NzY2MjQtNTVjdXVrZTc4YzFrcm9sajhhNWZuZHA2ZXM5bnZvcHQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxNjM2MjE0NzY2MjQtNTVjdXVrZTc4YzFrcm9sajhhNWZuZHA2ZXM5bnZvcHQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDQxOTE2OTE3MjI4MjE1MTU4MDQiLCJoZCI6InVjc2MuZWR1IiwiZW1haWwiOiJrbG9pQHVjc2MuZWR1IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJJenF5dXZ3OUZBWnFRZVRTdXoteU9RIiwiZXhwIjoxNTIwNjQ5NzYzLCJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwianRpIjoiZWQ0MmU4N2ExODg1OTU3ZjdiMTM4OWJhMjFhMDE2NjI0YWM4NmIyNiIsImlhdCI6MTUyMDY0NjE2MywibmFtZSI6IktldmluIExvaSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vLWM4VmJiMVRBb0RZL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FHaTRnZndaYnlZUXljRTJvX1lEVDNDbHM5TF96dEowVUEvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IktldmluIiwiZmFtaWx5X25hbWUiOiJMb2kiLCJsb2NhbGUiOiJlbiJ9.gJi0ybEzGfu7bgQwiCSH65kPtbAGZp_S9zbuGAhHWgGH4F5k56LY39HJf3jawb3zD5M-v9LDTDKfUMQAHa-FJmOdDnRhpCu9Zqh6mrCUJPz6GPrbkkFy0Pw0CfEP5ZZAUio-vbmSJ-TT2QrbVcb74ro0OZ9bV_lKeJ2SD2bhWUrq-oMBZouh77_QdG__g5YWE99Ax0lIDZKrkahclRewBgdv0gWlBgI8ppSjnv0UVAId6uUAedtHnd2wMZ6qVVwy2cmPiDfR68hxfp_3DPlZhdfPQekdRZA9o35c-ezN_Gl0DiOqKMWOyzbNHTXpBwxT2DK1l30Sapq7RXWbLHCjmw"
//   }
//
//   it('should return user session', (done) => {
//     request(app)
//       .post('/users')
//       .send(token)
//       .expect(200)
//       // .expect((res) => {
//       //   expect(res.body.id_token).toBe(token);
//       // })
//       .end((err) => {
//         if (err) {
//           return done(err);
//         } else {
//           return done();
//         }
//       });
//   });
// });

beforeEach((done) => {
  Profile.remove({}).then(() => done());
});

// test setProfile
// profile does not save in profile database for some reason
describe('POST /profiles', () => {

  // user session does not exist, redirect to login (302)
  it('should try to create a new profile, but redirect to login', (done) => {

    // creates new profile
    let profile = {
      email : 'dannyboyd@example.com',
      username : 'DannyBoydAngular',
      name: 'Danny Boyd',
      description : 'Angular Master',
      image : 'Hello World!'
    }

    request(app)
      .post('/setProfile')
      .send(profile)
      .expect(302)
      .end((err) => {
        if (err) {
          return done(err);
        } else {
          return done();
        }
      });
  });
});


const recipes = [{
  _id: new ObjectID(),
  name : "Pizza Pie",
  author : "Shashank Guduru",
  description : "Making pizza and pie, not pizza pie",
  photo : "HelloWorld!",
  price : "$19.99",
  ingredients : {
    amount : "a lotta stuff",
    text : "even more stuff"
  },
  directions : "Make the pizza... and the pie... at the same time",
  tags : "Pizza",
  comments : {
    comment : "Pizza Pie tastes delicious",
    author : "Shashank Guduru"
  }
}, {
  _id: new ObjectID(),
  name : "Ramen",
  author : "Kevin Loi",
  description : "Learn how to make fancy ramen",
  photo : "HelloWorld!",
  price : "$10",
  ingredients : {
    amount : "a lotta stuff",
    text : "even more stuff"
  },
  directions : "Boil water, throw everything in",
  tags : "Ramen",
  comments : {
    comment : "Ramen is amazing, always",
    author : "Kevin Loi"
  }
}]



beforeEach((done) => {
  Recipe.remove({}).then(() => {
    return Recipe.insertMany(recipes);
  }).then(() => done());
});

// works fine
describe('POST /recipes', () => {
  // let name = "Pizza Pie";
  // let author = "Shashank Guduru";
  // let desc = "Making pizza and pie, not pizza pie";
  // let photo = "HelloWorld!";
  // let price = "19.99"
  // let ingredients = {
  //   'amount': 'a lot of stuff',
  //   'text': 'even more stuff'
  // };
  // let dir = "Make the pizza... and the pie... at the same time";
  // let tags = {
  //   'text': 'Pizza Pizza!',
  //   'path': 'Pie Pie'
  // };
  let recipe = {
    name : "Pizza Pie",
    author : "Shashank Guduru",
    description : "Making pizza and pie, not pizza pie",
    photo : "HelloWorld!",
    price : "$19.99",
    ingredients : {
      amount : "a lotta stuff",
      text : "even more stuff"
    },
    directions : "Make the pizza... and the pie... at the same time",
    tags : "Pizza",
    comments : {
      comment : "Pizza Pizza",
      author : "Shashank Guduru"
    }
  }

  it('should return a new recipe', (done) => {
    request(app)
      .post('/recipe')
      .send(recipe)
      .expect(200)
      // .expect((res) => {
      //   expect(res.body.author).toBe(author);
      // })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        Recipe.find().then((recipes) => {
          expect(recipes.length).toBe(3);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create recipe with invalid body data', () => {
    request(app)
      .post('/recipe')
      .send()
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Recipe.find().then((recipe) => {
          expect(recipe.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

// works fine
// test GET recipes by id
describe('GET /recipes/:id', () => {

  // success case
  it('should return a recipe', (done) => {
    request(app)
      .get(`/recipe/${recipes[0]._id.toHexString()}`)
      .expect(200)
      // .expect((res) => {
      //   expect(res.body.name).toBe(recipes[0].name);
      // })
      .end(done);
  });

  // fail case 1: valid id, but id is not in db
  it('should return 404 if recipe not found', (done) => {
    var hexID = new ObjectID().toHexString();

    request(app)
      .get(`/recipe/${hexID}`)
      .expect(404)
      .end(done);
  });

  // fail case 2: invalid id
  it('should return 400 for non-object ids', (done) => {
    // fake object id
    request(app)
      .get(`/recipe/123abc`)
      .expect(400)
      .end(done);
  });

});

// works fine
// test PATCH recipes by id
describe('PATCH /recipes/edit/:id', () => {

  // success case
  it('should update recipe', (done) => {
    var name = 'Pizza Pie';
    var author = 'Karen Lee';
    var hexID = recipes[0]._id.toHexString();

    request(app)
      .patch(`/recipe/edit/${hexID}`)
      .send({
        name,
        author
      })
      // .expect((res) => {
      //   expect(res.body.name).toBe(name);
      // })
      .expect(200)
      .end(done)
  });

});
