import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "@prisma/client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useClerk } from "@clerk/nextjs";

function MobileSideBar() {
  const { setTheme, theme } = useTheme();
  const { signOut } = useClerk();
  const fetchAllUsers = async () => {
    try {
      const { data } = await axios.get("/api/getAllUsers");

      return data;
    } catch (error) {
      console.log(error);
    }
  };
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchAllUsers,
  });

  if (isLoading) {
    return <div>Loading....</div>;
  }

  if (isError) {
    console.log(error);
    return <div>Error....</div>;
  }
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>

          <div className="flex justify-between">
            <Button
              variant="secondary"
              className="hover:cursor-pointer"
              onClick={() => {
                signOut({ redirectUrl: "/sign-in" });
              }}
            >
              Sign Out
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                theme === "dark"
                  ? setTheme(() => "light")
                  : setTheme(() => "dark")
              }
            >
              {" "}
              Toggle Theme{" "}
            </Button>
            <h2 className="mb-4 text-xl font-bold">Messages</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search contacts..."
                className="pl-8"
              />
            </div>
          </div>

          {/* Contacts list */}
          <div className="flex-1 overflow-y-auto">
            {data.map((contact: Users) => (
              <div
                key={contact.id}
                className="flex items-center gap-3 border-b p-4 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-900"
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage
                      src={contact.image || "/placeholder.svg"}
                      alt={contact.email}
                    />
                    <AvatarFallback>
                      {contact.email
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {/* {contact.status === "online" && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-gray-950"></span>
                    )} */}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{contact.email}</p>
                    <p className="text-xs text-gray-500">12:34 PM</p>
                  </div>
                  {/* <p className="truncate text-sm text-gray-500">
                      {contact.lastMessage}
                    </p> */}
                </div>
              </div>
            ))}
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
export default MobileSideBar;
