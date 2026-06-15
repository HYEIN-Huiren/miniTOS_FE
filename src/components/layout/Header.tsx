import { Button } from "antd";
import { useNavigate } from "react-router-dom";

import { removeToken } from "../../utils/auth";
import { useAuthStore } from "../../store/authStore";

export default function Header() {
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const clearUser = useAuthStore((s) => s.clear);

  const logout = () => {
    removeToken();
    clearUser();
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
          {user?.username}
        </span>

        <Button danger onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
}