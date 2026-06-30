async function testApi() {
    const response = await fetch("https://industryproject-backend.onrender.com/v1/media/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" })
    });
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Data:", data);
}
testApi();
