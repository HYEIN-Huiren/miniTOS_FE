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
    status: string,
    yard_id?: number,
  ) => void;
}
const EVENT_TYPE_TO_STATUS: Record<string, string> = {
REGISTER: "REGISTERED",
INBOUND: "INBOUND",
MOVE_YARD: "YARD",
OUTBOUND: "OUTBOUND",
CLOSED: "CLOSED",
};

const EVENT_TYPE_LIST = [
"INBOUND",
"MOVE_YARD",
"OUTBOUND",
"CLOSED",
];

export default function ContainerDetail({
container,
onEvent,
}: Props) {
const [selectedEventType, setSelectedEventType] =
useState("");

const [selectedYardId, setSelectedYardId] =
useState<number | null>(null);

useEffect(() => {
if (container) {
setSelectedEventType("");
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

const targetStatus =
EVENT_TYPE_TO_STATUS[selectedEventType] || "";

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

    {selectedEventType === "MOVE_YARD" && (
      <Descriptions.Item label="Yard">
        <Select
          style={{ width: 220 }}
          value={selectedYardId}
          onChange={setSelectedYardId}
          options={[
            { label: "A", value: 1 },
            { label: "B", value: 2 },
            { label: "C", value: 3 },
            { label: "D", value: 4 },
            { label: "E", value: 5 },
          ]}
        />
      </Descriptions.Item>
    )}

    <Descriptions.Item label="To Status">
      <Tag color={getTagColor(targetStatus)}>
        {targetStatus || "-"}
      </Tag>
    </Descriptions.Item>

    <Descriptions.Item label="Action">
      <Button
        type="primary"
        disabled={!selectedEventType}
        onClick={() =>
          onEvent(
            container.container_id,
            selectedEventType,
            targetStatus,
            selectedYardId ?? undefined
          )
        }
      >
        Edit
      </Button>
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