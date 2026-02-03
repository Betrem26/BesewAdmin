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
    name: "AddisAgency",
    TotalVacanciesPosted: 40,
  },
  {
    name: "Ethio",
    TotalVacanciesPosted: 30,
  },
  {
    name: "Addis",
    TotalVacanciesPosted: 52,
  },
  {
    name: "ABC",
    TotalVacanciesPosted: 27,
  },
];

export default function Chart6() {
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
          fill="#ffcf81"
          minPointSize={5}
          barSize={50}
        >
          <LabelList dataKey="TotalVacanciesPosted" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
