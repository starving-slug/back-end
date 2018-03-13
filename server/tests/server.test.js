const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { User } = require('./../models/user');
const { Profile } = require('./../models/profile');
const { Recipe } = require('./../models/recipe');

// test GET /Search
describe('GET /search', () => {

  // test search by author
  it('should return a recipe by author', (done) => {
    let author = 'Karen Lee';

    request(app)
      .get(`/search?author=${author}`)
      .expect(200)
      .end((err) => {
        if (err) {
          return done(err);
        } else {
          done();
        }
      })
  })

  // test search by name
  it('should return a recipe by name', (done) => {
    let name = 'Ramen';

    request(app)
      .get(`/search?name=${name}`)
      .expect(200)
      .end((err) => {
        if(err) {
          return done(err);
        } else {
          done();
        }
      });
  });

  // test search by tag
  it('should return a recipe by tag', (done) => {
    let tag = 'Pizza';

    request(app)
      .get(`/search?tag=${tag}`)
      .expect(200)
      .end((err) => {
        if (err) {
          return done(err);
        } else {
          return done();
        }
      });
  });

});

// test rating
describe('PATCH /rating/:id', () => {

  // success case
  it('should input and update rating', (done) => {
    let rating = '3';
    let hexID = recipes[0]._id.toHexString();

    request(app)
      .patch(`/rating/${hexID}`)
      .send({rating})
      .expect(200)
      .end((err) => {
        if (err) {
          return done(err);
        } else {
          done();
        }
      })
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
        } else {
          done();
        }

        // Recipe.find().then((recipe) => {
        //   expect(recipe.length).toBe(2);
        //   done();
        // }).catch((e) => done(e));
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

describe('DELETE /recipes/delete/:id', () => {

  // success case
  it('should delete a recipe', (done) => {
    var hexID = recipes[0]._id.toHexString();

    request(app)
      .delete(`/recipe/delete/${hexID}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        } else {
          done();
        }
      });
  });

  // fail case: invalid ID
  it('should return 400 if invalid ID', (done) => {
    var hexID = '123abc';

    request(app)
      .delete(`/recipe/delete/${hexID}`)
      .expect(400)
      .end(done);
  });
});
