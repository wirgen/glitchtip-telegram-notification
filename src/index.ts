import { Alert } from "./types"
import eventEmitter from "./eventEmitter"
import http from "./http"

require("dotenv").config()

const port = process.env.LISTEN_PORT || 3000

eventEmitter.on("alert", (data: Alert) => {
  console.log(data)
})

http.listen(port, () => {
  console.log(`Server running at http://0.0.0.0:${port}`)
})
