// Function to add our give data into cache
const addCache = async (name, url, value) => {
  // Converting our response into Actual Response form
  const data = new Response(JSON.stringify(value));

  if ("caches" in window) {
    // Opening given cache and putting our data into it
    await caches.open(name).then(async (cache) => {
      await cache.put(url, data);
    });
  }
};

export { addCache };
