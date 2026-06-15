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
import { getMeApi } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

const { Title } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();

  const setUser = useAuthStore(
    (s) => s.setUser
  );

  const login = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      // 1. login API
      const response = await api.post(
        "/auth/login",
        values
      );

      const token =
        response.data.access_token;

      // 2. token 저장
      setToken(token);

      // 3. user 정보 가져오기 (/auth/me)
      const me = await getMeApi();

      setUser(me.data);

      message.success("로그인 성공");

      // 4. dashboard 이동
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      message.error("로그인 실패");
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
      <Card style={{ width: 400 }}>
        <Title level={3}>
          miniTOS Login
        </Title>

        <Form layout="vertical" onFinish={login}>
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