/// <reference types="lucia-auth" />
declare namespace Lucia {
  type Auth = import("./src/lib-server/lucia.ts").Auth;
  type UserAttributes = {
    username: string;
  };
}
