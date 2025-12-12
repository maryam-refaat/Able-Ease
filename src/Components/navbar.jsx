import { Link } from 'react-router-dom';
import logo from '../assets/user.png';
import '../Pages/Landpage.css';

export default function Navbar(){
    return (
        <div>
            <div className="landpage">
                <div className="header">
                    <Link to={'/'} className="header">Able-Ease</Link>
                </div>
                <div className="bars">
                    <Link to="/home">Home</Link>
                    <Link to="/about">About Us</Link>
                    <Link to="/about">Organizations</Link>
                    <Link to="/about">Physiotherapy</Link>
                    <button className="land-btn">
                        <img className="logo-img" src={logo} alt="user-logo"></img>
                        Join US
                    </button>
                </div>
            </div>
        </div>
    )
}