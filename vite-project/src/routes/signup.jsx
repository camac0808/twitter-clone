import { useForm } from "react-hook-form";
import { useState } from "react";
import styled, { css, keyframes } from "styled-components";
import LoadingScreen from "../components/loading-screen";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import GithubBtn from "../components/github-btn";
import GoogleBtn from "../components/google-btn";

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
const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ccc;
  margin: 25px 0;
  width: 100%;
`;
export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSignup = async (data) => {
    setError(null);
    setIsLoading(true);
    try {
      // create an account
      const credentials = await createUserWithEmailAndPassword(auth, data.email, data.password);
      // set the name of the user
      await updateProfile(credentials.user, {
        displayName: data.name,
      });
      console.log(credentials.user);
      // redirect to home page
      navigate("/");
    } catch (error) {
      // firebase error
      const errorCode = error.code;
      if (errorCode === "auth/email-already-in-use") {
        setError("Email already in used");
      } else if (errorCode === "auth/invalid-email") {
        setError("Invalid email");
      } else if (errorCode === "auth/weak-password") {
        setError("Password should be at least 6 characters");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Title>
        Join <Emoji>𝕏</Emoji>
      </Title>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
          <Form onSubmit={handleSubmit(onSignup)}>
            <Input type="text" placeholder="name" {...register("name", { required: true })} />
            <Input type="email" placeholder="email" {...register("email", { required: true })} />
            <Input type="password" placeholder="password" {...register("password", { required: true })} />
            <SubmitButton type="submit">Sign Up</SubmitButton>
            {errors.name || errors.email || errors.password ? (
              <ErrorSpan>Invalid email or password</ErrorSpan>
            ) : error ? (
              <ErrorSpan>{error}</ErrorSpan>
            ) : null}
          </Form>
          <NavigateSpan>
            Do you have a account?<StyledLink to="/login">Login now</StyledLink>
          </NavigateSpan>
          <Divider />
          <GithubBtn />
          <GoogleBtn />
        </>
      )}
    </Wrapper>
  );
}
