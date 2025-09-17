# Stampme

Simple CLI to approve GitHub PRs via HTTP requests between friends.

## Setup

### Quick Setup (Recommended)

Run the setup script:

```bash
./setup.sh
```

### Manual Setup

1. Clone and install:
   ```bash
   git clone <this-repo>
   cd stampme
   npm install
   npm run build
   npm install -g .
   ```
2. Make sure `gh` CLI is installed and authenticated: `gh auth login`
3. Install ngrok: `npm install -g ngrok` (for internet access)
4. Set the REPO_NAME environment variable: `export REPO_NAME=owner/repo-name`

## Usage

**Set repository (required):**

```bash
export REPO_NAME=owner/repo-name
```

**Start server:**

```bash
stampme server [port]
```

**Send approval request:**

```bash
stampme approve <friend-url> <pr-number>
```

## Example Workflow

### 1. Both people set repository and start servers

Person A:

```bash
export REPO_NAME=owner/repo-name
stampme server 3000
# Server running on port 3000
```

Person B:

```bash
export REPO_NAME=owner/repo-name
stampme server 4000
# Server running on port 4000
```

### 2. Expose servers to internet with ngrok

Person A (in new terminal):

```bash
ngrok http 3000
# Gives you: https://abc123.ngrok.io
```

Person B (in new terminal):

```bash
ngrok http 4000
# Gives you: https://xyz789.ngrok.io
```

### 3. Exchange ngrok URLs and approve PRs

Person A approves PR for Person B:

```bash
stampme approve https://xyz789.ngrok.io 67
# ✅ Approval request sent
```

Person B's server automatically runs:

```bash
gh pr review 67 --approve --repo $REPO_NAME
```

### 4. Person B can approve back

```bash
stampme approve https://abc123.ngrok.io 69
# ✅ Approval request sent
```

That's it! Each person can now send PR numbers to approve on each other's behalf.

# stampme
