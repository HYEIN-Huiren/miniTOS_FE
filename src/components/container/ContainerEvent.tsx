import { useEffect, useState } from "react";

import {
  Card,
  Steps,
  Divider,
  Table,
  Tag,
  Empty,
} from "antd";

import { getContainerEvents } from "../../api/eventApi";
import { handleApiError } from "../../utils/errorHandler";

interface Props {
  containerId?: string;
  refresh?: number;
}

export default function ContainerEvent({
  containerId,
  refresh,
}: Props) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadEvents = async () => {
    if (!containerId) {
      setEvents([]);
      return;
    }

    try {
      setLoading(true);

      const res = await getContainerEvents(
        containerId
      );

      const data =
        res.data?.data ?? [];

      setEvents(data);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [containerId, refresh]);

  const getStatusColor = (
    status: string
  ) => {
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

  const columns = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",

      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Event Time",
      dataIndex: "event_time",
      key: "event_time",

      render: (value: string) =>
        new Date(value).toLocaleString(
          "ko-KR",
          {
            timeZone: "Asia/Seoul",
          }
        ),
    },
  ];

  if (!containerId) {
    return (
      <Card title="Event History">
        <Empty
          description="Select Container"
        />
      </Card>
    );
  }

  return (
    <Card
      title="Event History"
      style={{ height: "100%" }}
    >
      <Steps
        size="small"
        current={events.length - 1}
        items={events
          .slice()
          .reverse()
          .map((event) => ({
            title: event.status,
          }))}
      />

      <Divider />

      <Table
        rowKey="event_id"
        columns={columns}
        dataSource={events}
        loading={loading}
        pagination={false}
        size="small"
        scroll={{
          y: 300,
        }}
      />
    </Card>
  );
}