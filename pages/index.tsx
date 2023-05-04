import { useRouter } from "next/router";
import { auth } from "../lib-server/lucia";

import type {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  InferGetServerSidePropsType,
} from "next";
import type { User } from "lucia-auth";
import Head from "next/head";
import { CompanyIcon } from "@/lib-client/icons";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ user: User }>> => {
  const authRequest = auth.handleRequest(context.req, context.res);
  const { user } = await authRequest.validateUser();
  if (!user)
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  return {
    props: {
      user,
    },
  };
};

const Index = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>

      <h2 className="mb-6 text-3xl font-bold">Home</h2>

      <div className="mb-6 shadow-xl card bg-base-100 lg:card-side">
        <div className="card-body">
          <h2 className="card-title">Job Title</h2>
          <p>Company</p>
          <p>this is the job description, cool, c</p>
          <div className="justify-end card-actions">
            <button className="btn btn-primary">View More</button>
          </div>
        </div>
      </div>

      <div className="mb-6 shadow-xl card bg-base-100 lg:card-side">
        <div className="card-body">
          <h2 className="card-title">Job Title</h2>
          <p>Company</p>
          <p>this is the job description, cool, c</p>
          <div className="justify-end card-actions">
            <button className="btn btn-primary">View More</button>
          </div>
        </div>
      </div>

      <p>
        This page is protected and can only be accessed by authenticated users.
      </p>
      {/* <pre className="code">{JSON.stringify(props.user, null, 2)}</pre> */}
      <div>Jobs Here</div>
      <button
        onClick={async () => {
          try {
            await fetch("/api/sign-out", {
              method: "POST",
            });
            router.push("/sign-in");
          } catch (e) {
            console.log(e);
          }
        }}
      >
        Sign out
      </button>
    </>
  );
};

export default Index;
