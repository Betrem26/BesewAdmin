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
    JobPosts: 35,
    CandidatesThatApplied: 30,
  },
  {
    name: "Waiter/ess",
    JobPosts: 35,
    CandidatesThatApplied: 52,
  },
  {
    name: "Driver",
    JobPosts: 48,
    CandidatesThatApplied: 27,
  },
];

export default function Chart4() {
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
          dataKey="CandidatesThatApplied"
          fill="#6265b7"
          minPointSize={5}
          barSize={30}
        >
          <LabelList dataKey="CandidatesThatApplied" position="top" />
        </Bar>
        <Bar dataKey="JobPosts" fill="#022657" minPointSize={10} barSize={30}>
          <LabelList dataKey="CandidatesThatApplied" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
