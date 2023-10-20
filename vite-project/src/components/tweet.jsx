import { styled } from "styled-components";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useState } from "react";
import { auth } from "../firebase";


const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 2px solid #f8b26a;
  border-radius: 20px;
  margin: 20px 10px;
`;
const Column = styled.div`
  display: flex;
`;
const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
  margin-right: 10px;
`;
const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
  color: lightgray;
`;
const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;
const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 50px;
  justify-content: space-around;
`;
const Edit = styled.div`
  width: 25px;
  height: 25px;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
    transition: all 0.1s ease-in-out;
  }
`;
const Delete = styled.div`
  width: 25px;
  height: 25px;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
    transition: all 0.1s ease-in-out;
  }
`;
const TextArea = styled.textarea`
  font-size: 18px;
  padding: 20px;
  background-color: transparent;
  color: white;
  border: none;
  resize: none;
  width: 100%;
  &:focus {
    outline: none;
  }
`;
const EditTextArea = styled.div`
  position: relative;
  width: 100%;
  margin-right: 10px;
`;
const EditCheck = styled.div`
  position: absolute;
  right: 10px;
  bottom: 10px;
  width: 25px;
  height: 25px;
  cursor: pointer;
  &:hover {
    opacity: 0.7;
    transition: all 0.1s ease-in-out;
  }
`;
const NoImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 15px;
  margin-right: 10px;
`;
export default function Tweet({ userName, fileUrl, text, userId, id }) {
  const [isEditable, setIsEditable] = useState(false);
  const [tweet, setTweet] = useState(text);
  const user = auth.currentUser;

  // 수정 버튼 클릭 시 textarea 활성화
  const setTextArea = () => {
    setIsEditable((prev) => !prev);
    setTweet("");
  };

  // tweet 수정
  const handleEdit = () => {
    if (user.uid !== userId) return;
    const ok = confirm("Are you sure you want to edit this tweet?");
    if (!ok) {
      setIsEditable(false);
      return;
    }

    const payload = {
      text: tweet,
    };

    try {
      const tweetRef = doc(db, "tweets", id);
      updateDoc(tweetRef, payload);
      confirm("Tweet edited successfully!");
    } catch (err) {
      console.error(err);
    }
    setIsEditable(false);
  };

  // tweet 삭제
  const handleDelete = () => {
    const ok = confirm("Are you sure you want to delete this tweet?");
    if (!ok) return;

    try {
      const tweetRef = doc(db, "tweets", id);
      deleteDoc(tweetRef);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Wrapper>
      <Column>
        {isEditable ? (
          <EditTextArea>
            <TextArea
              value={tweet}
              onChange={(e) => setTweet(e.target.value)}
              placeholder="What's happening?"
            />
            <EditCheck onClick={handleEdit}>
              <svg fill="white" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                />
              </svg>
            </EditCheck>
          </EditTextArea>
        ) : (
          <div>
            <Username>{userName}</Username>
            <Payload>{text}</Payload>
          </div>
        )}
      </Column>

      <Column>
        {fileUrl ? (
          <Photo src={fileUrl} />
        ) : (
          <NoImage>
            <svg
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
            </svg>
          </NoImage>
        )}
        {user.uid === userId && (
          <IconContainer>
            <Edit onClick={setTextArea}>
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                ></path>
              </svg>
            </Edit>
            <Delete onClick={handleDelete}>
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                ></path>
              </svg>
            </Delete>
          </IconContainer>
        )}
      </Column>
    </Wrapper>
  );
}
