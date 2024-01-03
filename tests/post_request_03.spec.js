const { test, expect } = require('@playwright/test');

import { faker } from '@faker-js/faker';

const { DateTime } = require('luxon');

test('Post api request using dynamic request body in playwright', async({ request })=>{
    
    // create test data
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const totalPrice = faker.number.int(1000);

    const checkInDate = DateTime.now().toFormat('yyyy-MM-dd');
    const checkOutDate = DateTime.now().plus({day:5}).toFormat('yyyy-MM-dd');

    // create post api request using playwright
    const postResponse = await request.post('/booking',{
        data:{
                "firstname": firstName,
                "lastname": lastName,
                "totalprice": totalPrice,
                "depositpaid": true,
                "bookingdates": {
                    "checkin": checkInDate,
                    "checkout": checkOutDate
                },
                "additionalneeds": "super bowls"
            }
    })

    // validate status code 
    console.log(await postResponse.json());

    expect(postResponse.ok()).toBeTruthy();
    expect(postResponse.status()).toBe(200);

    // validate api response json obj
    const postResponseBody = await postResponse.json();

    expect(postResponseBody.booking).toHaveProperty("firstname",firstName);
    expect(postResponseBody.booking).toHaveProperty("lastname",lastName);

    // validate api response nested json obj
    expect(postResponseBody.booking.bookingdates).toHaveProperty("checkin",checkInDate);
    expect(postResponseBody.booking.bookingdates).toHaveProperty("checkout",checkOutDate);
})