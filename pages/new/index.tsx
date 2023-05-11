import Head from "next/head";
import { z, ZodTypeAny } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { auth } from "@/lib-server/lucia";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
} from "next";
import type { User, Session } from "lucia-auth";
import { ChangeEvent, useEffect, useState } from "react";

export const numericString = (schema: ZodTypeAny) =>
  z.preprocess((a) => {
    if (typeof a === "string") {
      return parseInt(a, 10);
    } else if (typeof a === "number") {
      return a;
    } else {
      return undefined;
    }
  }, schema);

const validationSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  description: z.string({ required_error: "description is required" }),
  interest: numericString(z.number({ required_error: "interest is required" }).min(0).max(5)),
  source: z.string({ required_error: "source is required" }),
  company: z.string({ required_error: "company is required" }),
  userId: z.string({ required_error: "user_id is required" }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<
  GetServerSidePropsResult<{
    user: User;
    sessionId: string;
  }>
> => {
  const authRequest = auth.handleRequest(context.req, context.res);
  const { user, session } = await authRequest.validateUser();

  if (!user || !session) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
      sessionId: session.sessionId,
    },
  };
};

export default function Page(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const res = await fetch("/api/company");
      const data = await res.json();
      setCompanies(data.companies);
    };
    fetchCompanies();
  }, []);

  const { user, sessionId } = props;
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ValidationSchema>({ resolver: zodResolver(validationSchema) });

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: `auth_session=${sessionId}`,
        },
        body: JSON.stringify(data),
      });
      const body = await response.json();
      console.log(body);
      const result = (await response.json()) as {
        error: string;
      };
      setError("title", { message: result.error });
    } catch (error) {
      // TODO add error messages
    }
  };

  const onCompanyChange = async (data: ChangeEvent<HTMLInputElement>) => {
    const value = data.target.value;
    if (value.length < 2) return;

    console.log(data.target.value);
  };

  return (
    <>
      <Head>
        <title>New</title>
      </Head>

      <div className="flex flex-col justify-center items-center">
        <h2 className="mb-6 text-3xl font-bold">New</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 mb-6 w-full max-w-md"
        >
          <div className="w-full max-w-sm form-control">
            <label className="label">
              <span className="label-text">Title</span>
              {errors.title && <span className="label-text-alt">{errors.title?.message}</span>}
            </label>
            <input
              {...register("title")}
              className="w-full max-w-sm input input-bordered"
              placeholder="Job title"
            />
          </div>

          <div className="w-full max-w-sm form-control">
            <label className="label">
              <span className="label-text">Source</span>
              {errors.source && <span className="label-text-alt">{errors.source?.message}</span>}
            </label>
            <input
              {...register("source")}
              className="w-full max-w-sm input input-bordered"
              placeholder="Job source"
            />
          </div>

          <input {...register("userId")} className="hidden" value={user.userId} />

          <div className="w-full max-w-sm form-control">
            <label className="label">
              <span className="label-text">Company</span>
              {errors.company && <span className="label-text-alt">{errors.company?.message}</span>}
            </label>
            <input
              {...register("company")}
              onChange={onCompanyChange}
              className="w-full max-w-sm input input-bordered"
              placeholder="Job company"
              list="companies"
            />
          </div>

          <div className="gap-2 w-full max-w-md form-control">
            <label className="Job Description">
              <span className="label-text">Description</span>
              {errors.description && (
                <span className="label-text-alt">{errors.source?.message}</span>
              )}
            </label>

            <textarea
              placeholder="Job Description"
              {...register("description")}
              className="w-full max-w-md box-border textarea textarea-bordered textarea-md"
            />
          </div>
          <div className="w-full max-w-md form-control">
            <label className="label">
              <span className="label-text">Interest</span>
              {errors.description && (
                <span className="label-text-alt">{errors.source?.message}</span>
              )}
            </label>

            <div className="rating">
              <input
                type="radio"
                {...register("interest")}
                value={1}
                name="rating-2"
                className="bg-orange-400 mask mask-star-2"
              />
              <input
                type="radio"
                {...register("interest")}
                value={2}
                name="rating-2"
                className="bg-orange-400 mask mask-star-2"
                checked
              />
              <input
                type="radio"
                {...register("interest")}
                value={3}
                name="rating-2"
                className="bg-orange-400 mask mask-star-2"
              />
              <input
                type="radio"
                {...register("interest")}
                value={4}
                name="rating-2"
                className="bg-orange-400 mask mask-star-2"
              />
              <input
                type="radio"
                {...register("interest")}
                value={5}
                name="rating-2"
                className="bg-orange-400 mask mask-star-2"
              />
            </div>
          </div>

          <div className="mt-6 form-control">
            <button type="submit" className="btn btn-primary">
              Create
            </button>
          </div>
        </form>
        <input
          type="text"
          id="company"
          {...register("company", { required: true })}
          list="company-list"
        />
        <datalist id="company-list">
          {companies.map((company, key) => (
            <option key={key} value={company.name} />
          ))}
        </datalist>
      </div>
    </>
  );
}
