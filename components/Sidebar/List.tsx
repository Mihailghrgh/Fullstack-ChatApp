import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users } from "@prisma/client";
import axios from "axios";

function List({ data }: { data: Users[] }) {
  const createRoom = async (item: string) => {
    try {
      await axios.post("/api/createConversation", { id: item });
    } catch (error: any) {
      console.log("error occurred: ", error);
      throw new Error("Something happened,", error);
    }
  };

  return (
    <ul className="space-y-3">
      {data.map((contact) => {
        return (
          <li
            key={contact.id}
            className="flex items-center justify-between rounded-lg border p-3"
          >
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={contact.image} alt={contact.email} />
              </Avatar>
              <span className="font-medium">{contact.email}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-green-500 hover:cursor-pointer"
              onClick={() => createRoom(contact.id)}
            >
              Chat
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
export default List;
