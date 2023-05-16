import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const validationSchema = z.object({
  username: z.string({ required_error: "Username is required" }).nonempty(),
  password: z.string({ required_error: "Password is required" }).nonempty(),
});

type ValidationSchema = z.infer<typeof validationSchema>;
type Intent = "sign-in" | "sign-up";

export default function AuthForm({ intent }: { intent: Intent }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ValidationSchema>({ resolver: zodResolver(validationSchema) });
  const onSubmit: SubmitHandler<ValidationSchema> = async (data) => {
    try {
      const response = await fetch(`/api/${intent}`, {
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
    } catch (error) {
      // TODO add error messages
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6 mb-6 w-full max-w-xs"
      >
        <div className="w-full max-w-xs form-control">
          <label className="label">
            <span className="label-text">Username</span>
            {errors.username && (
              <span className="label-text-alt">{errors.username?.message}</span>
            )}
          </label>
          <input
            className="w-full max-w-xs input input-bordered"
            placeholder="Username"
            {...register("username")}
          />
        </div>
        <div className="w-full max-w-xs form-control">
          <label className="label">
            <span className="label-text">Password</span>
            {errors.password && (
              <span className="label-text-alt">{errors.password?.message}</span>
            )}
          </label>
          <input
            className="w-full max-w-xs input input-bordered input-md"
            placeholder="password"
            {...register("password")}
          />
        </div>
        <div className="mt-6 form-control">
          <button type="submit" className="btn btn-primary">
            {intent === "sign-in" ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </form>
    </>
  );
}
