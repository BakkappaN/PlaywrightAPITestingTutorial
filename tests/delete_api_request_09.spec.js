const { test, expect } = require("@playwright/test");
const postRequest = require("../test-data/post_request_body.json");
const tokenRequest = require("../test-data/token_request_body.json");
const putRequest = require("../test-data/put_request_body.json");
const { json } = require("stream/consumers");

test("Create DELETE api request in playwright", async ({ request }) => {
  // create post api request using playwright
  const postAPIResponse = await request.post("/booking", {
    data: postRequest,
  });

  const bookingId = await postAPIResponse.json();
  const bId = bookingId.bookingid;

  // create GET api request using playwright
  const getAPIResponse = await request.get("/booking/", {
    params: {
      firstname: "testers talk playwright",
      lastname: "testers talk api testing",
    },
  });

  // validate status code
  console.log(await getAPIResponse.json());
  expect(getAPIResponse.ok()).toBeTruthy();
  expect(getAPIResponse.status()).toBe(200);

  // generate token
  const tokenAPIResponse = await request.post("/auth", {
    data: tokenRequest,
  });
  expect(tokenAPIResponse.ok()).toBeTruthy();
  expect(tokenAPIResponse.status()).toBe(200);

  console.log(await tokenAPIResponse.json());
  const tokenResponseBody = await tokenAPIResponse.json();
  const tokenNo = tokenResponseBody.token;

  // partial update booking details
  const patchAPIResponse = await request.patch(`/booking/${bId}`, {
    headers: {
      "Content-Type": "application/json",
      Cookie: `token=${tokenNo}`,
    },
    data: {
      firstname: "testers talk postman",
      lastname: "testers talk rest assured",
    },
  });

  console.log(await patchAPIResponse.json());
  expect(patchAPIResponse.ok()).toBeTruthy();
  expect(patchAPIResponse.status()).toBe(200);

  // DELETE api request
  // partial update booking details
  const deleteAPIResponse = await request.delete(`/booking/${bId}`, {
    headers: {
      "Content-Type": "application/json",
      "Cookie": `token=${tokenNo}`,
    },
  });
  expect(deleteAPIResponse.status()).toBe(201);
  expect(deleteAPIResponse.statusText()).toBe("Created");
});
