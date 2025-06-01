'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription,  } from "../ui/card";
import { Shield, MessageCircle , Users} from "lucide-react";

function ServiceSection() {
  return (
    <>
      {" "}
      <section
        id="services"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50 scroll-smooth md:scroll-auto"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Chat Io?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the features that make Chat Io the perfect choice for
              your communication needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-shadow duration-200">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Real-time Messaging</CardTitle>
                <CardDescription>
                  Instant message delivery with typing indicators and read
                  receipts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Experience lightning-fast communication with our optimized
                  messaging system. Never miss a beat with real-time
                  notifications and seamless synchronization across all devices.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow duration-200">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Team Collaboration</CardTitle>
                <CardDescription>
                  Create channels, share files, and work together efficiently
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Build stronger teams with organized channels, file sharing,
                  and collaborative tools. Keep everyone on the same page with
                  threaded conversations and project management features.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-shadow duration-200">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  End-to-end encryption and advanced security features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your conversations are protected with military-grade
                  encryption. We prioritize your privacy with secure servers and
                  transparent data practices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
export default ServiceSection