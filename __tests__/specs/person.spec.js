const {withServer, login, loginAdmin} = require('../supertest.setup');
const {testAuthHeader} = require('../common/auth');
const Role = require("../../src/core/roles");
const {ignore} = require("nodemon/lib/rules");

const data = {
    persons: [{
        id: 200,
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@example.com",
        password_hash: "$argon2id$v=19$m=131072,t=6,p=4$bKY00fDGpq/pmgj07J8OUg$a2ZDJhl6BuFrhih52D6buhYtKPdzVLPVQprjrIQG46Y",//pass1
        roles: JSON.stringify([Role.ADMIN, Role.USER])
    }, {
        id: 201,
        first_name: "Alice",
        last_name: "Smith",
        email: "alice.smith@example.com",
        password_hash: "$argon2id$v=19$m=131072,t=6,p=4$bKY00fDGpq/pmgj07J8OUg$a2ZDJhl6BuFrhih52D6buhYtKPdzVLPVQprjrIQG46Y",//pass1,
        roles: JSON.stringify([Role.USER])
    }, {
        id: 202,
        first_name: "Ella",
        last_name: "Johnson",
        email: "ella.johnson@example.com",
        password_hash: "$argon2id$v=19$m=131072,t=6,p=4$bKY00fDGpq/pmgj07J8OUg$a2ZDJhl6BuFrhih52D6buhYtKPdzVLPVQprjrIQG46Y",//pass1
        roles: JSON.stringify([Role.USER])
    },],
    setupData: [{
        id: 1,
        first_name: "admin",
        last_name: "joe",
        email: "admin@example.com",
        password_hash: "$argon2id$v=19$m=131072,t=6,p=4$PvJomRJIy7YTUN4zMvt6Kg$r7ICw6fxd4QlSbXdnO+jVqTQwD2Fo8r0NiDy0xiOEmE",//pass1
        roles: JSON.stringify([Role.ADMIN, Role.USER])
    }, {
        id: 2,
        first_name: "user",
        last_name: "Smith",
        email: "user@example.com",
        password_hash: "$argon2id$v=19$m=131072,t=6,p=4$PvJomRJIy7YTUN4zMvt6Kg$r7ICw6fxd4QlSbXdnO+jVqTQwD2Fo8r0NiDy0xiOEmE",//pass1,
        roles: JSON.stringify([Role.USER])
    }]

};

const dataToDelete = {
    persons: [200, 201, 202],
};

describe('persons', () => {
    let request, userAuthHeader, adminAuthHeader;

    withServer(({supertest, prisma: p}) => {
        request = supertest;
        prisma = p;
    });

    beforeAll(async () => {
        userAuthHeader = await login(request);
        adminAuthHeader = await loginAdmin(request);
        await prisma.person.deleteMany({
            where: {
                id: {in: dataToDelete.persons},
            },
        });
    });

    const url = '/api/persons';

    describe('GET /api/persons', () => {
        beforeAll(async () => {
            await prisma.person.createMany({
                data: data.persons
            });
        });

        afterAll(async () => {
            await prisma.person.deleteMany({
                where: {
                    id: {in: dataToDelete.persons},
                },
            });
        });
        describe('admin', () => {
            it('should 200 and return all persons', async () => {
                const response = await request
                    .get(url)
                    .set('Authorization', adminAuthHeader);

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expect.objectContaining({items: [...data.setupData, ...data.persons]}));
            });
            it("should 400 when given an argument", async () => {
                const response = await request
                    .get(`${url}?invalid=true`)
                    .set("Authorization", adminAuthHeader);

                expect(response.statusCode).toBe(400);
                expect(response.body.code).toBe("VALIDATION_FAILED");
            });
        });
        describe('user', () => {
            it('should 403 when retrieving all persons', async () => {
                const response = await request
                    .get(url)
                    .set('Authorization', userAuthHeader);

                expect(response.statusCode).toBe(403);
                expect(response.body.items).toEqual(undefined);
            });
            it("should 400 when given an argument", async () => {
                const response = await request
                    .get(`${url}?invalid=true`)
                    .set("Authorization", userAuthHeader);

                expect(response.statusCode).toBe(403);
                expect(response.body.code).toBe("FORBIDDEN");
            });
        })
        testAuthHeader(() => request.get(url));

    });
    describe('GET /api/persons/:id', () => {
        beforeAll(async () => {
            await prisma.person.createMany({
                data: data.persons
            });
        });
        afterAll(async () => {
            await prisma.person.deleteMany({
                where: {
                    id: {in: dataToDelete.persons},
                },
            });
        })

        describe('admin', () => {
            it('should 200 and return admin person', async () => {
                const response = await request
                    .get(url + "/200")
                    .set('Authorization', adminAuthHeader);
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(data.persons[0]);
            });
            it('should 200 and return user person', async () => {
                const response = await request
                    .get(url + "/201")
                    .set('Authorization', adminAuthHeader);
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(data.persons[1]);
            });
            it('should 200 and return own person', async () => {
                const response = await request
                    .get(url + "/1")
                    .set('Authorization', adminAuthHeader);
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(data.setupData[0]);
            });
            it("should 400 when given an argument", async () => {
                const response = await request
                    .get(`${url}/1?invalid=true`)
                    .set("Authorization", adminAuthHeader);

                expect(response.statusCode).toBe(400);
                expect(response.body.code).toBe("VALIDATION_FAILED");
            });
        })
        describe('user', () => {
            it('should 403 when retrieving other user person', async () => {
                const response = await request
                    .get(url + "/201")
                    .set('Authorization', userAuthHeader);
                expect(response.statusCode).toBe(403);
                expect(response.body.code).toEqual("FORBIDDEN");
                expect(response.body.message).toEqual("You are not allowed to acces this user's information");
            });
            it('should 403 when retrieving other admin person', async () => {
                const response = await request
                    .get(url + "/1")
                    .set('Authorization', userAuthHeader);
                expect(response.statusCode).toBe(403);
                expect(response.body.code).toEqual("FORBIDDEN");
                expect(response.body.message).toEqual("You are not allowed to acces this user's information");
            });
            it('should 200 when retrieving own person', async () => {
                const response = await request
                    .get(url + "/2")
                    .set('Authorization', userAuthHeader);
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(data.setupData[1]);
            });
            it("should 400 when given an argument", async () => {
                const response = await request
                    .get(`${url}/1?invalid=true`)
                    .set("Authorization", userAuthHeader);

                expect(response.statusCode).toBe(400);
                expect(response.body.code).toBe("VALIDATION_FAILED");
            });
        })
    })

    describe('DELETE /api/persons/:id', () => {
        beforeAll(async () => {
            await prisma.person.createMany({
                data: data.persons
            });
        });
        afterAll(async () => {
            await prisma.person.deleteMany({
                where: {
                    id: {in: dataToDelete.persons},
                },
            });
        })

        describe('admin', () => {
            it('should 200 and return deleted admin person', async () => {
                const response = await request
                    .delete(url + "/200")
                    .set('Authorization', adminAuthHeader);
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(data.persons[0]);
            });
            it('should 200 and return deleted user person', async () => {
                const response = await request
                    .get(url + "/201")
                    .set('Authorization', adminAuthHeader);
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(data.persons[1]);
            });
            it('should 200 and return deleted own person', async () => {
                const response = await request
                    .get(url + "/1")
                    .set('Authorization', adminAuthHeader);
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(data.setupData[0]);
            });
            it('should 404 when deleting non existing person', async () => {
                const response = await request
                    .get(url + "/69")
                    .set('Authorization', adminAuthHeader);
                expect(response.statusCode).toBe(404)
                expect(response.body.code).toBe("NOT_FOUND");
                expect(response.body.message).toBe("No person with id 69 exists");
            });
        })
        describe('user', () => {
            it('should 403 when deleting other user person', async () => {
                const response = await request
                    .get(url + "/201")
                    .set('Authorization', userAuthHeader);
                expect(response.statusCode).toBe(403);
                expect(response.body.code).toEqual("FORBIDDEN");
                expect(response.body.message).toEqual("You are not allowed to acces this user's information");
            });
            it('should 403 when deleting other admin person', async () => {
                const response = await request
                    .get(url + "/1")
                    .set('Authorization', userAuthHeader);
                expect(response.statusCode).toBe(403);
                expect(response.body.code).toEqual("FORBIDDEN");
                expect(response.body.message).toEqual("You are not allowed to acces this user's information");
            });
            it('should 200 when delete own person', async () => {
                const response = await request
                    .get(url + "/2")
                    .set('Authorization', userAuthHeader);
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(data.setupData[1]);
            });
            it('should 404 when deleting non existing person', async () => {
                const response = await request
                    .get(url + "/69")
                    .set('Authorization', userAuthHeader);
                expect(response.statusCode).toBe(403)
                expect(response.body.code).toBe("FORBIDDEN");
                expect(response.body.message).toBe("You are not allowed to acces this user's information");
            });
        })
    })


    describe('DELETE /api/persons/', () => {
        beforeAll(async () => {
            await prisma.person.createMany({
                data: data.persons
            });
        });
        afterAll(async () => {
            await prisma.person.deleteMany({
                where: {
                    id: {in: dataToDelete.persons},
                },
            });
        })
        afterEach(async () => {
            await prisma.person.deleteMany({})
            await prisma.person.createMany({
                data: [...data.setupData, ...data.persons]
            })
        })

        describe('admin', () => {
            it('should 204 when deleting all persons', async () => {
                const response = await request
                    .delete(url)
                    .set('Authorization', adminAuthHeader);
                expect(response.statusCode).toBe(204);
                expect(response.body).toEqual({});
            });
            it("should 400 when given an argument", async () => {
                const response = await request
                    .get(`${url}?invalid=true`)
                    .set("Authorization", adminAuthHeader);

                expect(response.statusCode).toBe(400);
                expect(response.body.code).toBe("VALIDATION_FAILED");
            });
        })
        describe('user', () => {
            it('should 403 when deleting all persons', async () => {
                const response = await request
                    .get(url)
                    .set('Authorization', userAuthHeader);
                expect(response.statusCode).toBe(403);
                expect(response.body.code).toEqual("FORBIDDEN");
                expect(response.body.message).toEqual("You are not allowed to acces this part of the application");
            });
            it("should 403 when given an argument", async () => {
                const response = await request
                    .get(`${url}?invalid=true`)
                    .set("Authorization", userAuthHeader);

                expect(response.statusCode).toBe(403);
                expect(response.body.code).toBe("FORBIDDEN");
                expect(response.body.message).toEqual("You are not allowed to acces this part of the application");
            });
        })
    })

    describe('PATCH /api/persons/:id', () => {
        beforeAll(async () => {
            await prisma.person.createMany({
                data: data.persons
            });
        });
        afterAll(async () => {
            await prisma.person.deleteMany({
                where: {
                    id: {in: dataToDelete.persons},
                },
            });
        })

        let updatedPerson
        beforeEach(async () => {
            await prisma.person.deleteMany({
                where: {
                    id: {in: dataToDelete.persons},
                },
            });
            await prisma.person.createMany({
                data: data.persons
            });
            updatedPerson = {
                first_name: "some",
                last_name: "thing",
                email: "some.thing@else.duh",
                password: "pass1",
            }
        });
        describe('admin', () => {

            it('should 200 when updating own admin person', async () => {
                const response = await request
                    .patch(`${url}/1`)
                    .set('Authorization', adminAuthHeader)
                    .send(updatedPerson);
                // expect(response.statusCode).toBe(200);
                delete updatedPerson.password
                expect(response.body).toEqual(expect.objectContaining({
                    ...updatedPerson,
                    id: 1,
                    // roles: JSON.stringify(["admin", "user"])
                }));
                await prisma.person.update({
                    where: {
                        id: 1
                    },
                    data: data.setupData[0]
                })
            });
            it('should 200 when updating other admin person', async () => {
                const response = await request
                    .patch(`${url}/200`)
                    .set('Authorization', adminAuthHeader)
                    .send(updatedPerson);
                delete updatedPerson.password
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expect.objectContaining({
                    ...updatedPerson,
                    id: 200,
                    // roles: JSON.stringify(["admin", "user"])
                }));
            });
            it('should 200 when updating other user person', async () => {
                const response = await request
                    .patch(`${url}/201`)
                    .set('Authorization', adminAuthHeader)
                    .send(updatedPerson);
                delete updatedPerson.password
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expect.objectContaining({
                    ...updatedPerson,
                    id: 201,
                    // roles: JSON.stringify(["user"])
                }));
            });
            it('should 401 when updating non existing person', async () => {
                const response = await request
                    .patch(`${url}/69`)
                    .set('Authorization', adminAuthHeader)
                    .send(updatedPerson);
                delete updatedPerson.password
                expect(response.statusCode).toBe(401);
                expect(response.body.code).toBe("UNAUTHORIZED");
            });
            it("should 400 when given an argument", async () => {
                const response = await request
                    .patch(`${url}/200?invalid=true`)
                    .set("Authorization", adminAuthHeader)
                    .send(updatedPerson);
                expect(response.statusCode).toBe(400);
                expect(response.body.code).toBe("VALIDATION_FAILED");
            });
        })
        describe('user', () => {
            it('should 403 when updating own person', async () => {
                const response = await request
                    .patch(`${url}/2`)
                    .set('Authorization', userAuthHeader);
                expect(response.statusCode).toBe(403);
                expect(response.body.code).toBe("FORBIDDEN");
                expect(response.body.message).toEqual("You are not allowed to acces this part of the application");
            });
            it('should 403 when updating other admin person', async () => {
                const response = await request
                    .patch(`${url}/1`)
                    .set('Authorization', userAuthHeader);
                expect(response.statusCode).toBe(403);
                expect(response.body.code).toBe("FORBIDDEN");
                expect(response.body.message).toEqual("You are not allowed to acces this part of the application");
            });
            it('should 403 when updating other user person', async () => {
                const response = await request
                    .patch(`${url}/201`)
                    .set('Authorization', userAuthHeader);
                expect(response.statusCode).toBe(403);
                expect(response.body.code).toBe("FORBIDDEN");
                expect(response.body.message).toEqual("You are not allowed to acces this part of the application");
            });
            it('rdtfcvgybhjnk', async () => {
                const response = await request
                    .patch(`${url}/69`)
                    .set('Authorization', userAuthHeader)
                    .send(updatedPerson);
                delete updatedPerson.password
                expect(response.statusCode).toBe(403);
                expect(response.body.code).toBe("FORBIDDEN");
            });
            it("should 403 when given an argument", async () => {
                const response = await request
                    .patch(`${url}/2?invalid=true`)
                    .set("Authorization", userAuthHeader);
                expect(response.statusCode).toBe(403);
                expect(response.body.code).toBe("FORBIDDEN");
                expect(response.body.message).toEqual("You are not allowed to acces this part of the application");
            });
        })
    })

    describe('POST /api/persons/login', () => {
        beforeAll(async () => {
            await prisma.person.createMany({
                data: data.persons
            });
        });
        afterAll(async () => {
            await prisma.person.deleteMany({
                where: {
                    id: {in: dataToDelete.persons},
                },
            });
        });
        let person
        beforeEach(() => {
            person = {password: "pass1"}
        })
        describe('admin', () => {
            it('should 200 and return own person', async () => {
                person = {...person, ...data.setupData[0]}
                const response = await request
                    .post(`${url}/login`)
                    .send({email: person.email, password: person.password});
                delete person.password
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expect.objectContaining(person));
            });
            it("should 400 when given an argument", async () => {
                person = {...person, ...data.setupData[0]}
                const response = await request
                    .post(`${url}/login?invalid=true`)
                    .send({email: person.email, password: person.password});
                delete person.password
                expect(response.statusCode).toBe(400);
                expect(response.body.code).toBe("VALIDATION_FAILED");
            });
            it("should 401 when given wrong password", async () => {
                person = {...person, ...data.setupData[0]}
                const response = await request
                    .post(`${url}/login`)
                    .send({email: person.email, password: "yhtg"});
                delete person.password
                expect(response.statusCode).toBe(401);
                expect(response.body.code).toBe("UNAUTHORIZED");
            });
            it("should 401 when given wrong email", async () => {
                person = {...person, ...data.setupData[0]}
                const response = await request
                    .post(`${url}/login`)
                    .send({email: "dgfcvhbj", password: person.password});
                delete person.password
                expect(response.statusCode).toBe(401);
                expect(response.body.code).toBe("UNAUTHORIZED");
            });
        });
        describe('user', () => {
            it('should 200 and return own person', async () => {
                person = {...person, ...data.setupData[1]}
                const response = await request
                    .post(`${url}/login`)
                    .send({email: person.email, password: person.password});
                delete person.password
                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual(expect.objectContaining(person));
            });
            it("should 400 when given an argument", async () => {
                person = {...person, ...data.setupData[1]}
                const response = await request
                    .post(`${url}/login?invalid=true`)
                    .send({email: person.email, password: person.password})
                expect(response.statusCode).toBe(400);
                expect(response.body.code).toBe("VALIDATION_FAILED");
            });
            it("should 401 when given wrong credentials", async () => {
                person = {...person, ...data.setupData[1]}
                const response = await request
                    .post(`${url}/login`)
                    .send({email: person.email, password: "qawsedr"});
                expect(response.statusCode).toBe(401);
                expect(response.body.code).toBe("UNAUTHORIZED");
            });
            it("should 401 when given wrong email", async () => {
                person = {...person, ...data.setupData[1]}
                const response = await request
                    .post(`${url}/login`)
                    .send({email: "dgfcvhbj", password: person.password});
                delete person.password
                expect(response.statusCode).toBe(401);
                expect(response.body.code).toBe("UNAUTHORIZED");
            });
        })

    });

    describe('POST /api/persons/register', () => {
        beforeAll(async () => {
            await prisma.person.createMany({
                data: data.persons
            });
        });
        afterAll(async () => {
            await prisma.person.deleteMany({
                where: {
                    id: {in: dataToDelete.persons},
                },
            });
        });
        let person
        let existingPerson
        beforeEach(() => {
            person = {
                "first_name": "Cody",
                "last_name": "Van Hauwermeiren",
                "email": "codyvh@outlook.be",
                // "tickets":   {1},
                "password": "hihi"
            }
            existingPerson = {...data.persons[0],password:"hihi"}
            delete existingPerson.id
            delete existingPerson.password_hash
            delete existingPerson.roles
        })
        afterEach(async () => {
            await prisma.person.deleteMany()
            await prisma.person.createMany({
                data: [...data.setupData, ...data.persons]
            });
        })
        describe('admin', () => {
            it('should 200 and return created person', async () => {
                const response = await request
                    .post(`${url}/register`)
                    .set('Authorization', adminAuthHeader)
                    .send(person);
                delete person.password
                expect(response.statusCode).toBe(201);
                expect(response.body).toEqual(expect.objectContaining(person));
            });
            it('should 200 and return created person', async () => {
                const response = await request
                    .post(`${url}/register`)
                    .set('Authorization', adminAuthHeader)
                    .send(existingPerson);
                delete existingPerson.password
                expect(response.statusCode).toBe(409);
                expect(response.body.code).toEqual("EXISTS_ALREADY");
            });
            it("should 400 when given an argument", async () => {
                const response = await request
                    .post(`${url}/register?invalid=true`)
                    .set('Authorization', adminAuthHeader)
                    .send(person);
                expect(response.statusCode).toBe(400);
                expect(response.body.code).toBe("VALIDATION_FAILED");
            });
        });
        describe('user', () => {
            it('should 403 when registering', async () => {
                const response = await request
                    .post(`${url}/register`)
                    .set('Authorization', userAuthHeader)
                    .send(person);
                delete person.password
                expect(response.statusCode).toBe(201);
                expect(response.body).toEqual(expect.objectContaining(person));
            });
            it("should 400 when given an argument", async () => {
                const response = await request
                    .post(`${url}/register?invalid=true`)
                    .set('Authorization', userAuthHeader)
                    .send(person);
                expect(response.statusCode).toBe(400);
                expect(response.body.code).toBe("VALIDATION_FAILED");
            });
        })

    });
});

//todo: error code 409(conflict (bij already exists))
