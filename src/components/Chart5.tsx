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
    name: "Aug",
    TotalVacanciesPosted: 40,
  },
  {
    name: "Sep",
    TotalVacanciesPosted: 30,
  },
  {
    name: "Oct",
    TotalVacanciesPosted: 52,
  },
  {
    name: "Dec",
    TotalVacanciesPosted: 27,
  },
  {
    name: "Jan",
    TotalVacanciesPosted: 34,
  },
  {
    name: "Feb",
    TotalVacanciesPosted: 46,
  },
];

export default function Chart5() {
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
          dataKey="TotalVacanciesPosted"
          fill="#6265b7"
          minPointSize={5}
          barSize={30}
        >
          <LabelList dataKey="TotalVacanciesPosted" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
