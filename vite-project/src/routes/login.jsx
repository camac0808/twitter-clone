import { useForm } from "react-hook-form";
import { useState } from "react";
import styled, { css, keyframes } from "styled-components";
import LoadingScreen from "../components/loading-screen";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import GoogleBtn from "../components/google-btn";
import GithubBtn from "./../components/github-btn";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100%;
  width: 420px;
  padding: 200px 0;
`;
const slideInRight = keyframes`
  from {
    transform: translateX(100%);
  }
  80% {
    transform: translateX(-8%);
  }
  to {
    transform: translateX(0);
  }
`;
const Title = styled.h1`
  font-size: 42px;
  cursor: default;
  animation: ${slideInRight} 0.5s ease-in-out;
`;
const Emoji = styled.span`
  color: #f8b26a;
  font-size: 50px;
  &:hover {
    filter: brightness(150%);
    transition: all 0.5s ease-in-out;
  }
`;
const Form = styled.form`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;
const Input = styled.input`
  padding: 10px 20px;
  border: none;
  border-radius: 50px;
  width: 100%;
  font-size: 18px;
`;
const SubmitButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 50px;
  background-color: black;
  border: 1px solid #f8b26a;
  color: #f8b26a;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: #f8b26a;
    border: 1px solid #f8b26a;
    color: black;
    opacity: 0.8;
    transition: all 0.2s ease-in-out;
  }
`;
const ErrorSpan = styled.span`
  color: red;
  text-align: center;
  font-size: 16px;
`;
const NavigateSpan = styled.span`
  margin-top: 20px;
  font-size: 16px;
  color: white;
`;
const linkStyles = css`
  color: #f8b26a;
  text-decoration: none;
  margin-left: 5px;
  &:hover {
    text-decoration: underline;
  }
`;
const StyledLink = styled(Link)`
  ${linkStyles}
`;
const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ccc;
  margin: 25px 0;
  width: 100%;
`;
export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onLogin = async (data) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate("/");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === "auth/invalid-login-credentials") {
        setError("Invalid email or password");
      } else {
        setError("Something went wrong", errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Wrapper>
        <Title>
          Log <Emoji>𝕏</Emoji>
        </Title>
        {isLoading ? (
          <LoadingScreen />
        ) : (
          <>
            <Form onSubmit={handleSubmit(onLogin)}>
              <Input type="email" placeholder="email" {...register("email", { required: true })} />
              <Input
                type="password"
                placeholder="password"
                {...register("password", { required: true })}
              />
              <SubmitButton type="submit">Login</SubmitButton>

              {/* useForm errors와 catch error */}
              {errors.name || errors.email || errors.password ? (
                <ErrorSpan>Invalid email or password</ErrorSpan>
              ) : error ? (
                <ErrorSpan>{error}</ErrorSpan>
              ) : null}
            </Form>
            <NavigateSpan>
              Not a member?<StyledLink to="/signup">Signup now</StyledLink>
            </NavigateSpan>
          </>
        )}
        <Divider />
        <GithubBtn />
        <GoogleBtn />
      </Wrapper>
    </>
  );
}
