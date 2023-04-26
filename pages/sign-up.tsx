import Link from "next/link";
import { auth } from "../lib-server/lucia";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import AuthForm from "../components/AuthForm";

const Index = () => {
  return (
    <>
      <h2>Sign up</h2>
      <AuthForm intent={"sign-up"} />
      <Link href="/sign-in" className="link">
        Sign in?
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
