#!/bin/sh
set -e

# Replace environment variables in traefik.yml
cp /etc/traefik/traefik.yml.template /etc/traefik/traefik.yml
sed -i "s|\${CROWDSEC_LAPI_KEY}|$CROWDSEC_LAPI_KEY|g" /etc/traefik/traefik.yml

# Execute the original entrypoint or command
exec /entrypoint.sh "$@"

