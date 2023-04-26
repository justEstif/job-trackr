import Link from "next/link";
import { auth } from "../lib-server/lucia";
import { useRouter } from "next/router";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const validationSchema = z.object({
  username: z.string({ required_error: "Username is required" }).nonempty(),
  password: z.string({ required_error: "Password is required" }).nonempty(),
});

type ValidationSchema = z.infer<typeof validationSchema>;

const Index = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ValidationSchema>({ resolver: zodResolver(validationSchema) });

  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    try {
      const response = await fetch("/api/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.redirected) return router.push(response.url);
      const result = (await response.json()) as {
        error: string;
      };
      setError("password", { message: result.error });
    } catch (error) {}
  };

  return (
    <>
      <h2>Sign in</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input placeholder="username" {...register("username")} />
        {errors.username && <p>{errors.username?.message}</p>}
        <input placeholder="password" {...register("password")} />
        {errors.password && <p>{errors.password.message}</p>}
        <button type="submit">Sign In</button>
      </form>
      <Link href="/sign-up" className="link">
        Create a new account
      </Link>
    </>
  );
};

export default Index;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{}>> => {
  const authRequest = auth.handleRequest(context.req, context.res);
  const session = await authRequest.validate();
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
