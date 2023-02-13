import { Alert } from "../types"
import { createServer } from "http"
import eventEmitter from "../eventEmitter"

require("dotenv").config()

const http = createServer((request, response) => {
  if (request.method === "POST") {
    const chunks: Array<Buffer> = []

    request.on("data", (chunk) => {
      chunks.push(chunk)
    })
    request.on("end", () => {
      const data = JSON.parse(Buffer.concat(chunks).toString())

      if (data.attachments[0] !== undefined) {
        let alert: Alert = {
          project: null,
          environment: null,
          title: data.attachments[0].title,
          title_link: data.attachments[0].title_link,
          text: data.attachments[0].text,
        }

        data.attachments[0].fields.forEach(
          (item: { title: string; value: string; short: string }) => {
            switch (item.title) {
              case "Project":
                alert.project = item.value
                break

              case "Environment":
                alert.environment = item.value
                break
            }
          }
        )

        eventEmitter.emit("alert", alert)
      }
    })
  }

  response.writeHead(200, { "Content-Type": "application/json" })
  response.end(
    JSON.stringify({
      ok: true,
    })
  )
})

export default http
