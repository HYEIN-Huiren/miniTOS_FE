import { useNavigate } from "react-router-dom";

import {
  Card,
  Input,
  Button,
  Typography,
  Form,
  message,
} from "antd";

import { api } from "../api/axios";
import { setToken } from "../utils/auth";

const { Title } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();

  const login = async (values) => {
    try {
      const response = await api.post(
        "/auth/login",
        values
      );

      setToken(
        response.data.access_token
      );
      message.success("로그인 성공");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
    style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f5f5f5",
    }}
  >
    <Card
      style={{
        width: 400,
      }}
    >
      <Title level={3}>
        miniTOS Login
      </Title>

      <Form
        layout="vertical"
        onFinish={login}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Username을 입력하세요",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Password를 입력하세요",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          block
        >
          Login
        </Button>
      </Form>
    </Card>
    </div>
  );
}