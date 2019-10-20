const request = require("supertest");
const mongoose = require("mongoose");
//Config files

const app = require("../app");
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

//
const createUser = async () => {
    const credentials = { name: 'pepe', email: "pedro@gmail.com", password: "test1234" };
    const user = await User.create(credentials);
    const agent = await signIn(credentials);
    return agent
}

/*

// Testing Get the projects

describe("GET /", () => {
    test("responds with success code", async () => {
        const agent = await createUser();
        const response = await agent.get("/projects");
        expect(response.statusCode).toBe(200);
    });
});

// Testing Create a new the project

describe("POST /projects/add", () => {
    test("Add a project", async () => {
        const data = {
            projectTitle: 'Test title',
            projectDescription: 'Test Description',
        }
        const agent = await createUser();
        const response = await agent.post("/projects/add").send(data)
        expect(response.statusCode).toBe(200);
    });
});
*/

// Testing Create a new the project

describe("DELETE /projects/delete", () => {
    test("Delete a project", async () => {
        const data = {
            title: 'Test title',
            description: 'Test Description',
        }
        const agent = await createUser();
        const project = await Project.create(data);
        const response = await agent.delete(`/projects/delete/${project._id}`)
        expect(response.statusCode).toBe(200);
    });
});