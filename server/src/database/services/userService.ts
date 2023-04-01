import User from '../models/User';

const getAll = async () => await User.findAll();

const getOne = async (primaryKey: string) => await User.findByPk(primaryKey);

const createOne = async () => {};

export default { getAll, getOne, createOne };