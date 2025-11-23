// Test the block user API
async function testBlockAPI() {
  try {
    console.log("Testing GET /api/admin/block-user...")
    const getRes = await fetch("http://localhost:3002/api/admin/block-user")
    const getData = await getRes.json()
    console.log("GET Response:", getRes.status, getData)
  } catch (error) {
    console.error("Test error:", error)
  }
}

testBlockAPI()
