import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";

const Wrapper = styled.div`
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default function Timeline() {
  const [tweets, setTweets] = useState([]);

  useEffect(() => {
    // 트윗을 가져오는 함수
    let unsubscribe;
    const fetchTweets = async () => {
      try {
        // desc: 내림차순 descending order
        const tweetsQuery = query(collection(db, "tweets"), orderBy("createdAt", "desc"), limit(10));

        // onSnapshot: 실시간으로 데이터베이스의 변화를 감지하는 함수
        // * onSnapShot은 unsubscribe 함수를 return한다 onSnapShot은 event listener를 등록
        // * unsubscribe 함수를 호출하면 event listener가 해제
        unsubscribe = await onSnapshot(tweetsQuery, (snapshot) => {
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
        console.error(err);
      }
    };
    fetchTweets();
    return () => {
      // cleanup function
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <>
      <Wrapper>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} />
        ))}
      </Wrapper>
    </>
  );
}
