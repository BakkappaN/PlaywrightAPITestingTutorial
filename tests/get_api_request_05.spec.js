const { test, expect } = require("@playwright/test");

test("Create GET api request in playwright", async ({ request }) => {
  // create GET api request using playwright
  const getAPIResponse = await request.get("/booking/1", {});

  // validate status code
  console.log(await getAPIResponse.json());
  expect(getAPIResponse.ok()).toBeTruthy();
  expect(getAPIResponse.status()).toBe(200);
});
