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
jest.mock("../models/Client", () => ({
    findOne: mClientFindOne,
    updateOne: mClientUpdateOne,
}));

export {
    mDatasetCreate,
    mDomainCreate,
    mDomainFindOne,
    mDomainUpdateOne,
    mClientFindOne,
    mClientUpdateOne,
    mDomainFind,
};
