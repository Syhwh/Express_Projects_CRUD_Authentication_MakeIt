const request = require("supertest");
const mongoose = require("mongoose");
//Config files
const config = require('../config/config');
const app = require("../app");
const router =require('../routes/routes');
const User = require("../database/models/userSchema");
const Project = require("../database/models/projectSchema");


beforeEach(async () => {
    // antes de cada prueba limpiamos todas las colecciones para iniciar con una
    // base de datos en blanco
    for (var i in mongoose.connection.collections) {
      await mongoose.connection.collections[i].remove({})
    }
  
  });

afterAll(async () => {
    await mongoose.disconnect();
  });

  const signIn = async (credentials) => {
    const agent = request.agent(app);
    await agent.post('/users/login')
        .set('Content-Type', 'application/json')
        .send(credentials);
  
    return agent;
  }






describe("GET /", () => {
    test("responds with success code", async () => {
        const credentials = { name:'pep', email: "pedro@gmail.com", password: "test1234"};
        const user = await User.create(credentials);
        const agent = await signIn(credentials);

        const response = await agent.get("/projects");      
      expect(response.statusCode).toBe(200);
    });
  });

describe("POST /projects/add", () => {  

    test("Add a project", async () => {
        const data = {
            projectTitle: 'Test title',
            projectDescription: 'Test Description',    
        }
        const credentials = { name:'pepe', email: "pedro@gmail.com", password: "test1234"};
        const user = await User.create(credentials);
        const agent = await signIn(credentials);
        
      const response = await agent.post("/projects/add").send(data)
      expect(response.statusCode).toBe(200);
    });
  });
