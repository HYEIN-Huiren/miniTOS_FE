import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Spin,
} from "antd";

import { Pie } from "@ant-design/charts";

import { getContainers } from "../api/containerApi";
import { handleApiError } from "../utils/errorHandler";

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    inbound: 0,
    yard: 0,
    outbound: 0,
  });

  const [chartData, setChartData] = useState<any[]>([]);

  const load = async () => {
    try {
      setLoading(true);

      const res = await getContainers();

      const list = res.data?.data ?? [];

      const inbound = list.filter(
        (x: any) => x.status === "INBOUND"
      ).length;

      const yard = list.filter(
        (x: any) => x.status === "YARD"
      ).length;

      const outbound = list.filter(
        (x: any) => x.status === "OUTBOUND"
      ).length;

      setStats({
        total: list.length,
        inbound,
        yard,
        outbound,
      });

      setChartData([
        {
          type: "INBOUND",
          value: inbound,
        },
        {
          type: "YARD",
          value: yard,
        },
        {
          type: "OUTBOUND",
          value: outbound,
        },
      ]);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return <Spin />;
  }

  const pieConfig = {
    data: chartData,
    angleField: "value",
    colorField: "type",
    radius: 0.6,
    legend: {
      position: "bottom" as const,
    },
    label: {
      text: "value",
    },
  };

  return (
    <div>
      <h2>Terminal Dashboard</h2>

      <Row gutter={16}>
        {/* Summary */}
        <Col span={11}>
          <Card
            title="Container Summary"
            style={{ height: 500 }}
          >
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <Card
                  size="small"
                  style={{ height: 180 }}
                >
                  <Statistic
                    title="Total Containers"
                    value={stats.total}
                    valueStyle={{
                      fontSize: 42,
                    }}
                  />
                </Card>
              </Col>

              <Col span={8}>
                <Card
                  size="small"
                  style={{ height: 120 }}
                >
                  <Statistic
                    title="Inbound"
                    value={stats.inbound}
                  />
                </Card>
              </Col>

              <Col span={8}>
                <Card
                  size="small"
                  style={{ height: 120 }}
                >
                  <Statistic
                    title="Yard"
                    value={stats.yard}
                  />
                </Card>
              </Col>

              <Col span={8}>
                <Card
                  size="small"
                  style={{ height: 120 }}
                >
                  <Statistic
                    title="Outbound"
                    value={stats.outbound}
                  />
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Pie Chart */}
        <Col span={13}>
          <Card
            title="Container Status Distribution"
            style={{ height: 500 }}
          >
            <div
              style={{
                height: 320,
                marginTop: 20,
              }}
            >
              <Pie {...pieConfig} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}