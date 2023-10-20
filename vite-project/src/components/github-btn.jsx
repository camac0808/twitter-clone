import styled from "styled-components";
import GithubLogo from "../assets/github-logo.svg";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { GithubAuthProvider, signInWithPopup } from 'firebase/auth';

const Logo = styled.img`
  height: 25px;
`;
const Button = styled.button`
  height: 40px;
  background-color: white;
  font-weight: 600;
  margin-top: 10px;
  width: 100%;
  color: black;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
export default function GithubBtn() {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      // if successful, navigate to home page
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <Button onClick={handleClick}>
      <Logo src={GithubLogo} alt="Github Logo" />
      Continue with Github
    </Button>
  );
}
