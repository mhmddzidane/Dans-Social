import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import { DarkModeContext } from "../../context/darkModeContext";
import "./navbar.scss";

const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [toggleLogout, setToggleLogout] = useState(false);
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "https://danssocial-api.vercel.app/api/auth/logout"
      );
      localStorage.removeItem("user");
      console.log(res);
      // navigate("/login");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const searchUser = async () => {
      try {
        setLoading(true);
        const res = await makeRequest.get("/users/search/" + search);
        setSearchData(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (search == "") {
      setSearchData([]);
    } else {
      searchUser();
    }
  }, [search]);
  console.log(searchData);

  const handleClickProfile = (id) => {
    navigate("/profile/" + id);
  };

  const handleHome = (id) => {
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>Dans Social</span>
        </Link>

        <HomeOutlinedIcon onClick={handleHome} style={{ cursor: "pointer" }} />

        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} style={{ cursor: "pointer" }} />
        ) : (
          <DarkModeOutlinedIcon
            onClick={toggle}
            style={{ cursor: "pointer" }}
          />
        )}

        <GridViewOutlinedIcon />
        <div className="searchComponent">
          <div className="search">
            <SearchOutlinedIcon />
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {search != "" && (
            <div className="searchUser">
              {loading ? (
                <p>searching username...</p>
              ) : searchData?.length > 0 ? (
                searchData.map((data) => (
                  <div
                    key={data.id}
                    onClick={() => handleClickProfile(data.id)}
                    style={{ cursor: "pointer", display: "flex" }}
                  >
                    <img
                      src={
                        data.profilePic
                          ? "/upload/" + data.profilePic
                          : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                      }
                      alt="profilepic"
                      style={{ padding: "3px" }}
                    />
                    <p style={{ padding: "2px" }}>{data.username}</p>
                  </div>
                ))
              ) : (
                <p>no username found</p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="right">
        <PersonOutlinedIcon />
        <EmailOutlinedIcon />
        <NotificationsOutlinedIcon />
        <div className="user">
          {toggleLogout && (
            <div
              onClick={handleLogout}
              style={{
                backgroundColor: "red",
                padding: "5px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              LOGOUT
            </div>
          )}
          <img
            src={
              currentUser.profilePic
                ? "/upload/" + currentUser.profilePic
                : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            alt=""
          />
          <span
            onClick={() => setToggleLogout(!toggleLogout)}
            style={{ cursor: "pointer" }}
          >
            {currentUser.name}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
