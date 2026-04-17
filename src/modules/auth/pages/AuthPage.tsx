import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { twMerge } from "tailwind-merge";

import { useLoginMutation, useRegisterMutation } from "../queries";
import { loginSchema, registerSchema, type AuthFormData } from "../schema";

import Input from "@/components/shared/Input";
import Button from "@/components/shared/Button";

import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";
import { BsShieldFillCheck } from "react-icons/bs";
import XSvg from "@/assets/X";
import { SEO } from "@/components/common/SEO";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const loginMutation = useLoginMutation();
  const registerMutation = useRegisterMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(
      isLogin ? loginSchema : registerSchema,
    ) as Resolver<AuthFormData>,
    defaultValues: { username: "", password: "", confirmPassword: "" },
  });

  const handleToggle = () => {
    setIsLogin((prev) => !prev);
    reset({ username: "", password: "", confirmPassword: "" });
  };

  const onSubmit = (data: AuthFormData) => {
    if (isLogin) {
      loginMutation.mutate({ username: data.username, password: data.password });
    } else {
      registerMutation.mutate(data);
    }
  };

  return (
    <>
      <SEO title="Auth / Mesom" />
      <div className="mx-auto flex h-screen max-w-screen-xl flex-col items-center text-main-primary md:flex-row">
        <div className="flex w-24 flex-grow-[0.5] items-center justify-center md:max-w-[50%] md:flex-1 lg:h-full">
          <XSvg className="w-2/3 fill-main-primary" />
        </div>
        <div className="flex items-center p-4 md:h-screen md:max-w-[50%] md:flex-grow xl:max-h-[1000px]">
          <div className="authContent flex flex-1 flex-col items-start justify-between gap-8 p-4 lg:min-h-[60%]">
            <h1 className="my-4 hidden text-5xl font-black sm:block lg:block lg:text-6xl">
              Happening now
            </h1>
            <form
              className="flex w-full flex-1 shrink-0 flex-col items-start gap-4 lg:w-3/4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <h3 className="text-4xl font-extrabold">
                {isLogin ? "Let's go" : "Join now"}
              </h3>
              <p>
                Test account: <br />
                <strong>Username:</strong> test <br />
                <strong>Password:</strong> test@123
              </p>
              {loginMutation.isError && (
                <p className="text-red-500">{loginMutation.error.message}</p>
              )}
              {registerMutation.isError && (
                <p className="text-red-500">{registerMutation.error.message}</p>
              )}

              <div className="flex w-full flex-col gap-1">
                <label className="input input-bordered flex w-full items-center gap-2 rounded">
                  <FaUser className="size-6 text-main-primary" />
                  <Input
                    type="text"
                    placeholder="Username"
                    wrapperClassname="flex-1"
                    {...register("username")}
                  />
                </label>
                {errors.username && (
                  <p className="text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="flex w-full flex-col gap-1">
                <label className="input input-bordered flex w-full items-center gap-2 rounded">
                  <FaLock className="size-6 text-main-primary" />
                  <Input
                    type="password"
                    placeholder="Password"
                    wrapperClassname="flex-1"
                    isPassword
                    {...register("password")}
                  />
                </label>
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {!isLogin && (
                <div className="flex w-full flex-col gap-1">
                  <label className="input input-bordered flex w-full items-center gap-2 rounded">
                    <BsShieldFillCheck className="size-6 text-main-primary" />
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      wrapperClassname="flex-1"
                      isPassword
                      {...register("confirmPassword")}
                    />
                  </label>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              )}

              <Button
                label={
                  loginMutation.isPending || registerMutation.isPending
                    ? "Loading..."
                    : isLogin
                      ? "Login"
                      : "Sign Up"
                }
                className={twMerge(
                  "btn btn-primary btn-outline w-full rounded-full",
                  (loginMutation.isPending || registerMutation.isPending) &&
                    "cursor-not-allowed opacity-50",
                )}
                disabled={loginMutation.isPending || registerMutation.isPending}
              />
            </form>
            <div className="mt-4 text-center">
              <span>
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
                <button
                  type="button"
                  onClick={handleToggle}
                  className="ml-2 text-blue-500"
                >
                  {isLogin ? "Sign Up" : "Login"}
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default LoginPage;
