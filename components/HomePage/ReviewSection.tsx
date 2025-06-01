"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Star } from "lucide-react";

function ReviewSection() {
  return (
    <>
      <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied users who have transformed their
              communication with Chat Io.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                  
                </div>
                <CardTitle className="text-lg">Sarah Johnson</CardTitle>
                <CardDescription>Product Manager at TechCorp</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Chat Io has revolutionized how our team communicates. The
                  interface is intuitive, and the real-time features keep
                  everyone connected and productive.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <CardTitle className="text-lg">Mike Chen</CardTitle>
                <CardDescription>Freelance Designer</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  As someone who works with multiple clients, Chat Io`s
                  organization features help me keep all my conversations
                  structured and easily accessible.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <CardTitle className="text-lg">Emily Rodriguez</CardTitle>
                <CardDescription>Community Manager</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  The security features give me peace of mind when managing
                  sensitive community discussions. Chat Io strikes the perfect
                  balance between functionality and privacy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
export default ReviewSection;
