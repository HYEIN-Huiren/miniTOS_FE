import { Form, Input, Select, Button, message } from "antd";
import { createContainer } from "../../api/containerApi";
import { handleApiError } from "../../utils/errorHandler";

export default function ContainerForm({ onSuccess }: any) {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      console.log("SUBMIT:", values);

      await createContainer(values);

      message.success("Created successfully");

      form.resetFields();
      onSuccess?.(); // 모달 닫기
    } catch (err) {
      // ⭐ 핵심: 모달 안에서 에러 보여줌
      handleApiError(err);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="container_no"
        label="Container No"
        rules={[
          { required: true, message: "Container No required" },
        ]}
      >
        <Input />
      </Form.Item>

      {/* <Form.Item
        name="status"
        label="Status"
      >
        <Select
          options={[
            { value: "INBOUND" },
            { value: "YARD" },
            { value: "OUTBOUND" },
          ]}
        />
      </Form.Item> */}

      <Button type="primary" htmlType="submit" block>
        Create
      </Button>
    </Form>
  );
}