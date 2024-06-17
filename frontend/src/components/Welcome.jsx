import React, { useState, useEffect } from "react";
import Lottie from "react-lottie";
import animationData from "../assets/Animation - 1710938461614.json";
import styled from "styled-components";

const localhostKey = import.meta.env.VITE_APP_LOCALHOST_KEY;

export default function Welcome() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = JSON.parse(localStorage.getItem(localhostKey));
        if (user && user.username) {
          setUserName(user.username);
        } else {
          console.error("Username not found in localStorage.");
          // Handle the case where username is not found
        }
      } catch (error) {
        console.error("Error fetching username:", error);
        // Handle other potential errors here
      }
    };

    fetchUserName();
  }, []);

  return (
    <Container>
      <Lottie options={defaultOptions} height={200} width={200} />
      <h1>
        Welcome, <span>{userName}!</span>
      </h1>
      <h3>Please select a chat to start messaging.</h3>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  background: linear-gradient(
    68.2deg,
    rgb(3, 126, 243) -0.3%,
    rgb(48, 195, 158) 100.2%
  );
  flex-direction: column;

  span {
    color: darkblue;
  }

  h3 {
    padding: 10px;
  }
`;
