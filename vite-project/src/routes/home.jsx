import styled from 'styled-components';
import PostTweet from "../components/post-tweet";
import Timeline from '../components/timeline';

const Wrapper = styled.div`
  display: grid;
  gap: 50px;  
  grid-template-rows: 1fr 5fr;
  height: 100vh;
`;

export default function Home() {
  return (
    <>
      <Wrapper>
        <PostTweet />
        <Timeline />
      </Wrapper>
    </>
  );
}
