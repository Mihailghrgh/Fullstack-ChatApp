"use client"

import { Button } from "../ui/button";

function HeroSection() {
  return (
    <div>
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Connect, Chat, and Collaborate with{" "}
                <span className="text-primary">Chat Io</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Experience seamless communication with our modern chat platform.
                Built for teams, friends, and communities who value real-time
                connection.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button size="lg" className="text-lg px-8 py-3">
                  Start Chatting Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-3"
                >
                  Watch Demo
                </Button>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-xl border">
              {/* Option 1: Video - Uncomment this and comment out the GIF option below to use video */}
              <video className="w-full h-auto" autoPlay muted loop playsInline>
                <source src="herovideo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Option 2: GIF - Comment this out if using the video option above */}
              {/* <img 
            src="/chat-animation.gif" 
            alt="Chat Io in action" 
            className="w-full h-auto"
          /> */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default HeroSection