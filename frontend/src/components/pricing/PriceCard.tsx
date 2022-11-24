import { createCheckoutSession } from "@/client/BackendClient";
import { Auth } from "aws-amplify";
import { MouseEventHandler, useEffect, useState } from "react";

type IPriceCardProps = {
  planName: string;
  perMonth: number;
  monthlyPriceId: string;
  annual: number;
  annualPriceId: string;
  features: string[];
  isAnnualPrice: boolean;
};

const PriceCard = (props: IPriceCardProps) => {
  const createChecokutSessionSubmit = async (
    e: MouseEventHandler<HTMLAnchorElement>
  ) => {
    let priceId = props.isAnnualPrice
      ? props.annualPriceId
      : props.monthlyPriceId;
    await createCheckoutSession(priceId).then((response: any) => {
      window.location.href = response.data.sessionUrl;
    });
  };

  return (
    <div className="flex flex-col p-6 mx-auto max-w-lg text-center text-gray-900 bg-white rounded-lg border border-gray-100 shadow ">
      <h3 className="mb-4 text-2xl font-semibold">{props.planName}</h3>
      {props.isAnnualPrice ? (
        <div className="flex justify-center items-baseline my-8">
          <span className="mr-2 text-5xl font-extrabold">${props.annual}</span>
          <span className="text-gray-500">/year</span>
        </div>
      ) : (
        <div className="flex justify-center items-baseline my-8">
          <span className="mr-2 text-5xl font-extrabold">
            ${props.perMonth}
          </span>
          <span className="text-gray-500">/month</span>
        </div>
      )}

      {/* <!-- List --> */}
      <ul role="list" className="mb-8 space-y-4 text-left">
        {props.features.map((feature, index) => (
          <FeatureItem key={index} featureDescription={feature} />
        ))}
      </ul>
      <a
        onClick={createChecokutSessionSubmit}
        href="#"
        className="text-white bg-main hover:main-light focus:ring-4 focus:main-light font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Get started
      </a>
    </div>
  );
};

const FeatureItem = ({
  featureDescription,
}: {
  featureDescription: string;
}) => (
  <li className="flex items-center space-x-3">
    <svg
      className="flex-shrink-0 w-5 h-5 text-green-500"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      ></path>
    </svg>
    <span>{featureDescription}</span>
  </li>
);

export default PriceCard;
