import { useEffect, useState } from "react";
import {
  Card,
  Descriptions,
  Button,
  Space,
  Tag,
  Select,
} from "antd";

interface Props {
  container: any;
  onEvent: (
    containerId: string,
    event_type: string,
    status: string
  ) => void;
}

const STATUS_LIST = [
  "REGISTERED",
  "INBOUND",
  "YARD",
  "OUTBOUND",
  "CLOSED",
];

const EVENT_TYPE_LIST = [
  "REGISTER",
  "INBOUND",
  "MOVE_YARD",
  "OUTBOUND",
  "CLOSED",
];

export default function ContainerDetail({
  container,
  onEvent,
}: Props) {
  const [selectedStatus, setSelectedStatus] =
    useState("");

  const [selectedEventType, setSelectedEventType] =
    useState("");

  useEffect(() => {
    if (container) {
      setSelectedStatus(container.status);

      // 기본값
      setSelectedEventType(
        container.status === "REGISTERED"
          ? "INBOUND"
          : container.status
      );
    }
  }, [container]);

  if (!container) {
    return null;
  }

  const getTagColor = (status: string) => {
    switch (status) {
      case "REGISTERED":
        return "default";

      case "INBOUND":
        return "blue";

      case "YARD":
        return "green";

      case "OUTBOUND":
        return "red";

      case "CLOSED":
        return "purple";

      default:
        return "default";
    }
  };

  return (
    <Card
      title="Container Detail"
      style={{ marginTop: 24 }}
    >
      <Descriptions column={1}>
        <Descriptions.Item label="Container No">
          {container.container_no}
        </Descriptions.Item>

        <Descriptions.Item label="Current Status">
          <Tag color={getTagColor(container.status)}>
            {container.status}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Event Type">
          <Select
            style={{ width: 220 }}
            value={selectedEventType}
            onChange={setSelectedEventType}
            options={EVENT_TYPE_LIST.map(
              (value) => ({
                label: value,
                value,
              })
            )}
          />
        </Descriptions.Item>

        <Descriptions.Item label="To Status">
          <Select
            style={{ width: 220 }}
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={STATUS_LIST.map(
              (value) => ({
                label: value,
                value,
              })
            )}
          />
        </Descriptions.Item>

        <Descriptions.Item label="Action">
          <Space>
            <Button
              type="primary"
              disabled={
                !selectedEventType ||
                !selectedStatus
              }
              onClick={() =>
                onEvent(
                  container.container_id,
                  selectedEventType,
                  selectedStatus
                )
              }
            >
              수정
            </Button>
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