import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import AuthForm from "@/components/AuthForm";
import Head from "next/head";
import { getAuth } from "@/lib-client/utils";

export default function SignInPage() {
  return (
    <section>
      <Head>
        <title>Sign In</title>
      </Head>
      <div className="flex flex-col justify-center items-center">
        <h2 className="mb-6 text-3xl font-bold">Sign in</h2>
        <AuthForm intent={"sign-in"} />
      </div>
    </section>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{}>> => {
  const auth = await getAuth(context);
  if (auth) {
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
