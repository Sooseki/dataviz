const mDatasetCreate = jest.fn();
jest.mock("../models/Dataset", () => ({
    create: mDatasetCreate,
}));

const mDomainCreate = jest.fn();
const mDomainFindOne = jest.fn();
const mDomainFind = jest.fn();
const mDomainUpdateOne = jest.fn();
jest.mock("../models/Domain", () => ({
    create: mDomainCreate,
    findOne: mDomainFindOne,
    updateOne: mDomainUpdateOne,
    find: mDomainFind,
}));

const mClientFindOne = jest.fn();
const mClientUpdateOne = jest.fn();
const mClientFindByIdAndUpdate = jest.fn();
const mClientFindById = jest.fn();
jest.mock("../models/Client", () => ({
    findOne: mClientFindOne,
    updateOne: mClientUpdateOne,
    findByIdAndUpdate: mClientFindByIdAndUpdate,
    findById: mClientFindById
}));


const mUserCreate = jest.fn();
const mUserFindOne = jest.fn();
jest.mock("../models/User", () => ({
    create: mUserCreate,
    findOne: mUserFindOne
}));

export {
    mDatasetCreate,
    mDomainCreate,
    mDomainFindOne,
    mDomainUpdateOne,
    mDomainFind,
    mClientFindOne,
    mClientUpdateOne,
    mClientFindByIdAndUpdate,
    mClientFindById,
    mUserCreate,
    mUserFindOne,
};
