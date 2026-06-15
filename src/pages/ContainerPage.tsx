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
  updateContainerStatus,
  getContainer,
} from "../api/containerApi";

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

  // =========================
  // AUTH
  // =========================
  const user = useAuthStore((s) => s.user);
  const isViewer = user?.role === "VIEWER";

  // =========================
  // LOAD
  // =========================
  const load = async () => {
    try {
      setLoading(true);
      const res = await getContainers();
      const list = res.data?.data ?? res.data ?? [];
      setData(list);
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
  // DELETE
  // =========================
  const handleDelete = async (id: string) => {
    try {
      await deleteContainer(id);

      if (selectedContainer && selectedContainer.container_id === id) {
        setSelectedContainer(null);
      }

      load();
    } catch (err) {
      handleApiError(err);
    }
  };

  // =========================
  // SELECT
  // =========================
  const handleSelectContainer = async (containerId: string) => {
    try {
      const res = await getContainer(containerId);
      setSelectedContainer(res.data?.data ?? res.data);
    } catch (err) {
      handleApiError(err);
    }
  };

  // =========================
  // STATUS UPDATE
  // =========================
  const handleStatus = async (id: string, status: string) => {
    try {
      await updateContainerStatus(id, status);
      await load();

      const detail = await getContainer(id);
      setSelectedContainer(detail.data?.data ?? detail.data);

      setEventRefresh((prev) => prev + 1);
    } catch (err) {
      handleApiError(err);
    }
  };

  // =========================
  // TABLE COLUMNS
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

    // 🔥 VIEWER 아닐 때만 Action 컬럼 추가
    ...(!isViewer
      ? [
          {
            title: "Action",
            render: (_: any, record: any) => (
              <Space>
                <Popconfirm
                  title="Delete container?"
                  onConfirm={() =>
                    handleDelete(record.container_id)
                  }
                >
                  <Button danger size="small">
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]
      : []),
  ];

  // =========================
  // RENDER
  // =========================
  return (
    <div>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
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
          onClick: () =>
            handleSelectContainer(record.container_id),
          style: { cursor: "pointer" },
        })}
      />

      {/* DETAIL AREA */}
      {selectedContainer && (
        <Row gutter={16} align="top" style={{ marginTop: 16 }}>
          {/* VIEWER는 Detail 제거 */}
          {!isViewer && (
            <Col span={10}>
              <ContainerDetail
                container={selectedContainer}
                onStatusChange={handleStatus}
              />
            </Col>
          )}

          {/* TIMELINE ONLY */}
          <Col span={isViewer ? 24 : 14}>
            <ContainerEvent
              containerId={selectedContainer.container_id}
              refresh={eventRefresh}
            />
          </Col>
        </Row>
      )}

      {/* CREATE MODAL */}
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