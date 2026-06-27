import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Popconfirm,
  Row,
  Col,
} from "antd";

import {
  getContainers,
  deleteContainer,
  getContainer,
} from "../api/containerApi";

import { createContainerEvent } from "../api/eventApi";

import ContainerForm from "../components/container/ContainerForm";
import ContainerDetail from "../components/container/ContainerDetail";
import ContainerEvent from "../components/container/ContainerEvent";

import { handleApiError } from "../utils/errorHandler";
import { useAuthStore } from "../store/authStore";

export default function ContainerPage() {
  const [data, setData] = useState<any[]>([]);
  const [selectedContainer, setSelectedContainer] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [eventRefresh, setEventRefresh] = useState(0);

  const user = useAuthStore((s) => s.user);
  const isViewer = user?.role === "VIEWER";

  // =========================
  // LOAD
  // =========================
  const load = async () => {
    try {
      setLoading(true);
      const res = await getContainers();
      setData(res.data?.data ?? []);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // =========================
  // SELECT
  // =========================
  const handleSelectContainer = async (id: string) => {
    try {
      const res = await getContainer(id);
      setSelectedContainer(res.data?.data ?? res.data);
    } catch (err) {
      handleApiError(err);
    }
  };

  // =========================
  // EVENT ACTION (핵심)
  // =========================
  const handleEvent = async (
    containerId: string,
    event_type: string,
    status: string,
    yard_id?: number,
  ) => {
    try {
      await createContainerEvent(containerId, {
        event_type,
        status,
        yard_id,
      });

      // detail refresh
      await load()

      const detail = await getContainer(containerId);
      setSelectedContainer(detail.data?.data ?? detail.data);

      setEventRefresh((prev) => prev + 1);
    } catch (err) {
      handleApiError(err);
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id: string) => {
    try {
      await deleteContainer(id);

      if (selectedContainer?.container_id === id) {
        setSelectedContainer(null);
      }

      load();
    } catch (err) {
      handleApiError(err);
    }
  };

  // =========================
  // TABLE
  // =========================
  const columns = [
    {
      title: "Container No",
      dataIndex: "container_no",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status: string) => {
        const color =
          status === "INBOUND"
            ? "blue"
            : status === "YARD"
            ? "green"
            : status === "OUTBOUND"
            ? "red"
            : "default";

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <Space>
          {!isViewer && (
            <Popconfirm
              title="Delete container?"
              onConfirm={() => handleDelete(record.container_id)}
            >
              <Button danger size="small">
                Delete
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Container Management</h2>

        {!isViewer && (
          <Button type="primary" onClick={() => setOpen(true)}>
            + Create
          </Button>
        )}
      </div>

      {/* TABLE */}
      <Table
        rowKey="container_id"
        columns={columns}
        dataSource={data}
        loading={loading}
        onRow={(record) => ({
          onClick: () => handleSelectContainer(record.container_id),
        })}
      />

      {/* DETAIL + EVENTS */}
      {selectedContainer && (
        <Row gutter={16} style={{ marginTop: 16 }}>
          {!isViewer && (
            <Col span={10}>
              <ContainerDetail
                container={selectedContainer}
                onEvent={handleEvent}
              />
            </Col>
          )}

          <Col span={isViewer ? 24 : 14}>
            <ContainerEvent
              containerId={selectedContainer.container_id}
              refresh={eventRefresh}
            />
          </Col>
        </Row>
      )}

      {/* CREATE */}
      {!isViewer && (
        <Modal
          title="Create Container"
          open={open}
          footer={null}
          onCancel={() => setOpen(false)}
          destroyOnClose
        >
          <ContainerForm
            onSuccess={() => {
              setOpen(false);
              load();
            }}
          />
        </Modal>
      )}
    </div>
  );
}