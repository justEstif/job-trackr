/// <reference types="lucia-auth" />
declare namespace Lucia {
  type Auth = import("./auth/lucia.ts").Auth;
  type UserAttributes = {
    username: string;
  };
}
