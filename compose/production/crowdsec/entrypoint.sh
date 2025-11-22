#!/bin/sh
set -euo pipefail

# Seed default configuration if volume is empty/missing config
if [ ! -f /etc/crowdsec/config.yaml ]; then
  mkdir -p /etc/crowdsec
  cp -a /defaults/crowdsec/. /etc/crowdsec/ || true
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


