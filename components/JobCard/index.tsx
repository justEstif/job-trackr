import type { Job } from "@prisma/client";
import Link from "next/link";
import { formatDate } from "./utils";

type JobWithCompanyName = Job & { company: { name: string } };

export const JobCard = ({ job }: { job: JobWithCompanyName }) => {
  return (
    <div className="mb-6 shadow-xl card bg-base-100 lg:card-side">
      <div className="card-body">
        <h2 className="card-title">
          {job.title} • {job.company.name}
        </h2>

        <p>
          {job.status} • {formatDate(job.created_at.toString())}
        </p>
        <p>
          <Link href={job.source} className="link">
            Source
          </Link>
        </p>

        <div className="collapse collapse-arrow">
          <input type="checkbox" />
          <div className="font-medium collapse-title">Job Description</div>
          <div className="collapse-content">
            <p dangerouslySetInnerHTML={{ __html: job.description }}></p>
          </div>
        </div>

        <div className="justify-end card-actions">
          <Link href={`/update/${job.id}`} className="btn btn-primary">
            Update
          </Link>
        </div>
      </div>
    </div>
  );
};
