import { useEffect, useState } from "react";
import { Meta } from "@/layouts/Meta";
import { Main } from "@/templates/Main";

import PriceSelection from "@/components/pricing/PriceSelection";
import { useIsAuthenticated } from "@/hooks/useIsAuthenticated";
import { getSubscriptionDetails } from "@/client/BackendClient";

const Index = () => {
  const isAuthenticated = useIsAuthenticated();
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    if (isAuthenticated) {
      getSubscriptionDetails()
        .then((response) => {
          setHasActiveSubscription(response.data.isActive);
          setIsLoading(false);
        })
        .catch((response) => {
          setIsLoading(true);
          console.error(response);
        });
    }
  }, [isAuthenticated]);

  return (
    <Main
      meta={
        <Meta
          title="Next.js Boilerplate Presentation"
          description="Next js Boilerplate is the perfect starter code for your project. Build your React application with the Next.js framework."
        />
      }
    >
      {isLoading && (
        <div className="flex justify-center">
          <div className="w-10 h-10 animate-ping rounded-full bg-main"></div>
        </div>
      )}

      {isAuthenticated && hasActiveSubscription && !isLoading && (
        <div>Welcome to ZippySaaS!</div>
      )}
      {isAuthenticated && !hasActiveSubscription && !isLoading && (
        <PriceSelection />
      )}
    </Main>
  );
};

export default Index;
