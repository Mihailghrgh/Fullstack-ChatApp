"use client";

import type React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { MessageCircleHeart } from "lucide-react";
import Divider from "./Divider";

export default function SignInForm() {
  return (
    <SignIn.Root>
      <SignIn.Step name="start">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="flex justify-center items-center space-x-2 gap-1 text-2xl font-bold text-center">
              Sign in To Chat-Io
              <MessageCircleHeart className="text-primary" />
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email and password to access your account
            </CardDescription>
            {/* LOGIN WITH GOOGLE OR APPLE */}
            <Divider />
            <Clerk.GlobalError className="block text-sm text-red-400" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Clerk.Connection asChild name="google">
                <Button
                  variant="outline"
                  type="button"
                  className="hover:cursor-pointer"
                >
                  <Clerk.Icon />
                  Google
                </Button>
              </Clerk.Connection>
              <Clerk.Connection asChild name="apple">
                <Button
                  variant="outline"
                  type="button"
                  className="hover:cursor-pointer"
                >
                  <Clerk.Icon />
                  Apple
                </Button>
              </Clerk.Connection>
            </div>
          </CardHeader>
          {/* LOGIN INPUTS */}
          <Clerk.GlobalError className="block text-sm text-red-400" />
          <CardContent>
            <div className="space-y-4">
              {/*EMAIL INPUT */}
              <Clerk.Field name="identifier" className="space-y-2">
                <Clerk.Label className="text-sm font-medium text-zinc-950">
                  Email
                </Clerk.Label>
                <Clerk.Input type="text" required asChild />
                <Input type="email" placeholder="jane.doe@email.com" required />
                <Clerk.FieldError className="block text-sm text-red-400" />
              </Clerk.Field>

              {/*PASSWORD INPUT */}
              <Clerk.Field name="password" className="space-y-2">
                <Clerk.Label className="text-sm  font-medium text-zinc-950">
                  Password
                </Clerk.Label>
                <Clerk.Input type="password" required asChild />
                <Input type="password" required />
                <Clerk.FieldError className="block text-sm text-red-400" />
              </Clerk.Field>
            </div>
            {/* SIGN IN BUTTON */}
            <SignIn.Action submit asChild>
              <Button
                type="submit"
                className="w-full mt-4 hover:cursor-pointer focus:bg-sidebar-ring"
              >
                Sign in
                <ArrowRight />
              </Button>
            </SignIn.Action>
          </CardContent>
          {/* FOOTER LINKS */}
          <CardFooter className="flex flex-col">
            <div className="text-center text-sm">
              Don`t have an account yet?{" "}
              <Link href="/sign-up" className="text-primary hover:underline">
                Create Account
              </Link>
            </div>
          </CardFooter>
        </Card>
      </SignIn.Step>
    </SignIn.Root>
  );
}
