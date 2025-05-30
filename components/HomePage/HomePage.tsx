"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageCircle, Users, Shield, Star, Menu } from "lucide-react";
import Link from "next/link";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import ServiceSection from "./ServiceSection";
import ReviewSection from "./ReviewSection";
import Footer from "./Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background scroll-smooth">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}

      <HeroSection />
      {/* Services Section */}

      <ServiceSection />
      {/* Reviews Section */}
      
      <ReviewSection/>
      {/* Footer */}
      <Footer/>
    </div>
  );
}
