import { Menu } from "antd";
import {
  DashboardOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <Menu
      theme="dark"
      mode="inline"
      onClick={(item) => navigate(item.key)}
      items={[
        {
          key: "/",
          icon: <DashboardOutlined />,
          label: "Dashboard",
        },
        {
          key: "/containers",
          icon: <DatabaseOutlined />,
          label: "Containers",
        },
      ]}
    />
  );
}