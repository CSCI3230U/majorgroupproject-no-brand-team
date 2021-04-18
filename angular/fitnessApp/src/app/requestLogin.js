// code library located at https://github.com/auth0/node-jwks-rsa#caching
const jwkClient = require("jwks-rsa");
const https = require('https');
const client = jwksClient({
    jwksUri: 'Thttps://enigmatic-cove-71059.herokuapp.com/v1/signup',
    requestHeaders: {},
    requestAgent: new https.Agent({
        ca: fs.readFileSync(caFile)
    })
});
const client = new JwksClient({
    jwksUri: 'Thttps://enigmatic-cove-71059.herokuapp.com/v1/signup',
    getKeysInterceptor: () => {
        const file = fs.readFileSync(jwksFile);
        return file.keys;
    }
})