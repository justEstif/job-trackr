import Head from "next/head";
import { z, ZodTypeAny } from "zod";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { auth } from "@/lib-server/lucia";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
} from "next";
import type { User } from "lucia-auth";
import Creatable from "react-select/creatable";

import type { Company } from "@prisma/client";

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
  title: z.string({ required_error: "Title is required" }).nonempty(),
  description: z
    .string({ required_error: "description is required" })
    .nonempty(),
  interest: numericString(
    z.number({ required_error: "interest is required" }).min(0).max(5)
  ),
  source: z.string({ required_error: "source is required" }).nonempty(),
  company: z.string({ required_error: "company is required" }).nonempty(),
  userId: z.string({ required_error: "user_id is required" }).nonempty(),
});

type ValidationSchema = z.infer<typeof validationSchema>;

async function getCompanies(sessionId: string) {
  const url = `${process.env.NEXT_PUBLIC_BASE_API}/company`;
  try {
    const res = await fetch(url, {
      headers: {
        cookie: `auth_session=${sessionId}`,
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.log(error);
  }
}
export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<
  GetServerSidePropsResult<{
    user: User;
    sessionId: string;
    companiesOptions: { label: string; value: string }[];
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

  const { companies }: { companies: Company[] } = await getCompanies(
    session.sessionId
  );

  const companiesOptions = companies.map((company) => {
    return {
      label: company.name,
      value: company.name,
    };
  });

  return {
    props: {
      user,
      sessionId: session.sessionId,
      companiesOptions,
    },
  };
};

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  const { user, sessionId, companiesOptions } = props;
  const {
    register,
    handleSubmit,
    control,
    reset,
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
      await response.json();
      reset();
    } catch (error) {
      // TODO add error messages
    }
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
              {errors.title && (
                <span className="label-text-alt">{errors.title?.message}</span>
              )}
            </label>
            <input
              {...register("title", { required: "Required" })}
              className="w-full max-w-sm input input-bordered"
              placeholder="Job title"
            />
          </div>

          <div className="w-full max-w-sm form-control">
            <label className="label">
              <span className="label-text">Source</span>
              {errors.source && (
                <span className="label-text-alt">{errors.source?.message}</span>
              )}
            </label>
            <input
              {...register("source")}
              className="w-full max-w-sm input input-bordered"
              placeholder="Job source"
            />
          </div>

          <input
            {...register("userId")}
            className="hidden"
            value={user.userId}
          />

          <div className="w-full max-w-sm form-control">
            <label className="label">
              <span className="label-text">Company</span>
              {errors.company && (
                <span className="label-text-alt">
                  {errors.company?.message}
                </span>
              )}
            </label>
            <Controller
              control={control}
              name="company"
              render={({ field: { onChange, value, ref } }) => (
                <Creatable
                  options={companiesOptions}
                  value={companiesOptions.find((c) => c.value === value)}
                  onChange={(val) => onChange(val && val.value && val.value)}
                  isClearable
                />
              )}
            />
          </div>

          <div className="gap-2 w-full max-w-md form-control">
            <label className="label">
              <span className="label-text">Description</span>
              {errors.description && (
                <span className="label-text-alt">
                  {errors.description?.message}
                </span>
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
            </label>
            <input
              {...register("interest")}
              type="range"
              min="1"
              max="5"
              step="1"
              className="range"
            />
            <div className="flex justify-between px-2 w-full text-xs">
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
            </div>
          </div>
          <div className="mt-6 form-control">
            <button type="submit" className="btn btn-primary">
              Create
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
