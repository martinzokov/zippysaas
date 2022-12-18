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

### Connecting frontend and backend

After your backend is up and running through `serverless deploy`, the command will output an AWS API Gateway URL which you need to configure in a `.env` file along with your Cognito OAuth settings.

There are three `.env` for each environment type that Node supports - development, test, production

You need to configure the following settings:

You need to place your API Gateway URL in an environment variable called BACKEND_API

Note! All environment variables need to have the prefix `NEXT_PUBLIC_` so they can be available on the client browser. More about this [here](https://nextjs.org/docs/basic-features/environment-variables)

```
NEXT_PUBLIC_BACKEND_API=https://ldf0f54op8.execute-api.eu-west-1.amazonaws.com/dev/
```

The following are related to AWS Cognito. Log in to your AWS console and get them from there. Note: OAUTH_COGNITO_HOST is automatically generated `[environment]-[service-name]`. This can be changed in the `CognitoUserPoolDomain` configuration under `./backend/resources/cognito-user-pool.yml`

```
NEXT_PUBLIC_OAUTH_COGNITO_HOST=dev-zippysaas.auth.eu-west-1.amazoncognito.com
NEXT_PUBLIC_USER_POOL_CLIENT_ID=12h6r8pwfiakrac9q2m62q5h6l
NEXT_PUBLIC_USER_POOL_ID=eu-west-1_NcIYsruQa
NEXT_PUBLIC_IDENTITY_POOL_ID=eu-west-1:a6a4ed37-84fe-1ba1-9ab8-100ae114d555
NEXT_PUBLIC_AWS_REGION=eu-west-1
```

## Stripe Payments

Admin
Prices
Webhooks
