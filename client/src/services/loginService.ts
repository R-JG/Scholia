import axiosInstance from './axiosConfig';
import { UserEntry, LoggedInUser } from '../typeUtils/types';
import { parseLoggedInUser } from '../typeUtils/validation';

const baseUrl: string = '/api/v1/login';

const login = async (loginData: UserEntry): Promise<LoggedInUser | null> => {
    try {
        const response = await axiosInstance.post(baseUrl, loginData);
        const loggedInUser = parseLoggedInUser(response.data);
        return loggedInUser;
    } catch (error) {
        console.error(error);
        return null;
    };
};

const checkTokenValidity = async (token: string): Promise<boolean> => {
    try {
        const response = await axiosInstance.get(
            baseUrl, 
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return (response.data === 'valid');
    } catch (error) {
        console.error(error);
        return false;
    };
};

export default { login, checkTokenValidity };