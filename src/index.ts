#!/usr/bin/env node

import express from "express";
import axios from "axios";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const app = express();
app.use(express.json());

// Single endpoint: approve a PR
app.post("/approve", async (req, res) => {
  const { prNumber } = req.body;

  if (!prNumber) {
    return res.status(400).json({ error: "Missing prNumber" });
  }

  try {
    console.log(`Approving PR #${prNumber} in ${process.env.REPO_NAME}`);

    await execAsync(`gh pr review ${prNumber} --approve --repo ${process.env.REPO_NAME}`);

    console.log(`✅ Approved PR #${prNumber}`);
    return res.json({ success: true });
  } catch (error) {
    console.error(`❌ Failed: ${error}`);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: errorMessage });
  }
});

// CLI usage
const args = process.argv.slice(2);

if (args[0] === "server") {
  // Validate required environment variable
  if (!process.env.REPO_NAME) {
    console.error("❌ Error: REPO_NAME environment variable is required");
    console.error("   Set it like: REPO_NAME=owner/repo-name");
    process.exit(1);
  }
  const port = parseInt(args[1]) || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
} else if (args[0] === "approve") {
  const [friendUrl, prNumber] = args.slice(1);

  if (!friendUrl || !prNumber) {
    console.log("Usage: stampme approve <friend-url> <pr-number>");
    process.exit(1);
  }

  axios
    .post(`${friendUrl}/approve`, {
      prNumber: parseInt(prNumber),
    })
    .then(() => {
      console.log("✅ Approval request sent");
    })
    .catch((err) => {
      console.error("❌ Failed:", err.message);
      process.exit(1);
    });
} else {
  console.log("Commands:");
  console.log("  stampme server [port]          - Start approval server");
  console.log("  stampme approve <url> <pr>     - Send approval request");
}
