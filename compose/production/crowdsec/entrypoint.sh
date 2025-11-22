#!/bin/sh
set -euo pipefail

# Ensure config dirs exist even if the named volume starts empty
mkdir -p /etc/crowdsec /etc/crowdsec/acquis.d

# Seed default configuration if volume is empty/missing config
if [ ! -f /etc/crowdsec/config.yaml ]; then
  mkdir -p /etc/crowdsec
  cp -a /defaults/crowdsec/. /etc/crowdsec/ || true
fi

# If config.yaml still missing, generate a sane default from upstream template
if [ ! -f /etc/crowdsec/config.yaml ]; then
  mkdir -p /var/log/crowdsec /var/lib/crowdsec/data /etc/crowdsec/hub /etc/crowdsec/acquis.d
  cat > /etc/crowdsec/config.yaml <<'YAML'
common:
  daemonize: false
  log_media: file
  log_level: info
  log_dir: /var/log/crowdsec
  log_max_size: 20
  compress_logs: true
  log_max_files: 10

config_paths:
  config_dir: /etc/crowdsec
  data_dir: /var/lib/crowdsec/data
  simulation_path: /etc/crowdsec/simulation.yaml
  hub_dir: /etc/crowdsec/hub
  index_path: /etc/crowdsec/hub/.index.json
  notification_dir: /etc/crowdsec/notifications
  plugin_dir: /usr/local/lib/crowdsec/plugins

crowdsec_service:
  acquisition_path: /etc/crowdsec/acquis.yaml
  acquisition_dir: /etc/crowdsec/acquis.d
  parser_routines: 1

cscli:
  output: human
  color: auto

db_config:
  log_level: info
  type: sqlite
  db_path: /var/lib/crowdsec/data/crowdsec.db
  flush:
    max_items: 5000
    max_age: 7d

plugin_config:
  user: nobody
  group: nogroup

api:
  client:
    insecure_skip_verify: false
    credentials_path: /etc/crowdsec/local_api_credentials.yaml
  server:
    log_level: info
    listen_uri: 0.0.0.0:8080
    profiles_path: /etc/crowdsec/profiles.yaml
    console_path: /etc/crowdsec/console.yaml
    online_client:
      credentials_path: /etc/crowdsec/online_api_credentials.yaml
    trusted_ips:
      - 127.0.0.1
      - ::1

prometheus:
  enabled: true
  level: full
  listen_addr: 0.0.0.0
  listen_port: 6060
YAML
fi

# If no acquis.yaml exists, create a default one for Traefik access logs
if [ ! -f /etc/crowdsec/acquis.yaml ]; then
  mkdir -p /etc/crowdsec
  cat > /etc/crowdsec/acquis.yaml <<'YAML'
filenames:
  - /var/log/traefik/access.log
labels:
  type: traefik
YAML
fi

# Update hub and ensure required collections are installed
cscli hub update || true

# Always ensure the Traefik collection is present
cscli hub install crowdsecurity/traefik || true

# Optionally install additional collections provided via env (space separated)
if [ -n "${COLLECTIONS:-}" ]; then
  # shellcheck disable=SC2086
  for collection in $COLLECTIONS; do
    cscli collections install "$collection" || true
  done
fi

exec /usr/local/bin/crowdsec -c /etc/crowdsec/config.yaml


