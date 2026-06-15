import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
} from "antd";

import {
  getUsersApi,
  createUserApi,
} from "../api/userApi";

import type { User } from "../api/userApi";

import { useAuthStore } from "../store/authStore";

export default function UsersPage() {
  const user = useAuthStore((s) => s.user);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const [form] = Form.useForm();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsersApi();
      setUsers(data);
    } catch (e) {
      message.error("유저 조회 실패");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onCreate = async (values: any) => {
    try {
      await createUserApi(values);
      message.success("유저 생성 완료");
      setOpen(false);
      form.resetFields();
      fetchUsers();
    } catch (e) {
      message.error("생성 실패");
    }
  };


  if (user?.role !== "ADMIN") {
    return <div>권한이 없습니다.</div>;
  }

  return (
    <div>
      <Button
        type="primary"
        onClick={() => setOpen(true)}
        style={{ marginBottom: 16 }}
      >
        Create User
      </Button>

      <Table
        dataSource={users}
        rowKey="id"
        loading={loading}
        columns={[
          {
            title: "ID",
            dataIndex: "id",
          },
          {
            title: "Username",
            dataIndex: "username",
          },
          {
            title: "Role",
            dataIndex: "role",
          },
        ]}
      />

      <Modal
        open={open}
        title="Create User"
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={onCreate}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: "ADMIN", label: "ADMIN" },
                { value: "OPERATOR", label: "OPERATOR" },
                { value: "VIEWER", label: "VIEWER" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}