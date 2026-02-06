"use client";

import Image from "next/image";
import Link from "next/link";
import Input from "@/components/Input/Input";
import Checkbox from "@/components/Checkbox/Checkbox";
import Button from "@/components/Button/Button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/Card/Card";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* Turquoise Spine */}
      <div 
        className="w-[15px] shrink-0 bg-[#F3F4F6] bg-repeat-y dark:bg-gray-900"
        style={{ 
          backgroundImage: "url('/TallySpineShort_turq.svg')",
          backgroundSize: "15px 30px"
        }}
      ></div>

      {/* Left Side - Login Form */}
      <div className="flex w-full flex-col items-center justify-center bg-[#F3F4F6] px-8 dark:bg-gray-900 lg:w-1/2 lg:px-16 xl:px-24">
        <Card className="w-full max-w-md border-0 shadow-none">
          <CardHeader>
            <CardTitle>Login to Tally+ MM</CardTitle>
            <CardDescription>
              Need a Tally+ MM account?{" "}
              <Link
                href="#"
                className="text-[#2C365D] underline hover:text-[#1e2840] dark:text-[#7c8cb8] dark:hover:text-[#a0b0d0]"
              >
                Contact admin
              </Link>
              .
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="space-y-6">
              <Input
                label="Username or email*"
                type="text"
                placeholder="Enter your username"
              />

              <Input
                label="Password*"
                type="password"
                placeholder="Enter your password"
                defaultValue="password123"
              />

              <Checkbox label="Keep me logged in" />

              <Button type="submit" className="w-40">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Branded Hero */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
        {/* Background Image */}
        <Image
          src="/login-cityscape.png"
          alt="City skyline at dusk"
          fill
          className="object-cover"
          priority
          quality={100}
          unoptimized
        />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-[#0a1628]/70"></div>
        
        {/* Gradient overlays for branding */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1628]/50 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#00D2A2]/20 via-transparent to-transparent"></div>

        {/* Stars effect at top */}
        <div className="absolute inset-x-0 top-0 h-1/3 opacity-60">
          <div className="absolute left-[10%] top-[15%] h-1 w-1 rounded-full bg-white"></div>
          <div className="absolute left-[25%] top-[25%] h-0.5 w-0.5 rounded-full bg-white"></div>
          <div className="absolute left-[40%] top-[10%] h-1 w-1 rounded-full bg-white"></div>
          <div className="absolute left-[55%] top-[30%] h-0.5 w-0.5 rounded-full bg-white"></div>
          <div className="absolute left-[70%] top-[18%] h-1 w-1 rounded-full bg-white"></div>
          <div className="absolute left-[85%] top-[12%] h-0.5 w-0.5 rounded-full bg-white"></div>
          <div className="absolute left-[15%] top-[35%] h-0.5 w-0.5 rounded-full bg-white"></div>
          <div className="absolute left-[30%] top-[45%] h-1 w-1 rounded-full bg-white"></div>
          <div className="absolute left-[60%] top-[40%] h-0.5 w-0.5 rounded-full bg-white"></div>
          <div className="absolute left-[80%] top-[32%] h-1 w-1 rounded-full bg-white"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/TallyPlus_Reversed.svg"
              alt="Tally+"
              width={140}
              height={50}
            />
          </div>

          {/* Heading */}
          <h2 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white xl:text-6xl">
            Utilities
            <br />
            made easy
          </h2>

          {/* Description */}
          <p className="max-w-md text-base leading-relaxed text-white/80">
            Optimise efficiency and elevate customer engagement with{" "}
            <span className="font-semibold text-white">Tally+ Mass Market</span>
            . Leverage intelligent CRM workflows designed to keep your business
            ahead in the dynamic utilities industry.
          </p>
        </div>
      </div>
    </div>
  );
}
