import React, { useState } from "react";
// import { useNavigate } from 'react-router-dom';

const jobs = [
  {
    id: 1,
    title: "Waiter/Waitress",
    description: "Serve food and beverages to customers.",
  },
  {
    id: 2,
    title: "Chef",
    description: "Prepare and cook meals in a restaurant.",
  },
  {
    id: 3,
    title: "Receptionist",
    description: "Greet and assist visitors at the front desk.",
  },
  { id: 4, title: "Cleaner", description: "Maintain cleanliness of premises." },
  {
    id: 5,
    title: "Security Guard",
    description: "Protect property and people.",
  },
  // Add more jobs as needed
];

const JobList: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState<null | (typeof jobs)[0]>(null);
  // const navigate = useNavigate();

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(search.toLowerCase())
  );

  if (selectedJob) {
    return (
      <div style={{ padding: 24 }}>
        <button onClick={() => setSelectedJob(null)}>
          &larr; Back to jobs
        </button>
        <h2>{selectedJob.title}</h2>
        <p>{selectedJob.description}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <input
        type="text"
        placeholder="Search jobs..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 16, padding: 8, width: 300 }}
      />
      <ul>
        {filteredJobs.map((job) => (
          <li key={job.id} style={{ margin: "12px 0", cursor: "pointer" }}>
            <span onClick={() => setSelectedJob(job)}>{job.title}</span>
          </li>
        ))}
        {filteredJobs.length === 0 && <li>No jobs found.</li>}
      </ul>
    </div>
  );
};

export default JobList;
