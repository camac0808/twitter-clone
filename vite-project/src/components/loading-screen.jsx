import styled from "styled-components";
import { ColorRing } from "react-loader-spinner";

// Remove the import statement for styled since it is already imported above
// import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export default function LoadingScreen() {
  return (
    <Wrapper>
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={["#F1EFEF", "#CCC8AA", "#f8b26a", "#7D7C7C", "#191717"]}
      />
    </Wrapper>
  );
}
