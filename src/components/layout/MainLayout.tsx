import { Layout } from "antd";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const { Sider, Content } = Layout;

export default function MainLayout() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={220}>
        <Sidebar />
      </Sider>

      <Layout>
        <Header />

        <Content
          style={{
            margin: 16,
            padding: 16,
            background: "#fff",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}