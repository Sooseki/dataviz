const mGetToken = jest.fn();
jest.mock("../utils/handleToken", () => ({
    getToken: mGetToken,
}));



import { mUserCreate, mUserFindOne, mClientFindByIdAndUpdate, mClientFindById, mClientCreate, mClientFindOne, mUserFindById, mUserUpdateOne } from "../tests/test-utils";
import { Request, Response } from "express";
import { create, get, register, login, updatePassword, updateUser } from "./userController";

describe("create", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it("should create an user", async () => {
        const email = "newUserMail";
        const password = "newUserPassword";
        const role = "newUserRole";
        const name = "newUserName";
        const clientId = "clientIdTest";

        const req = { body: { email, password, name, clientId, role } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;
        const newUser = {
            _id: "newUserId",
            name,
            role,
            email,
            password
        };
        mUserFindOne.mockResolvedValueOnce(undefined);
        mUserCreate.mockResolvedValueOnce(newUser);
        mClientFindByIdAndUpdate.mockResolvedValueOnce("validClient");
        await create(req, res);

        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(mUserFindOne).toHaveBeenCalledWith({ email });
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith({ name, role, email, password: expect.any(String) });
        expect(mClientFindByIdAndUpdate).toHaveBeenCalledTimes(1);
        expect(mClientFindByIdAndUpdate).toHaveBeenCalledWith(clientId, { $push: { users: newUser._id } }, { new: true });
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(200);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ msg: "User creation sucessfull", user: newUser });
    });
    it("Return error 500 if clientId is null", async () => {
        const email = "newUserMail";
        const password = "newUserPassword";
        const role = "newUserRole";
        const name = "newUserName";
        const clientId = "";

        const req = { body: { email, password, name, clientId, role } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;

        await create(req, res);

        expect(mUserFindOne).toHaveBeenCalledTimes(0);
        expect(mUserCreate).toHaveBeenCalledTimes(0);
        expect(mClientFindByIdAndUpdate).toHaveBeenCalledTimes(0);
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ error: "ClientId is missing" });
    });
    it("should return error if an user is found", async () => {
        const email = "newUserMail";
        const password = "newUserPassword";
        const role = "newUserRole";
        const name = "newUserName";
        const clientId = "clientIdTest";

        const req = { body: { email, password, name, clientId, role } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;
        mUserFindOne.mockResolvedValueOnce(true);
        await create(req, res);

        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(mUserFindOne).toHaveBeenCalledWith({ email });
        expect(mUserCreate).toHaveBeenCalledTimes(0);
        expect(mClientFindByIdAndUpdate).toHaveBeenCalledTimes(0);
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ error: "Email already used, user already created" });
    });
    it("should return error if a client is not found", async () => {
        const email = "newUserMail";
        const password = "newUserPassword";
        const role = "newUserRole";
        const name = "newUserName";
        const clientId = "clientIdTest";

        const req = { body: { email, password, name, clientId, role } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;
        const newUser = {
            _id: "newUserId",
            name,
            role,
            email,
            password
        };
        mUserFindOne.mockResolvedValueOnce(undefined);
        mUserCreate.mockResolvedValueOnce(newUser);
        mClientFindByIdAndUpdate.mockResolvedValueOnce(undefined);
        await create(req, res);

        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(mUserFindOne).toHaveBeenCalledWith({ email });
        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith({ name, role, email, password: expect.any(String) });
        expect(mClientFindByIdAndUpdate).toHaveBeenCalledTimes(1);
        expect(mClientFindByIdAndUpdate).toHaveBeenCalledWith(clientId, { $push: { users: newUser._id } }, { new: true });
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ error: "Client not found" });
    });
});

describe("get", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it("should get all users of a provided client", async () => {
        const clientId = "clientIdTest";

        const req = { query: { clientId } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;

        const mUsers = [
            {
                _id: "newUserId",
                name: "newUserName",
                role: "newUserRole",
                email: "newUserMail",
                password: "newUserPassword",
            },
            {
                _id: "newUserId2",
                name: "newUserName2",
                role: "newUserRole2",
                email: "newUserMail2",
                password: "newUserPassword2",
            },
        ];

        const mClient = {
            id: "clientIdTest",
            name: "clientNameTest",
            users: mUsers,
        };
        const mPopulate = jest.fn();
        mClientFindById.mockImplementationOnce(() => ({ populate: mPopulate }));
        mPopulate.mockResolvedValueOnce(mClient);
        await get(req, res);

        expect(mPopulate).toHaveBeenCalledTimes(1);
        expect(mPopulate).toHaveBeenCalledWith("users");
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(200);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ msg: "User recuperation is a sucess", users: mUsers });
    });
    it("should return error 500 if no client is found", async () => {
        const clientId = "";
        const req = { query: { clientId } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;

        const mPopulate = jest.fn();
        mClientFindById.mockImplementationOnce(() => ({ populate: mPopulate }));
        mPopulate.mockResolvedValueOnce(undefined);
        await get(req, res);

        expect(mPopulate).toHaveBeenCalledTimes(1);
        expect(mPopulate).toHaveBeenCalledWith("users");
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ error: "Client not found" });
    });
});


describe("register", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it("should register a new user", async () => {
        const name = "newUserName";
        const email = "newUserMail";
        const password = "newUserPassword";
        const company = "companyName";
        const role = "administrator";

        const req = { body: { name, email, password, company } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;

        mUserFindOne.mockResolvedValueOnce(undefined);
        mUserCreate.mockResolvedValueOnce({ id: "newUserIdTest", name, role, email, password });
        mClientCreate.mockResolvedValueOnce({ _id: "newClientIdTest", name: company });
        mGetToken.mockResolvedValueOnce("token");

        await register(req, res);

        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(mUserFindOne).toHaveBeenCalledWith({ email });

        expect(mUserCreate).toHaveBeenCalledTimes(1);
        expect(mUserCreate).toHaveBeenCalledWith({ name, role, email, password: expect.any(String), });

        expect(mClientCreate).toHaveBeenCalledTimes(1);
        expect(mClientCreate).toHaveBeenCalledWith({ name: company, users: ["newUserIdTest"] });

        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(200);

        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ msg: "register sucessfull", token: "token" });
    });


    it("should trigger an error because email is already used", async () => {
        const name = "newUserName";
        const email = "newUserMail";
        const password = "newUserPassword";
        const company = "companyName";

        const req = { body: { name, email, password, company } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;

        mUserFindOne.mockResolvedValueOnce(true);

        await register(req, res);

        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(mUserFindOne).toHaveBeenCalledWith({ email });

        expect(mUserCreate).toHaveBeenCalledTimes(0);

        expect(mClientCreate).toHaveBeenCalledTimes(0);

        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);

        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ error: "Email already used, take another one" });
    });
});


describe("login", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it("should login", async () => {
        const email = "newUserMail";
        const password = "newUserPassword";

        const req = { body: { email, password } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;

        mUserFindOne.mockResolvedValueOnce({ _id: "idUserTest", password: "$2a$12$sq3k7qt1GRWJ9Yvukcm9buvZgsjCIkRR9EReMBel6JR7cpoNG7PuC" });
        mClientFindOne.mockResolvedValueOnce({ name: "clientNameTest", _id: "idClientTest" });
        mGetToken.mockResolvedValueOnce("token");

        await login(req, res);

        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(mUserFindOne).toHaveBeenCalledWith({ email });

        expect(mClientFindOne).toHaveBeenCalledTimes(1);
        expect(mClientFindOne).toHaveBeenCalledWith({ users: "idUserTest" });

        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(200);

        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ msg: "Logged in", token: "token" });

    });
    it("should trigger an error because user with this mail do not exist ", async () => {
        const email = "newUserMail";
        const password = "newUserPassword";

        const req = { body: { email, password } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;

        mUserFindOne.mockResolvedValueOnce(undefined);

        await login(req, res);

        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(mUserFindOne).toHaveBeenCalledWith({ email });

        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);

        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ error: "User does not exist" });
    });
    it("should trigger an errror because there is no client attached to this user", async () => {
        const email = "newUserMail";
        const password = "newUserPassword";

        const req = { body: { email, password } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;

        mUserFindOne.mockResolvedValueOnce({ _id: "idUserTest", password: "$2a$12$sq3k7qt1GRWJ9Yvukcm9buvZgsjCIkRR9EReMBel6JR7cpoNG7PuC" });
        mClientFindOne.mockResolvedValueOnce(undefined);
        await login(req, res);

        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(mUserFindOne).toHaveBeenCalledWith({ email });

        expect(mClientFindOne).toHaveBeenCalledTimes(1);
        expect(mClientFindOne).toHaveBeenCalledWith({ users: "idUserTest" });

        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);

        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ error: "Client does not exist" });
    });
    it("should trigger an errror because the password dont match", async () => {
        const email = "newUserMail";
        const password = "newUserPassword";

        const req = { body: { email, password } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;

        mUserFindOne.mockResolvedValueOnce({ _id: "idUserTest", password: "$2a$12$sq3kdsqdqd684dsqoi$qdiojqodinqèylqjsndlkjq" });
        mClientFindOne.mockResolvedValueOnce({ name: "clientNameTest", _id: "idClientTest" });
        await login(req, res);

        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(mUserFindOne).toHaveBeenCalledWith({ email });

        expect(mClientFindOne).toHaveBeenCalledTimes(1);
        expect(mClientFindOne).toHaveBeenCalledWith({ users: "idUserTest" });

        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);

        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ error: "Incorrect password" });
    });
});


describe("updatePassword", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it("should update a password", async () => {
        const currentPassword = "oldUserPassword";
        const newPassword = "newUserPassword";
        const id = "idUserTest";
        
        const req = { body: { currentPassword, newPassword, id } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;

        mUserFindById.mockResolvedValueOnce({ id, password: "$2a$12$OTguFvVCy2lty6l5mKsMr.FhL0TqhAxJFinKSKT5D6b9uB5Tja4TK" });
        mUserUpdateOne.mockResolvedValueOnce(" ");
        mGetToken.mockResolvedValueOnce("token");
        await updatePassword(req, res);

        expect(mUserFindById).toHaveBeenCalledTimes(1);
        expect(mUserFindById).toHaveBeenCalledWith(id);

        expect(mUserUpdateOne).toHaveBeenCalledTimes(1);
        expect(mUserUpdateOne).toHaveBeenCalledWith({ _id : id }, {password: expect.any(String)});

        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(200);

        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ msg: "register new password", token: "token" });
    });
    it("should return an error because user do not exist with this id ", async () => {
        const currentPassword = "oldUserPassword";
        const newPassword = "newUserPassword";
        const id = "idUserTest";
        
        const req = { body: { currentPassword, newPassword, id } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;

        mUserFindById.mockResolvedValueOnce(undefined);
       
        await updatePassword(req, res);

        expect(mUserFindById).toHaveBeenCalledTimes(1);
        expect(mUserFindById).toHaveBeenCalledWith(id);

        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);

        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ error: "user not found" });
    });
    it("should return an error because of password dont match", async () => {
        const currentPassword = "oldUserPassword";
        const newPassword = "newUserPassword";
        const id = "idUserTest";
        
        const req = { body: { currentPassword, newPassword, id } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;

        mUserFindById.mockResolvedValueOnce({ id, password: "notTheSamePassword" });

        await updatePassword(req, res);

        expect(mUserFindById).toHaveBeenCalledTimes(1);
        expect(mUserFindById).toHaveBeenCalledWith(id);

        

        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);

        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ error: "current password is not valid" });
    });
});

describe("updateUser", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });
    it("should update user info (except password)", async () => {
        const name = "newUserName";
        const email = "newUserMail";
        const id = "idUserTest";

        const req = { body: { name, email, id } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;

        mUserFindById.mockResolvedValueOnce({ id, password: "$2a$12$OTguFvVCy2lty6l5mKsMr.FhL0TqhAxJFinKSKT5D6b9uB5Tja4TK" });
        mUserFindOne.mockResolvedValueOnce(undefined);

        mUserUpdateOne.mockResolvedValueOnce(" ");
        mGetToken.mockResolvedValueOnce("token");

        await updateUser(req, res);

        expect(mUserFindById).toHaveBeenCalledTimes(1);
        expect(mUserFindById).toHaveBeenCalledWith(id);

        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(mUserFindOne).toHaveBeenCalledWith({ email });

        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(200);

        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ msg: "register new user info sucessfull", token: "token" });
    });
    it("should return an error because it dosnt find the user with this id", async () => {
        const name = "newUserName";
        const email = "newUserMail";
        const id = "idUserTest";

        const req = { body: { name, email, id } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;

        mUserFindById.mockResolvedValueOnce(undefined);

        await updateUser(req, res);

        expect(mUserFindById).toHaveBeenCalledTimes(1);
        expect(mUserFindById).toHaveBeenCalledWith(id);

        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);

        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ error: "user not found" });
    });
    it("should return an error because the new mail wanted is already used", async () => {
        const name = "newUserName";
        const email = "newUserMail";
        const id = "idUserTest";

        const req = { body: { name, email, id } } as unknown as Request;
        const mJson = jest.fn();
        const mStatus = jest.fn(() => ({ json: mJson }));
        const res = { status: mStatus } as unknown as Response;

        mUserFindById.mockResolvedValueOnce({ id, password: "$2a$12$OTguFvVCy2lty6l5mKsMr.FhL0TqhAxJFinKSKT5D6b9uB5Tja4TK" });
        mUserFindOne.mockResolvedValueOnce(true);

        await updateUser(req, res);

        expect(mUserFindById).toHaveBeenCalledTimes(1);
        expect(mUserFindById).toHaveBeenCalledWith(id);

        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(mUserFindOne).toHaveBeenCalledWith({ email });

        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);

        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ error: "Email already used, take another one" });
    });
});

