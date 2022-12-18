## How to configure

### Serverless

Signup here - https://app.serverless.com/
Follow this for local Serverless setup - https://www.serverless.com/framework/docs/getting-started
Follow this to connect your Serverless account to AWS - https://www.serverless.com/framework/docs/providers/aws/guide/credentials

### Secrets

Easiest way to manage secrets is to use Approach one #1 from this guide - https://www.serverless.com/blog/aws-secrets-management/

It uses AWS Systems Manager

### Authentication

By default ZippySaaS comes with Google sign in set up. You need to get your client ID and client secret from
Google - https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid

Authentication resources that are needed for cognito are Cognito User Pools and Cognito Identity Pools. All of these are configured under `./backend/resources`

Other signin providers that Cognito supports like Facebook can be added in a similar way.

Use AWS Systems Manager to set up client ids and secret for each authentication provider. ZippySaaS comes set up for Google sign via variables called `google_client_id` and `google_client_secret`. Those need to be added through the AWS console. They are referenced from `./backend/serverless.yml`

```
provider:
  environment:
    // ...
    GOOGLE_CLIENT_ID: ${ssm:/google_client_id}
    GOOGLE_CLIENT_SECRET: ${ssm:/google_client_secret}
```

### Connecting frontend and backend

After your backend is up and running through `serverless deploy`, the command will output an AWS API Gateway URL which you need to configure in a `.env` file along with your Cognito OAuth settings.

There are three `.env` for each environment type that Node supports - development, test, production

You need to configure the following settings:

You need to place your API Gateway URL in an environment variable called BACKEND_API

## Note!

All environment variables need to have the prefix `NEXT_PUBLIC_` so they can be available on the client browser. More about this [here](https://nextjs.org/docs/basic-features/environment-variables)

```
NEXT_PUBLIC_BACKEND_API=https://ldf0f54op8.execute-api.eu-west-1.amazonaws.com/dev/
```

The following are related to AWS Cognito. Log in to your AWS console and get them from there. Note: The value for OAUTH_COGNITO_HOST is automatically generated `[environment]-[service-name]`. This can be changed in the `CognitoUserPoolDomain` configuration under `./backend/resources/cognito-user-pool.yml`

```
NEXT_PUBLIC_OAUTH_COGNITO_HOST=dev-zippysaas.auth.eu-west-1.amazoncognito.com
NEXT_PUBLIC_USER_POOL_CLIENT_ID=12h6r8pwfiakrac9q2m62q5h6l
NEXT_PUBLIC_USER_POOL_ID=eu-west-1_NcIYsruQa
NEXT_PUBLIC_IDENTITY_POOL_ID=eu-west-1:a6a4ed37-84fe-1ba1-9ab8-100ae114d555
NEXT_PUBLIC_AWS_REGION=eu-west-1
```

In `./frontend/src/pages/_app.tsx` you need to set up redirect URLs for OAuth (Social sign-in). This happens via these properties in the `config` variable:

```
  REDIRECT_SIGN_IN: `http://localhost:3000/`,
  REDIRECT_SIGN_OUT: `http://localhost:3000/signout`,
```

It's not advisable to use `localhost` for these as it poses a security risk. The URLs need to also be added to your OAuth provider's redirect URL settings

## Stripe Payments

ZippySaaS is integrated with Stripe to simplify payments setup. First, you need to get an API key by registering on the [Stripe website](https://dashboard.stripe.com/register) and getting it from your Dashboard.

There are a few steps to set up payments in ZippySaaS

### 1. API key

After you have an API key, you need to place it in AWS Systems Manager under a key called `stripe_api_key`. Similar to the Secrets section above, this is referenced from `./backend/serverless.yml`

```
provider:
  environment:
    // ...
    STRIPE_API_KEY: ${ssm:/stripe_api_key}
```

### 2. Product and billing setup

Subscription tiers are usually modelled through different Products on Stripe. In ZippySaaS, each product has a list of permissions it allows so that you can enable/disable certain actions from the user based on your subscription tier. Also, there are two Lambda functions we need to run to setup Stripe billing. One to set up prdocut features on the backend and the other to set up the billing portal users go to to manage their subscription.

After you have an API key, you need to set up one or more Products in Stripe. You can do this from the Stripe Dashboard. Take the product IDs and set them up under `./backend/src/lambda/admin/productConfig.json`. This is a JSON which maps your product IDs to a list of features that you can then use in your business logic to control what a user is allowed to do in your app. The JSON file is backed by a type configuration under `./backend/src/lambda/admin/ProductFeaturesConfig.ts`

Each Product needs a price associated with it. You can also have multiple prices for your products. For example, a monthly and an annual subscription would need to have separate Price objects configured in Stripe. This can be done via their Dashboard. Each product has a default Price assigned. To configure the billing portal options so that a user can select different prices go to `./backend/src/lambda/admin/billingPortalConfig.ts`. In the `subscription_update.products` list add your product keys and map them to the Price ids for the non-default Price objects (e.g. default is monthly subscription but user can select an annual option)

There are two Lambda functions you need to run to complete the backend setup. To run them go to your AWS console and find the following an run them in this order

1. `[service]-[stage]-featuresConfig`
2. `[service]-[stage]-billingPortalConfig`

To run them, find the test tab and then click the Test button to invoke them.

### 3. Add Price IDs to frontend

On the frontend, there's a `PriceSelection` component under `./frontend/src/components/pricing/PriceSelection.tsx`. Set up the params to the `PriceCard` component and add the Price IDs for your monthly/annual subscriptions as well as the options

### 4. Webhooks

When deployed, ZippySaaS will have webhook endpoints for Stripe Bilings lifecycle events. When deployed, your API will have a path `[API_ENDPOINT]/stripe-webhook`. You need to configure this URl in your Stripe Dashboard webhook settings (Developers > Webhooks). Add at least the following lifecycle events when configuring your webhook: `customer.created, customer.updated, customer.subscription.created, customer.subscription.updated, invoice.payment_succeeded, invoice.payment_failed`

Similarly to other secrets above, you need to add this to your environment variables via SSM:

```
provider:
  environment:
    STRIPE_WEBHOOK_SECRET: ${ssm:/stripe_webhook_secret}

```

All webhook events will be saved to a DynamoDB instance and immediately return an HTTP 200 success response. Processing will happen based on a DynamoDB Event Stream that happens asynchronously. This is to ensure all events are processed and to ensure idempotency.

The handler for DynamoDB events is in `./backend/src/events/processors/dynamoEvents.ts`. There are two Processor classes - one for customer events and one for invoice events. Make sure to configure `InvoiceEventsProcessor` to handle payment failures based on your business requirements.

Note that when processing events, we don't use the event payload but rather call the Stripe APi to retrieve the latest state of the object being updated. This is because Stripe events don't necessarily come in the correct order so to ensure state is stored correctly, we poll the Stripe API every time.
