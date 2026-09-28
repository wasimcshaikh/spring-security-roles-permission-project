import React from "react";
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";

ReactFC.fcRoot(
  FusionCharts,
  Charts
);

function RoleCountPieChart({ roleCounts }) {

  const chartData = Object.entries(roleCounts).map(
    ([role, count]) => ({
      label: role,
      value: count,
    })
  );

  const dataSource = {
    chart: {
      caption: "Users by Role",
      subCaption: "Distribution of users in MediSlot",
      showValues: "1",
      showPercentInTooltip: "1",
      showLegend: "1",
      enableSmartLabels: "1",
      use3DLighting: "0",
      theme: "fusion",
    },

    data: chartData,
  };

  return (
    <ReactFC
      type="pie2d"
      width="100%"
      height="400"
      dataFormat="JSON"
      dataSource={dataSource}
    />
  );
}

export default RoleCountPieChart;