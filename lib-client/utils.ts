import { auth } from "@/lib-server/lucia";
import type { Session } from "lucia-auth";
import type { GetServerSidePropsContext } from "next";

/**
 * Function for getting the api response from endpoint
 * @param {string} endpoint - valid api endpoint
 * @param {string} sessionId - user session id
 */
export const getApiData = async (endpoint: string, sessionId: string) => {
  const url = `${process.env.NEXT_PUBLIC_BASE_API}/${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        cookie: `auth_session=${sessionId}`,
      },
    });
    return await res.json();
  } catch (error) {
    console.log(error);
  }
};

/**
 * Function to get the user and session
 */
export const getAuth = async (
  context: GetServerSidePropsContext
): Promise<{
  user: { username: string; userId: string };
  session: Session;
} | null> => {
  const authRequest = auth.handleRequest(context.req, context.res);
  const { user, session } = await authRequest.validateUser();

  if (user && session) {
    return { user, session };
  } else {
    return null;
  }
};
