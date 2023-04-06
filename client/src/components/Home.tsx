import { UserToken } from '../typeUtils/types';
import usersService from '../services/usersService';
import loginService from '../services/loginService';

interface Props {
    setUser: (userToken: UserToken | null) => void
};

const Home = (props: Props) => {

    const createUser = (username: string, password: string): void => {
        usersService.createUser({ username, password });
    };

    const login = (username: string, password: string): void => {
        loginService.login({ username, password }).then(
            userToken => props.setUser(userToken)
        );
    };

    return (
        <div className='Home'></div>
    );
};

export default Home;