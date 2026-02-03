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
    BachelorsDegree: 30,
  },
  {
    name: "Waiter/ess",
    BachelorsDegree: 52,
  },
  {
    name: "Driver",
    BachelorsDegree: 27,
  },
  {
    name: "Painter",
    BachelorsDegree: 27,
  },
];

export default function Chart3() {
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
          dataKey="BachelorsDegree"
          fill="#3d5a80"
          minPointSize={5}
          barSize={50}
        >
          <LabelList dataKey="BachelorsDegree" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
