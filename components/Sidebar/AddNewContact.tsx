"use client";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import ContactList from "./ContactList";
import { MessageSquarePlus } from "lucide-react";
import { useState } from "react";

function AddNewContact() {
  const [query, setSearchQuery] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <MessageSquarePlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Contacts</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search contacts..."
            className="pl-8"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="mt-4 max-h-[60vh] overflow-y-auto pr-1">
          <ContactList />
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default AddNewContact;
