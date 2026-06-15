import { Menu } from "antd";
import {
  DashboardOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function Sidebar() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const items = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/containers",
      icon: <DatabaseOutlined />,
      label: "Containers",
    },
  ];

  if (user?.role === "ADMIN") {
    items.push({
      key: "/users",
      icon: <DatabaseOutlined />,
      label: "Users",
    });
  }

  return (
    <Menu
      theme="dark"
      mode="inline"
      onClick={(item) => navigate(item.key)}
      items={items}
    />
  );
}