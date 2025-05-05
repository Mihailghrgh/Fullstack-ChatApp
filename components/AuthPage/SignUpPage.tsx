"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatch, setPasswordMatch] = useState(true);
  const router = useRouter();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (confirmPassword) {
      setPasswordMatch(e.target.value === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(password === e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordMatch(false);
      return;
    }

    setIsLoading(true);

    // Simulate registration delay
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to dashboard or verification page after successful registration
      // router.push("/verification")
    }, 1500);
  };

  return (
    <Card >
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="example@email.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            {!passwordMatch && confirmPassword && (
              <p className="text-xs text-red-500">Passwords do not match</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="terms"  required />
            <Label htmlFor="terms" className="text-sm">
              I agree to the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 mt-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !passwordMatch}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Sign up
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
