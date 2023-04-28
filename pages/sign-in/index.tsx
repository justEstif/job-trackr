import Link from "next/link";
import { auth } from "../../lib-server/lucia";
import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import AuthForm from "../../components/AuthForm";

const Index = () => {
  return (
    <>
      <h2>Sign in</h2>
      <AuthForm intent={"sign-in"} />
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
