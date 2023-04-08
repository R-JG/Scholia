import { Link } from 'react-router-dom';
import '../css/Dashboard.css';

const Dashboard = () => {
    return (
        <div className='Dashboard'>
            <h1>Dashboard</h1>
            <Link to='/'>Home Test Link</Link>
        </div>
    );
};

export default Dashboard;