import { Alert } from "./types"
import eventEmitter from "./eventEmitter"
import http from "./http"
import { Telegraf } from "telegraf"

require("dotenv").config()

const port = process.env.LISTEN_PORT || 3000
const botToken = process.env.BOT_TOKEN || ""
const botChatId = process.env.BOT_CHAT_ID || 0

const bot = new Telegraf(botToken)

eventEmitter.on("alert", (data: Alert) => {
  if (data.project === null) {
    data.environment = null
  }

  const messageParts = [
    "*[GlitchTip]* Error in project" +
      (data.project !== null ? ` *${data.project}*` : "") +
      (data.environment !== null ? ` at *${data.environment}*` : "") +
      ":",
    "*" + data.title.replaceAll(/[_*[\]`]/g, "\\$&") + "*",
    "",
    "`" + data.text.replaceAll(/[\`]/g, "\\$&") + "`",
    data.title_link.replaceAll(/[_*[\]`]/g, "\\$&"),
  ]

  if (data.project !== null) {
    const projectHash = data.project.replaceAll(" ", "\\_")

    messageParts.push("")
    messageParts.push(
      ` #${projectHash}` +
        (data.environment !== null
          ? ` #${data.environment} #${projectHash}\\_${data.environment}`
          : "")
    )
  }

  bot.telegram.sendMessage(botChatId, messageParts.join("\n"), {
    parse_mode: "Markdown",
    disable_web_page_preview: true,
  })
})

http.listen(port, () => {
  console.log(`Server running at http://0.0.0.0:${port}`)
})
