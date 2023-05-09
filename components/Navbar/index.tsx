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
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost">
            <MenuIcon />
          </label>
          <ul
            tabIndex={0}
            className="p-2 mt-3 w-52 shadow menu menu-compact dropdown-content bg-base-100 rounded-box"
          >
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </div>
        <a className="text-xl normal-case btn btn-ghost">JobTrackr</a>
      </div>

      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <button className="btn btn-square btn-ghost">
            <ThreeDots />
          </button>

          <ul
            tabIndex={0}
            className="p-2 mt-3 w-52 shadow menu menu-compact dropdown-content bg-base-100 rounded-box"
          >
            <li>
              <a className="justify-between">
                Notifications
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Username</a>
            </li>
            <li>
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
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
