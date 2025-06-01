"use client";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
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
import { Label } from "@/components/ui/label";
import Divider from "./Divider";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { MessageCircleHeart } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="grid w-full grow items-center px-4 sm:justify-center">
      <SignIn.Root path="/sign-in">
        <Clerk.Loading>
          {(isGlobalLoading) => (
            <>
              <SignIn.Step name="start">
                <Card className="w-full sm:w-96">
                  <CardHeader>
                    <CardTitle className="flex justify-center items-center space-x-2 gap-1 text-2xl font-bold text-center">
                      Sign in To Chat-Io
                      <MessageCircleHeart className="text-primary" />
                    </CardTitle>
                    <CardDescription className="text-center">
                      Enter your email and password to access your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-y-4">
                    <div className="grid grid-cols-2 gap-x-4">
                      <Clerk.Connection name="apple" asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          type="button"
                          disabled={isGlobalLoading}
                        >
                          <Clerk.Icon />
                          Apple
                        </Button>
                      </Clerk.Connection>
                      <Clerk.Connection name="google" asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          type="button"
                          disabled={isGlobalLoading}
                        >
                          <Clerk.Icon />
                          Google
                        </Button>
                      </Clerk.Connection>
                    </div>
                    <Divider />
                    <Clerk.Field name="identifier" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label>Email address</Label>
                      </Clerk.Label>
                      <Clerk.Input type="email" required asChild>
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-destructive" />
                    </Clerk.Field>

                    <Clerk.Field name="password" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label>Password</Label>
                      </Clerk.Label>
                      <Clerk.Input type="password" required asChild>
                        <Input />
                      </Clerk.Input>
                      <Clerk.FieldError className="block text-sm text-destructive" />
                    </Clerk.Field>
                  </CardContent>
                  <CardFooter>
                    <div className="grid w-full gap-y-4">
                      <SignIn.Action submit asChild>
                        <Button disabled={isGlobalLoading}>
                          Sign In
                          <ArrowRight />
                        </Button>
                      </SignIn.Action>
                      <div className="text-center text-sm">
                        Don`t have an account?{" "}
                        <Link
                          href="/sign-up"
                          className="text-primary hover:underline"
                        >
                          Sign Up
                        </Link>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              </SignIn.Step>
            </>
          )}
        </Clerk.Loading>
      </SignIn.Root>
    </div>
  );
}
