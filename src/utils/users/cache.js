// Function to add our give data into cache
const addCache = (name, url, value) => {
  // Converting our response into Actual Response form
  const data = new Response(JSON.stringify(value));

  if ("caches" in window) {
    // Opening given cache and putting our data into it
    caches.open(name).then((cache) => {
      console.log(cache);
      cache.put(url, data);
      alert("Data Added into cache!");
    });
  }
};

export { addCache };
