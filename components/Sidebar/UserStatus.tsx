import { useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { socket } from "../Socket/Socket";

function UserStatus({ id }: { id: string }) {
  const queryClient = useQueryClient();

  const fetchUserStatus = async () => {
    if (!id) return;
    try {
      const { data } = await axios.get("/api/getOnlineUsers", {
        params: { id },
      });

      console.log("Id: ", id, data);

      return data;
    } catch (error) {
      console.log(error);
      throw new Error("Error", error as ErrorOptions);
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user", id],
    queryFn: fetchUserStatus,
    staleTime: 1000 * 60 * 1,
  });

  useEffect(() => {
    socket.on("update_user_list", (userId: string) => {
      if (userId === id) {
        setTimeout(() => {
          queryClient.invalidateQueries({ queryKey: ["user", id] });
        }, 300);
      }
    });

    return () => {
      socket.off("update_user_list");
    };
  });

  if (isLoading) {
    return <h1>Loading....</h1>;
  }

  if (isError) {
    console.log(error);
    return <h1>Error......</h1>;
  }

  return (
    <div>
      <span
        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full transition-colors: ease-in ${
          data === true ? "bg-green-500" : "bg-slate-500"
        } ring-white dark:ring-gray-950`}
      ></span>
    </div>
  );
}
export default UserStatus;
