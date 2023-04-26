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
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="username" {...register("username")} />
      {errors.username && <p>{errors.username?.message}</p>}
      <input placeholder="password" {...register("password")} />
      {errors.password && <p>{errors.password.message}</p>}
      <button type="submit">
        {intent === "sign-in" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
}
