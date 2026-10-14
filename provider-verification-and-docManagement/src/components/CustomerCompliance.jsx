import ReactFusionCharts from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";

import { Alert, Box, Paper, Typography } from "@mui/material";

const ReactFC = ReactFusionCharts.default || ReactFusionCharts;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

function CustomerCompliance({ assignments }) {
  if (assignments.length === 0) {
    return (
      <Alert severity="info">
        No assessment assignments are available to show compliance.
      </Alert>
    );
  }

  const chartRows = assignments.map((assignment) => {
    const target = Number(assignment.frequency) || 0;
    const completed = Math.min(
      target,
      Math.max(0, Number(assignment.completedCount) || 0)
    );
    const remaining =
      assignment.remainingCount === null ||
      assignment.remainingCount === undefined
        ? Math.max(0, target - completed)
        : Math.max(0, Number(assignment.remainingCount) || 0);
    const percent = target > 0 ? Math.round((completed / target) * 100) : 0;

    return {
      name: assignment.assessmentName || String(assignment.assessmentId),
      frequency: target,
      unit: assignment.frequencyUnit || "",
      completed,
      remaining,
      percent,
    };
  });

  return (
    <Box sx={{ display: "grid", gap: 2 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(1, minmax(0, 1fr))",
            lg: "repeat(1, minmax(0, 1fr))",
          },
          gap: 1.5,
        }}
      >
        {chartRows.map((row, index) => (
          <Paper
            key={`${assignments[index].id ?? row.name}`}
            elevation={0}
            sx={{
              p: 2,
              border: "1px solid #e2e8f0",
              borderRadius: 2,
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 1,
                mb: 1.5,
              }}
            >
              <Typography
                variant="subtitle1"
                fontWeight={700}
                sx={{ overflowWrap: "anywhere" }}
              >
                {row.name}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ whiteSpace: "nowrap" }}
              >
                {row.frequency} / {row.unit}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 2,
                mb: 1.5,
              }}
            >
              <ComplianceMetric label="Target" value={row.frequency} />
              <ComplianceMetric label="Completed" value={row.completed} />
              <ComplianceMetric label="Remaining" value={row.remaining} />
            </Box>

            <ReactFC
              type="stackedbar2d"
              width="100%"
              height="20"
              dataFormat="JSON"
              dataSource={{
                chart: {
                  showValues: "0",
                  showLegend: "0",
                  showLabels: "0",
                  showYAxisValues: "0",
                  showXAxisLine: "0",
                  showYAxisLine: "0",
                  showDivLineValues: "0",
                  numDivLines: "0",
                  showLimits: "0",
                  yAxisMaxValue: String(row.frequency ),
                  showToolTip: "1",
                  // plotToolText: "$seriesName: $dataValue",
                  plotSpacePercent: "45",
                  usePlotGradientColor: "0",
                  showBorder: "0",
                  bgColor: "#ffffff",
                  canvasBgColor: "#ffffff",
                  chartTopMargin: "8",
                  chartBottomMargin: "8",
                  chartLeftMargin: "4",
                  chartRightMargin: "4",
                  theme: "fusion",
                },
                categories: [
                  {
                    category: [{ label: row.name }],
                  },
                ],
                dataset: [
                  {
                    seriesname: "Completed",
                    color: "#16a34a",
                    data: [{ value: row.completed }],
                  },
                  {
                    seriesname: "Remaining",
                    color: "#cbd5e1",
                    data: [{ value: row.remaining }],
                  },
                ],
              }}
            />
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 0.75, textAlign: "right" }}
            >
              {row.percent}%
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}

function ComplianceMetric({ label, value }) {
  return (
    <Box sx={{ minWidth: 0 , }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value}
      </Typography>
    </Box>
  );
}

export default CustomerCompliance;
