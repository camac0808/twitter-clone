import styled from "styled-components";
import GoogleLogo from "../assets/google-logo.svg"
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Logo = styled.img`
  width: 20px;
  height: 20px;
`;
const Button = styled.button`
  height: 40px;
  background-color: white;
  margin-top: 10px;
  font-weight: 600;
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
export default function GoogleBtn() {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // if successful, navigate to home page
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  }
  
  return (
    <Button onClick={handleClick}>
      <Logo src={GoogleLogo} alt="Google Logo" />
      Continue with Google
    </Button>  
  );
}
