import type { Job } from "@prisma/client";
import { formatDate } from "./utils";
type JobWithCompanyName = Job & { company: { name: string } };

export const JobCard = ({ job }: { job: JobWithCompanyName }) => {
  return (
    <div className="mb-6 shadow-xl card bg-base-100 lg:card-side">
      <div className="card-body">
        <h2 className="card-title">
          {job.title} • {job.company.name}
        </h2>

        <p>{job.status}</p>
        <p>{formatDate(job.created_at.toString())}</p>

        <div className="collapse">
          <input type="checkbox" />
          <div className="font-medium collapse-title">Job Description</div>
          <div className="collapse-content">
            <p>{job.description}</p>
          </div>
        </div>

        <div className="justify-end card-actions">
          <button className="btn tn-secondary">
            <a href={job.source}> Source</a>
          </button>
          <button className="btn btn-primary">Update</button>
        </div>
      </div>
    </div>
  );
};
