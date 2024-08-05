import { useQuery } from "@tanstack/react-query";
import React from "react";
import { makeRequest } from "../../axios";
import Post from "./post/Post";

const Posts = ({ userId }) => {
  const { isLoading, error, data } = useQuery(["posts"], async () => {
    if (userId === undefined) {
      const res = await makeRequest.get("/posts");
      return res.data;
    } else {
      const res_1 = await makeRequest.get("/posts?userId=" + userId);
      return res_1.data;
    }
  }, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <>
      {error
        ? "Something went wrong"
        : isLoading
          ? <Post loading={isLoading} />
          : data.map((e) => <Post key={e.id} post={e} loading={isLoading} />)}
    </>
  );
};

export default Posts;
