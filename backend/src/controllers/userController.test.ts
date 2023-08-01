import { mUserCreate, mUserFindOne, mClientFindByIdAndUpdate, mClientFindById } from "../tests/test-utils";
import { Request, Response } from "express";
import { create, get } from "./userController";

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
        expect(mUserCreate).toHaveBeenCalledWith({ name, role, email, password: expect.any(String)});
        expect(mClientFindByIdAndUpdate).toHaveBeenCalledTimes(1);
        expect(mClientFindByIdAndUpdate).toHaveBeenCalledWith(clientId, {$push: {users: newUser._id}}, {new: true});
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
        expect(mJson).toHaveBeenCalledWith({ error: "ClientId is missing"});
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
        mUserFindOne.mockResolvedValueOnce("foundUser");
        await create(req, res);

        expect(mUserFindOne).toHaveBeenCalledTimes(1);
        expect(mUserFindOne).toHaveBeenCalledWith({ email });
        expect(mUserCreate).toHaveBeenCalledTimes(0);
        expect(mClientFindByIdAndUpdate).toHaveBeenCalledTimes(0);
        expect(mStatus).toHaveBeenCalledTimes(1);
        expect(mStatus).toHaveBeenCalledWith(500);
        expect(mJson).toHaveBeenCalledTimes(1);
        expect(mJson).toHaveBeenCalledWith({ error: "Email already used, user already created"});
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
        expect(mJson).toHaveBeenCalledWith({error: "Client not found"});
    });
});

describe("get", () => {
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
        expect(mJson).toHaveBeenCalledWith({ msg:"User recuperation is a sucess" , users: mUsers });
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