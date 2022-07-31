import { useEffect, useState } from "react";
import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import { Auth } from "aws-amplify";

const axios = require("axios");

const HOSTED_URL =
  "https://0x28ytfal3.execute-api.eu-west-1.amazonaws.com/dev/";

const Index = () => {
  const [token, setToken] = useState("");
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    Auth.currentSession()
      .then((result) => {
        setToken(result.getIdToken().getJwtToken());
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${HOSTED_URL}recipes`, {
        headers: { Authorization: `Bearer ${token}` },
        "Content-Type": "application/json",
      })
      .then((response) => setServerMessage(response.data.message));
  }, [token]);

  return (
    <Main
      meta={
        <Meta
          title="Next.js Boilerplate Presentation"
          description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
        />
      }
    >
      <p>{serverMessage}</p>
    </Main>
  );
};

export default Index;
