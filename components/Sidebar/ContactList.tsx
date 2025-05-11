"use client"
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import List from "./List";

function ContactList() {
  const fetchData = async () => {
    try {
      const { data } = await axios.get("/api/getAllUsers");

      return data;
    } catch (error: any) {
      console.log("Error occurred: ", error);
    }
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["contacts"],
    queryFn: fetchData,
  });

  if (isLoading) {
    <h1>loading.....</h1>;
  }

  if (isError) {
    console.log("Error occurred: ", error);
    <h1>Error.....</h1>;
  }

  if(!isLoading){
    return <List data={data} />;
  }

}
export default ContactList;
