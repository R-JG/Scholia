import User from '../models/User';
import { NewUser } from '../../typeUtils/types';

const getAll = async () => await User.findAll();

const getOne = async (primaryKey: string) => await User.findByPk(primaryKey);

const createOne = async (newUserData: NewUser) => await User.create(newUserData);

const deleteOne = async (primaryKey: string) => await User.destroy({ where: { id: primaryKey } });

export default { getAll, getOne, createOne, deleteOne };