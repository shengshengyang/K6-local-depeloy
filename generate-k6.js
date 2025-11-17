import fs from 'fs';

// API Configuration
const BASE_URL = "localhost:8080";

// Test Data Configuration
const stores = [];
const dates = [

];

const endpoints = [

];

let USERS = [];

stores.forEach((store) => {
    dates.forEach((range) => {
        endpoints.forEach((ep) => {
            USERS.push({
                store,
                endpoint: ep,
                start: range.start,
                end: range.end
            });
        });
    });
});

const script = `
import http from 'k6/http';
import { check } from 'k6';
import { Counter, Trend } from 'k6/metrics';

// Custom Metrics
const errorCounter = new Counter('custom_errors');
const successCounter = new Counter('custom_success');
const responseTime = new Trend('custom_response_time');

// API Configuration
const BASE_URL = '${BASE_URL}';

// Auto generated USERS
const USERS = ${JSON.stringify(USERS, null, 2)};

export const options = {
    scenarios: {
        load_test: {
            executor: 'constant-arrival-rate',
            rate: 200,
            timeUnit: '1s',
            duration: '30s',
            preAllocatedVUs: 50,
            maxVUs: 500,
        }
    }
};

const HEADERS = {

};

export default function () {
    const user = USERS[Math.floor(Math.random() * USERS.length)];

    const url = \`\${BASE_URL}\${user.endpoint}/\${user.store}?startDate=\${user.start}&endDate=\${user.end}\`;

    const response = http.get(url, { headers: HEADERS });

    check(response, {
        'status = 200': r => r.status === 200,
        'body not empty': r => r.body && r.body.length > 0,
    });

    responseTime.add(response.timings.duration);

    if (response.status >= 200 && response.status < 300) successCounter.add(1);
    else errorCounter.add(1);
}
`;

fs.writeFileSync("load-test.js", script);
console.log("Generated load-test.js!");
