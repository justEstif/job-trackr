import { MenuIcon, ThreeDots } from "@/lib-client/icons";
import Link from "next/link";
import { useRouter } from "next/router";

export function Navbar() {
  const router = useRouter();

  if (router.pathname === "/sign-in") {
    return (
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <a className="text-xl normal-case btn btn-ghost">JobTrackr</a>
        </div>
        <div className="navbar-end">
          <Link href="/sign-up" className="btn btn-outline">
            Sign up
          </Link>
        </div>
      </div>
    );
  } else if (router.pathname === "/sign-up") {
    return (
      <div className="navbar bg-base-100">
        <div className="navbar-start">
          <a className="text-xl normal-case btn btn-ghost">JobTrackr</a>
        </div>
        <div className="navbar-end">
          <Link href="/sign-in" className="btn btn-outline">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <Link href="/" className="text-xl normal-case btn btn-ghost">
          JobTrackr
        </Link>
      </div>

      <div className="navbar-end">
        <Link href="/new" className="text-lg normal-case btn btn-ghost">
          New
        </Link>

        <button
          className="text-lg normal-case btn btn-ghost"
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
      </div>
    </div>
  );
}
