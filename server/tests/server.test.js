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
//   	"id_token" : "eyJhbGciOiJSUzI1NiIsImtpZCI6ImFjMmI2M2ZhZWZjZjgzNjJmNGM1MjhlN2M3ODQzMzg3OTM4NzAxNmIifQ.eyJhenAiOiIxNjM2MjE0NzY2MjQtNTVjdXVrZTc4YzFrcm9sajhhNWZuZHA2ZXM5bnZvcHQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxNjM2MjE0NzY2MjQtNTVjdXVrZTc4YzFrcm9sajhhNWZuZHA2ZXM5bnZvcHQuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDE2OTM0MjY0OTI3NTU4ODA5MTAiLCJlbWFpbCI6Imoua2V2bmxvaUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6IjRqTFhJUEpUTUJmbFlQNnVYNjUzekEiLCJleHAiOjE1MjA0OTU2OTgsImlzcyI6ImFjY291bnRzLmdvb2dsZS5jb20iLCJqdGkiOiI0N2I0NGQ1YWE1MWI0ODhkZWM3MWNkNTUzMTg5ZjU1YWJlZGI5OGQxIiwiaWF0IjoxNTIwNDkyMDk4LCJuYW1lIjoiS2V2aW4gTG9pIiwicGljdHVyZSI6Imh0dHBzOi8vbGg0Lmdvb2dsZXVzZXJjb250ZW50LmNvbS8tRGpUTkxrN3BpeU0vQUFBQUFBQUFBQUkvQUFBQUFBQUFBQUEvQUdpNGdmeE1fUlA5eWQyZXRVaU16MmdYT3BjOVczb3BfUS9zOTYtYy9waG90by5qcGciLCJnaXZlbl9uYW1lIjoiS2V2aW4iLCJmYW1pbHlfbmFtZSI6IkxvaSIsImxvY2FsZSI6ImVuIn0.WyGCsOBkJnjtDjOlDUMoSbiZRphVKcWswj8vdXo7ohG_UvDfPKKpOz8r-W0iBNbas309Z-oipibDBMK2iFsemgU3DRKN2hpNqB9C5QnvJo8d5fElETqCSW9Cm9xJmeQebwcvy1pDmC7Plzkznsq5KhJ7lEQOwdnbG9Ji-C9whpykpByMlKZOvtK5apFDgGEUZwEMFhvHzDmU21sju3q8Ni4B2nrpyccLuhqx3xdaeE7G-A9Tf5s1jw78E_M8oOmrsfC2tbVP6_FMWPcx_54tekm0Tvsd7x1e_95OTukEPNmIS-Gvto5Jjec5UU7C1h4fPDNGon4A8HyAkZtSrxbveg"
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
//           done();
//         }
//       });
//   });
// });



beforeEach((done) => {
  Recipe.remove({}).then(() => done());
})

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
    tags : {
      text : "Pizza pizza",
      path : "pie pie"
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
          expect(recipes.length).toBe(1);
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
