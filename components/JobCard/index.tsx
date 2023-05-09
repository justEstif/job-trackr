type Job = {
  title: string;
  description: string;
};
export const JobCard = (job: Job) => {
  return (
    <div className="mb-6 shadow-xl card bg-base-100 lg:card-side">
      <div className="card-body">
        <h2 className="card-title">{job.title}</h2>
        <p>{job.description}</p>
        <div className="justify-end card-actions">
          <button className="btn btn-primary">View More</button>
        </div>
      </div>
    </div>
  );
};
