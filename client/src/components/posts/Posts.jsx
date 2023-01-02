import React from "react";
import Post from "./post/Post";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const Posts = ({ userId }) => {
  const { isLoading, error, data } = useQuery(["posts"], () => {
    if (userId === undefined) {
      return makeRequest.get("/posts").then((res) => res.data);
    } else {
      return makeRequest.get("/posts?userId=" + userId).then((res) => res.data);
    }
  });
  return (
    <>
      {error
        ? "Something went wrong"
        : isLoading
        ? "Loading"
        : data.map((e) => <Post key={e.id} post={e} />)}
    </>
  );
};

export default Posts;
