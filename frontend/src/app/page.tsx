import Link from 'next/link';
import '../styles/main.css';

const Home: React.FC = () => {
    return (
        <div>
            <h1>Welcome to the Home page</h1>
            <Link href="/about">
                <a>About</a>
            </Link>
        </div>
    );
};

export default Home;
