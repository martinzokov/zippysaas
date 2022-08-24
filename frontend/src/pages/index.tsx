import { useEffect, useState } from "react";
import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";
import { Auth } from "aws-amplify";

const axios = require("axios");

const HOSTED_URL =
  "https://ldf0f54op8.execute-api.eu-west-1.amazonaws.com/dev/";

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
      .get(`${HOSTED_URL}example`, {
        headers: { Authorization: `Bearer ${token}` },
        "Content-Type": "application/json",
      })
      .then((response) => setServerMessage(response.data.message));
  }, [token]);
  let [message, setMessage] = useState("");
  let [success, setSuccess] = useState(false);
  let [sessionId, setSessionId] = useState("");

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setSuccess(true);
      setSessionId(query.get("session_id"));
    }

    if (query.get("canceled")) {
      setSuccess(false);
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, [sessionId]);

  const createChecokutSessionSubmit = async (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    console.log("Creating session... token: " + token);
    await axios
      .post(
        `${HOSTED_URL}create-checkout-session?lookup_key=ZB1`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          "Content-Type": "application/json",
        }
      )
      .then((response) => console.log(response.data.message));
  };

  const createPortalSessionSubmit = async (
    e: React.FormEvent<HTMLInputElement>
  ) => {
    e.preventDefault();
    await axios
      .post(
        `${HOSTED_URL}create-portal-session?session_id=${sessionId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          "Content-Type": "application/json",
        }
      )
      .then((response) => console.log(response.data.message));
  };

  // if (!success && message === "") {
  //   return <ProductDisplay />;
  // } else if (success && sessionId !== "") {
  //   return <SuccessDisplay sessionId={sessionId} />;
  // } else {
  //   return <Message message={message} />;
  // }

  return (
    <Main
      meta={
        <Meta
          title="Next.js Boilerplate Presentation"
          description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
        />
      }
    >
      {!success && message === "" && (
        // <ProductDisplay formAction={createChecokutSessionSubmit} />
        <section>
          <div className="product">
            <Logo />
            <div className="description">
              <h3>Starter plan</h3>
              <h5>$9.99 / month</h5>
            </div>
          </div>
          <form onSubmit={createChecokutSessionSubmit}>
            {/* Add a hidden field with the lookup_key of your Price */}
            <input type="hidden" name="lookup_key" value="ZB1" />
            <button
              className="bg-main text-white rounded-md p-3"
              id="checkout-and-portal-button"
              type="submit"
            >
              Checkout
            </button>
          </form>
        </section>
      )}{" "}
      {success && sessionId !== "" && (
        <section>
          <div className="product Box-root">
            <Logo />
            <div className="description Box-root">
              <h3>Subscription to starter plan successful!</h3>
            </div>
          </div>
          <form onSubmit={createPortalSessionSubmit}>
            <input
              type="hidden"
              id="session-id"
              name="session_id"
              value={sessionId}
            />
            <button id="checkout-and-portal-button" type="submit">
              Manage your billing information
            </button>
          </form>
        </section>
      )}{" "}
      {!success && message !== "" && <Message message={message} />}
    </Main>
  );

  // return (
  //   <Main
  //     meta={
  //       <Meta
  //         title="Next.js Boilerplate Presentation"
  //         description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
  //       />
  //     }
  //   >
  //     <p>{serverMessage}</p>

  //   </Main>
  // );
};

const ProductDisplay = (formAction: FormEventHandler) => (
  <section>
    <div className="product">
      <Logo />
      <div className="description">
        <h3>Starter plan</h3>
        <h5>$9.99 / month</h5>
      </div>
    </div>
    <form action={formAction}>
      {/* Add a hidden field with the lookup_key of your Price */}
      <input type="hidden" name="lookup_key" value="ZB1" />
      <button
        className="bg-main text-white rounded-md p-3"
        id="checkout-and-portal-button"
        type="submit"
      >
        Checkout
      </button>
    </form>
  </section>
);

const SuccessDisplay = ({ sessionId, formAction }) => {
  return (
    <Main
      meta={
        <Meta
          title="Next.js Boilerplate Presentation"
          description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
        />
      }
    >
      <section>
        <div className="product Box-root">
          <Logo />
          <div className="description Box-root">
            <h3>Subscription to starter plan successful!</h3>
          </div>
        </div>
        <form action={formAction}>
          <input
            type="hidden"
            id="session-id"
            name="session_id"
            value={sessionId}
          />
          <button id="checkout-and-portal-button" type="submit">
            Manage your billing information
          </button>
        </form>
      </section>
    </Main>
  );
};

const Message = ({ message }) => (
  <Main
    meta={
      <Meta
        title="Next.js Boilerplate Presentation"
        description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
      />
    }
  >
    <section>
      <p>{message}</p>
    </section>
  </Main>
);

const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="14px"
    height="16px"
    viewBox="0 0 14 16"
    version="1.1"
  >
    <defs />
    <g id="Flow" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g
        id="0-Default"
        transform="translate(-121.000000, -40.000000)"
        fill="#E184DF"
      >
        <path
          d="M127,50 L126,50 C123.238576,50 121,47.7614237 121,45 C121,42.2385763 123.238576,40 126,40 L135,40 L135,56 L133,56 L133,42 L129,42 L129,56 L127,56 L127,50 Z M127,48 L127,42 L126,42 C124.343146,42 123,43.3431458 123,45 C123,46.6568542 124.343146,48 126,48 L127,48 Z"
          id="Pilcrow"
        />
      </g>
    </g>
  </svg>
);

export default Index;
