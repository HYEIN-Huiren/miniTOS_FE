import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Tag,
  Space,
  Modal,
  Popconfirm,
} from "antd";

import {
  getContainers,
  deleteContainer,
  updateContainerStatus,
} from "../api/containerApi";

import ContainerForm from "../components/container/ContainerForm";
import { handleApiError } from "../utils/errorHandler";

export default function ContainerPage() {
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleDelete = async (id: string) => {
    try {
      await deleteContainer(id);
      load();
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleStatus = async (id: string, status: string) => {
    try {
      await updateContainerStatus(id, status);
      load();
    } catch (err) {
      handleApiError(err);
    }
  };

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
            : "red";

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <Space>
          <Button
            size="small"
            onClick={() =>
              handleStatus(record.container_id, "INBOUND")
            }
          >
            IN
          </Button>

          <Button
            size="small"
            onClick={() =>
              handleStatus(record.container_id, "YARD")
            }
          >
            YARD
          </Button>

          <Button
            size="small"
            onClick={() =>
              handleStatus(record.container_id, "OUTBOUND")
            }
          >
            OUT
          </Button>

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
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2>Container Management</h2>

        <Button type="primary" onClick={() => setOpen(true)}>
          + Create
        </Button>
      </div>

      <Table
        rowKey="container_id"
        columns={columns}
        dataSource={data}
        loading={loading}
      />

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
    </div>
  );
}