import { useEffect, useState } from "react";
import {
  Card,
  Descriptions,
  Button,
  Space,
  Tag,
} from "antd";

const STATUS_LIST = [
  "INBOUND",
  "YARD",
  "OUTBOUND",
];

interface Props {
  container: any;
  onStatusChange: (
    containerId: string,
    status: string
  ) => void;
}

export default function ContainerDetail({
  container,
  onStatusChange,
}: Props) {
  const [selectedStatus, setSelectedStatus] =
    useState("");

  useEffect(() => {
    if (container) {
      setSelectedStatus(container.status);
    }
  }, [container]);

  if (!container) {
    return null;
  }

  const getTagColor = (status: string) => {
    switch (status) {
      case "INBOUND":
        return "blue";
      case "YARD":
        return "green";
      case "OUTBOUND":
        return "red";
      default:
        return "default";
    }
  };

  const handleUpdate = () => {
    onStatusChange(
      container.container_id,
      selectedStatus
    );
  };

  return (
    <Card
      title="Container Detail"
      style={{ marginTop: 24 }}
    >
      <Descriptions column={1}>
        {/* <Descriptions.Item label="Container ID">
          {container.container_id}
        </Descriptions.Item> */}

        <Descriptions.Item label="Container No">
          {container.container_no}
        </Descriptions.Item>

        <Descriptions.Item label="Status">
          <Space wrap>
            {STATUS_LIST.map((status) => (
              <Button
                key={status}
                type={
                  selectedStatus === status
                    ? "primary"
                    : "default"
                }
                onClick={() =>
                  setSelectedStatus(status)
                }
              >
                {status}
              </Button>
            ))}

            <Button
              type="primary"
              disabled={
                selectedStatus ===
                container.status
              }
              onClick={() =>
                onStatusChange(
                  container.container_id,
                  selectedStatus
                )
              }
            >
              수정
            </Button>

            <Tag color={getTagColor(container.status)}>
              현재: {container.status}
            </Tag>
          </Space>
        </Descriptions.Item>

        <Descriptions.Item label="Created At">
          {container.created_at
            ? new Date(
                container.created_at
              ).toLocaleString()
            : "-"}
        </Descriptions.Item>

        <Descriptions.Item label="Updated At">
          {container.updated_at
            ? new Date(
                container.updated_at
              ).toLocaleString()
            : "-"}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}