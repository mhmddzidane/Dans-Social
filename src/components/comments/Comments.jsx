import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery(["comments"], () =>
    makeRequest.get("/comments?postId=" + postId).then((res) => {
      return res.data;
    })
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => {
      return makeRequest.post("/comments", newComment);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId });
    setDesc("");
  };

  const handleNavigate = (id) => {
    navigate("/profile/" + id);
  };
  console.log(data);

  return (
    <div className="comments">
      <div className="write">
        <img
          src={
            currentUser.profilePic
              ? "upload/" + currentUser.profilePic
              : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
          alt=""
        />
        <input
          type="text"
          placeholder="write a comment"
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error && <p>Error loading Comments</p>}

      {isLoading
        ? "Loading"
        : data?.map((comment) => (
            <div className="comment" key={comment.id}>
              <img
                src={
                  comment.profilePic
                    ? "upload/" + comment.profilePic
                    : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                }
                alt="comment"
              />
              <div className="info">
                <span
                  onClick={() => handleNavigate(comment.comment_user_id)}
                  style={{ cursor: "pointer" }}
                >
                  {comment.name}
                </span>
                <p>{comment.description}</p>
              </div>
              <span className="date">
                {moment(comment.created_at).fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;
