#!/bin/sh
set -euo pipefail

# Seed default configuration if volume is empty/missing config
if [ ! -f /etc/crowdsec/config.yaml ]; then
  mkdir -p /etc/crowdsec
  cp -a /defaults/crowdsec/. /etc/crowdsec/ || true
fi

# If config.yaml still missing, generate a minimal default
if [ ! -f /etc/crowdsec/config.yaml ]; then
  mkdir -p /var/log/crowdsec /var/lib/crowdsec/data /etc/crowdsec/hub
  cat > /etc/crowdsec/config.yaml <<'YAML'
common:
  daemonize: false
  log_media: file
  log_level: info
  log_dir: /var/log/crowdsec

config_paths:
  config_dir: /etc/crowdsec
  data_dir: /var/lib/crowdsec/data
  db_path: /var/lib/crowdsec/data/crowdsec.db
  hub_dir: /etc/crowdsec/hub
  simulation_path: /etc/crowdsec/simulation.yaml
  acquis_path: /etc/crowdsec/acquis.yaml

cscli:
  output: human
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

# Update hub and ensure traefik collection is installed
cscli hub update || true
cscli hub install crowdsecurity/traefik || true

exec /usr/local/bin/crowdsec -c /etc/crowdsec/config.yaml


