import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Accountant",
    TotalCandidates: 35,
    MatchedCandidates: 30,
  },
  {
    name: "Waiter/ess",
    TotalCandidates: 35,
    MatchedCandidates: 52,
  },
  {
    name: "Driver",
    TotalCandidates: 48,
    MatchedCandidates: 27,
  },
];

export default function Chart1() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="MatchedCandidates"
          fill="#ffcf81"
          minPointSize={5}
          barSize={30}
        >
          <LabelList dataKey="MatchedCandidates" position="top" />
        </Bar>
        <Bar
          dataKey="TotalCandidates"
          fill="#ffb996"
          minPointSize={10}
          barSize={30}
        >
          <LabelList dataKey="MatchedCandidates" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
