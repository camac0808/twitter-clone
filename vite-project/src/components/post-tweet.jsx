import { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
`;
const TextArea = styled.textarea`
  border: 2px solid white;
  font-size: 18px;
  padding: 20px;
  height: 140px;
  border-radius: 20px;
  background-color: transparent;
  color: white;
  resize: none;
  width: 100%;
  &:focus {
    outline: none;
    border: 2px solid #f8b26a;
  }
`;
const AttachFileButton = styled.label`
  text-align: center;
  border: 1px solid #f8b26a;
  border-radius: 20px;
  background-color: transparent;
  color: #f8b26a;
  font-size: 18px;
  font-weight: 600;
  width: 100%;
  cursor: pointer;
  padding: 10px 0px;
  &:focus {
    outline: none;
  }
  &:hover {
    background-color: #f8b26a;
    color: white;
    transition: all 0.1s ease-in-out;
  }
`;
const AttachFileInput = styled.input`
  display: none;
`;
const SubmitButton = styled.input`
  border: none;
  background-color: #f8b26a;
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  &:focus {
    outline: none;
  }
  &:hover {
    opacity: 0.9;
    transition: all 0.1s ease-in-out;
  }
`;
export default function PostTweet() {
  const [isLoading, setIsLoading] = useState(false);
  const [tweet, setTweet] = useState("");
  const [file, setFile] = useState(null);

  const onChange = (e) => {
    setTweet(e.target.value);
    console.log(tweet);
  };

  // 사진 첨부
  const onFileChange = (e) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      const file = files[0];
      const fileSizeInMB = file.size / (1024 * 1024);
      if (fileSizeInMB <= 1) {
        // file is less than or equal to 1MB
        setFile(file);
      } else {
        // file is greater than 1MB
        alert("File size should be less than 1MB");
      }
    }
  };

  // 트윗 작성
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("submit button clicked");
    setIsLoading(true);
    // check if tweet is empty
    if (isLoading || !tweet || tweet.length > 180) return;

    let user;
    try {
      // get current user
      user = auth.currentUser;
      const doc = await addDoc(collection(db, "tweets"), {
        text: tweet,
        createdAt: Date.now(),
        userId: user.uid,
        userName: user.displayName,
      });

      if (file) {
        // 파일이 있으면 storage에 저장
        const locationRef = ref(storage, `tweets/${user.uid}-${user.displayName}/${doc.id}`);
        const result = await uploadBytes(locationRef, file);
        const fileUrl = await getDownloadURL(result.ref);
        await updateDoc(doc, { fileUrl });
      }
      setTweet("");
      setFile(null);
    } catch (err) {
      console.error(err);
    } finally {
      console.log("upload success");
      setIsLoading(false);
    }
  };
  return (
    <Form onSubmit={onSubmit}>
      <TextArea
        required
        rows={5}
        maxLength={180}
        onChange={onChange}
        value={tweet}
        placeholder="What's happening?"
      />
      <AttachFileButton htmlFor="file">{file ? "Photo added" : "Add photo"}</AttachFileButton>
      <AttachFileInput onChange={onFileChange} type="file" id="file" accept="image/*" />
      <SubmitButton type="submit" value={isLoading ? "Posting..." : "Tweet"} />
    </Form>
  );
}
