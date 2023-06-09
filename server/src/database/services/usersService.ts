import { Op } from 'sequelize';
import User from '../models/User';
import { NewUser, UserModel } from '../../typeUtils/types';

const getAll = async (): Promise<UserModel[]> => await User.findAll();

const getOneById = async (primaryKey: string): Promise<UserModel | null> => {
    return await User.findByPk(primaryKey);
};

const getOneByUsername = async (username: string): Promise<UserModel | null> => {
    return await User.findOne({ where: { username } });
};

const getAllWhereUsernameMatches = async (searchTerm: string): Promise<UserModel[]> => {
    return await User.findAll({ where: { username: { [Op.like]: `%${searchTerm}%` } } });
};

const createOne = async (newUserData: NewUser): Promise<UserModel> => {
    return await User.create(newUserData);
};

const deleteOne = async (primaryKey: string): Promise<number> => {
    return await User.destroy({ where: { id: primaryKey } });
};

export default { getAll, getAllWhereUsernameMatches, getOneById, getOneByUsername, createOne, deleteOne };