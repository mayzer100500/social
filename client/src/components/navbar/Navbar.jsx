import "./navbar.scss"
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";

const navbar = () => {
    const { toggle, darkMode } = useContext(DarkModeContext)
    const { currentUser, logout } = useContext(AuthContext)
    return (
        <div className='navbar'>
            <div className="left">
                <Link to="/" style={{ textDecoration: "none" }}>
                    <span>HelloWorldSocial</span>
                </Link>
                <Link to="/" style={{ textDecoration: "none" }}>
                    <HomeOutlinedIcon />
                </Link>
                {darkMode ? <WbSunnyOutlinedIcon onClick={toggle} style={{ cursor: "pointer" }} /> : <DarkModeOutlinedIcon onClick={toggle} style={{ cursor: "pointer" }} />}
                <GridViewOutlinedIcon />
                <div className="search">
                    <SearchOutlinedIcon />
                    <input type="text" placeholder="Search..." />
                </div>
            </div>
            <div className="right">
                <Link to={`/profile/${currentUser.id}`}>
                    <PersonOutlinedIcon />
                </Link>
                <EmailOutlinedIcon />
                <NotificationsOutlinedIcon />
                <Link to={`/profile/${currentUser.id}`}>
                    <div className="user">
                        <img src={`../public/upload/${currentUser.profilePic}`} alt="" />
                        <span>{currentUser.name}</span>
                    </div>
                </Link>
                <LogoutIcon style={{ cursor: "pointer" }} onClick={logout} />
            </div>
        </div>
    )
}

export default navbar