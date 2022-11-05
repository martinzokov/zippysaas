import PriceCard from "./PriceCard";

const PriceSelection = () => {
  let featureList: string[] = [
    "Individual configuration",
    "No setup, or hidden fees",
    "Team size: 100+ developers",
    "Premium support: 36 months",
    "Free updates: 36 months",
  ];
  return (
    <section className="bg-white">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">
            Pricing
          </h2>
        </div>
        <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
          <PriceCard
            planName="Starter"
            features={featureList}
            perMonth={29}
            annual={200}
          />
          <PriceCard
            planName="Company"
            features={featureList}
            perMonth={99}
            annual={1000}
          />
          {/* <!-- Pricing Card --> */}
          <PriceCard
            planName="Awesome"
            features={featureList}
            perMonth={59}
            annual={5000}
          />
        </div>
      </div>
    </section>
  );
};

export default PriceSelection;
