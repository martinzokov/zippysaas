import PriceCard from "./PriceCard";
import { Switch } from "@headlessui/react";
import { useState } from "react";

const PriceSelection = () => {
  let featureList: string[] = [
    "Individual configuration",
    "No setup, or hidden fees",
    "Team size: 100+ developers",
    "Premium support: 36 months",
    "Free updates: 36 months",
  ];
  const [isAnnual, setIsAnnual] = useState(false);
  return (
    <section className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
            Pricing
          </h2>
        </div>
        <div className="text-sm mx-auto my-5 text-center">
          Monthly
          <Switch
            checked={isAnnual}
            onChange={setIsAnnual}
            className={`${
              isAnnual ? "bg-main" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full mx-3`}
          >
            <span
              className={`${
                isAnnual ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition`}
            />
          </Switch>
          Annual
        </div>
        <div className="flex md:flex-row flex-col">
          <PriceCard
            planName="Basic"
            features={featureList}
            perMonth={9.99}
            annual={99.9}
            isAnnualPrice={isAnnual}
            annualPriceId="price_XXXXXXXXXXXXXXXXX"
            monthlyPriceId="price_XXXXXXXXXXXXXXXXX"
          />
          <PriceCard
            planName="Pro"
            features={featureList}
            perMonth={19.99}
            annual={199}
            isAnnualPrice={isAnnual}
            annualPriceId="price_XXXXXXXXXXXXXXXXXXX"
            monthlyPriceId="price_XXXXXXXXXXXXXXXXXXXX"
          />
        </div>
      </div>
    </section>
  );
};

export default PriceSelection;
