import Post from "../post/Post";
import "./posts.scss";
import { makeRequest } from "../../axios";
import { useQuery } from "react-query";

const Posts = ({ userId }) => {
  const { isLoading, error, data } = useQuery(["posts", userId], () =>
    makeRequest.get("/posts?userId=" + userId).then((res) => {
      return res.data;
    })
  );

  return (
    <>
      {data?.length == 0 ? (
        <div
          style={{ height: "100vh", textAlign: "center", paddingTop: "50px" }}
        >
          <h1 style={{ color: "white" }}>
            Welcome to Dans Social <br /> start posting or follow people!
          </h1>
        </div>
      ) : (
        <div className="posts">
          {error
            ? "Something went wrong"
            : isLoading
            ? "Loading"
            : data.map((post) => <Post post={post} key={post.id} />)}
        </div>
      )}
    </>
  );
};

export default Posts;
