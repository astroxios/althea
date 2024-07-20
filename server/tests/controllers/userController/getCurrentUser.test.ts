import request from "supertest";
import app from "../../../src/app";
import userModel from "../../../src/models/userModel";
import redisClient from "../../../src/redisClient";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

describe('GET /api/users/@me', () => {
    let userId: number;
    let token: string;

    beforeAll(async () => {
        await userModel.deleteMany();
        await redisClient.flushall();

      // register a new user
        const user = {
        data: {
            type: "user",
            attributes: {
                email: "test_user@example.com",
                username: "test_user",
                password: "password123",
            },
        },
    };

        const response = await request(app)
        .post("/api/auth/register")
        .send(user)
        .expect(201);

      // store the userId and token
        userId = response.body.data.id;
        token = response.headers.authorization.split(" ")[1];
    });

    afterAll(async () => {
        await userModel.deleteMany();
        await redisClient.quit();
    });

    it("should return 200 if the operation is successful", async () => {
        const response = await request(app)
        .get(`/api/users/@me`)
        .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual({
            type: "user",
            id: userId,
            attributes: {
                email: "test_user@example.com",
                username: "test_user",
                created: expect.any(String),
                updated: expect.any(String),
            },
        });
    });
});