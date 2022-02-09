import { CircularProgress, styled } from "@mui/material";
import React from "react";

const WrapperComments = styled("div")`
  width: 600px;
  margin: 0 auto;
  border-top: 1px solid lightgray; ;
`;

const WrapperComment = styled("div")`
  border-bottom: 1px solid black;
  border-left: 1px solid lightgray;
  border-right: 1px solid lightgray;
  background-color: bisque;
  padding: 10px;
`;

const StyledName = styled("div")`
  font-weight: bold;
`;

const StyledBody = styled("div")`
  margin: 15px 0;
`;

const StyledEmail = styled("div")`
  font-style: italic;
  color: chocolate;
`;

const StyledWrapperButton = styled("div")`
  display: flex;
  justify-content: space-around;
`;

const StyledButton = styled("button")`
  width: 150px;
  height: 50px;
  margin: 30px 20px;
  border-radius: 8px;
  font-weight: bold;
`;

const WrapperCircular = styled("div")`
  margin: 30px 0;
  display: flex;
  justify-content: center;
`;

type CommentType = {
  id: number;
  body: string;
  email: string;
  name: string;
  postId: number;
};

const Comments = () => {
  const [dataComments, setDataComments] = React.useState<CommentType[]>([]);
  const [page, setPage] = React.useState<number>(0);
  const [loader, setLoader] = React.useState<boolean>(false);
  // const ref = React.useRef(null);
  const [offset, setOffset] = React.useState(0);

  const { innerHeight } = window;
  const absoluteHeight = document.documentElement.scrollHeight;
  const isEndPage = absoluteHeight === innerHeight + Math.floor(offset);
  const limits = 2;

  React.useEffect(() => {
    const onScroll = () => setOffset(window.pageYOffset);
    // clean up code
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    !loader && onAddComments();
  }, [isEndPage]);

  // React.useEffect(() => {
  //   // @ts-ignore
  //   console.log("__ref__", ref?.current?.getBoundingClientRect());
  // }, [ref]);

  console.log("__absoluteHeight__", absoluteHeight);
  console.log("offset", offset);
  console.log("__innerHeight__", innerHeight);

  const onAddComments = async () => {
    setLoader(true);
    try {
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/comments?_page=${page}&_limit=${limits}`
      );
      const json = await res.json();
      console.log("__res__", json);
      setDataComments([...dataComments, ...json]);
      let currentPage: number;
      currentPage = page;
      setPage(currentPage + limits);
    } catch (e) {
      console.log(e, "error while fetching comments");
    } finally {
      setLoader(false);
    }
  };

  const onDelComments = () => {
    setDataComments([]);
    setPage(0);
  };

  return (
    <div>
      <WrapperComments>
        <StyledWrapperButton>
          <StyledButton onClick={onAddComments}>Next comments</StyledButton>
          <StyledButton onClick={onDelComments}>delete comments</StyledButton>
        </StyledWrapperButton>
        {dataComments.map((comment: CommentType) => {
          return (
            <WrapperComment key={comment.id}>
              <StyledName>Name: {comment.name}</StyledName>
              <StyledBody>Description:{comment.body}</StyledBody>
              <StyledEmail>Email: {comment.email}</StyledEmail>
            </WrapperComment>
          );
        })}
        {loader && (
          <WrapperCircular>
            <CircularProgress />
          </WrapperCircular>
        )}
      </WrapperComments>
    </div>
  );
};

export default Comments;
