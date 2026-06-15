import { Button } from "antd";
import { useNavigate } from "react-router-dom";

import { getUsername, removeToken } from "../../utils/auth";

export default function Header() {
  const navigate = useNavigate();
  const username = getUsername();

  const logout = () => {
    removeToken();
    navigate("/");
  };

  return (
    <div
      style={{
        height: 60,
        background: "#fff",
        borderBottom: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
      }}
    >
      <h3 style={{ margin: 0 }}>
        Mini TOS System
      </h3>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span>
          {username}
        </span>

        <Button
          danger
          onClick={logout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}