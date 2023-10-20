import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import Tweet from "../components/tweet";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";

const Wrapper = styled.div`
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const Title = styled.div`
  font-size: 40px;
  font-weight: 700;
  margin-left: 10px;
`;
const AvatarUpload = styled.label`
  cursor: pointer;
`;
const AvatarImg = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
  &:hover {
    opacity: 0.7;
    transition: all 0.1s ease-in-out;
  }
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 20px;
  font-weight: 600;
  margin: 0px 10px;
`;
const NoImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 15px;
  margin-right: 10px;
`;
const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: lightgray;
  margin: 40px 0px;
`;
const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0px;
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

export default function Profile() {
  const user = auth.currentUser;

  const [tweets, setTweets] = useState([]);
  const [avatar, setAvatar] = useState(user.photoURL);
  const [name, setName] = useState(user.displayName);

  // 사진 수정
  const handleAvatarChange = async (e) => {
    if (!user) return;
    try {
      const file = e.target.files[0];
      // storage 인스턴스 생성 후 reference를 만든다 경로 (참조)
      const storageRef = ref(storage, `avatars/${user.uid}`);
      const result = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(result.ref);
      // user에 저장된 fileUrl을 업데이트
      await updateProfile(user, {
        photoURL: url,
      });
      setAvatar(url);
    } catch (err) {
      console.log(err);
    }
  };

  // 이름 수정
  const editName = async () => {
    if (!user) return;
    const newName = prompt("Enter your new name");
    console.log(user);
    if (!newName) {
      return;
    }

    try {
      await updateProfile(user, {
        displayName: newName,
      });
      setName(newName);
      confirm("Name updated successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchProfileTweets = async () => {
      try {
        const tweetsQuery = query(
          collection(db, "tweets"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
          limit(10)
        );

        await onSnapshot(tweetsQuery, (snapshot) => {
          const tweets = snapshot.docs.map((doc) => {
            const { text, createdAt, userId, userName, fileUrl } = doc.data();
            return {
              id: doc.id,
              text,
              createdAt,
              userId,
              userName,
              fileUrl,
            };
          });
          setTweets(tweets);
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchProfileTweets();
  }, [user.uid]);

  return (
    <Wrapper>
      <Title>My Profile</Title>
      <ProfileContainer>
        <AvatarUpload htmlFor="avatar">
          {avatar ? (
            <AvatarImg src={avatar} />
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
        </AvatarUpload>
        <AvatarInput onChange={handleAvatarChange} id="avatar" type="file" accept="image/*" />
        <Name>{name}</Name>
        <Edit onClick={editName}>
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
      </ProfileContainer>
      <Divider />
      <Title>My Timeline</Title>
      {tweets.map((tweet) => (
        <Tweet key={tweet.id} {...tweet} />
      ))}
    </Wrapper>
  );
}
