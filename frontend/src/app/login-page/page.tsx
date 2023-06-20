import Link from 'next/link';
import '../styles/main.css';

const Login: React.FC = () => {
    return (
        <div>
            <h1>Welcome to the login page</h1>
            <Link href="/about">
                <a>HAHA</a>
            </Link>
        </div>
    );
};

export default Login;