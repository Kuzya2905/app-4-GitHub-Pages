import React from "react";
import UserContext from "../Context/Context";

const Header = () => {
  const { date } = React.useContext(UserContext);
  
  return (
    <header>
      <div className="left">
        <span className="welcome">Welcome</span>
        <span className="date">{date}</span>
      </div>
    </header>
  );
};

export default Header;
