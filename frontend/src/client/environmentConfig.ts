
const DEV_URL =  "https://ldf0f54op8.execute-api.eu-west-1.amazonaws.com/dev/";
const TEST_URL =  "";
const PRODUCTION_URL =  "";

export function getHost() {
    switch(process.env.NODE_ENV){
        case "development":
            return DEV_URL;
        case "test":
            return TEST_URL;
        case "production":
            return PRODUCTION_URL;    
    }
}