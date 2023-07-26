# Hetzner Dev Scaler

Helps you save costs by scaling down cloud servers when you're not using them.

It will always downgrade to the cheapest available option which provides the same disk size. (It will never upgrade disk size.)

Attn: Hetzner will still bill you for powered off server.

## Commands

`down`: Records a snapshot of your servers, figures out which server type to
downgrade to, down-scales and powers servers off.

`up`: Up-scales your servers to the state recorded in the snapshot file.

### Options

`--verbose` Enable verbose output (progress indicator for long-running async tasks)

### Configuration

Use `HDS_PROJECT_API_KEY` to set your Hetzner API Key.

Snapshot file location: `$HOME/hetzner-dev-scaler-snapshot.json`
