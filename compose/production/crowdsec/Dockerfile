FROM docker.io/crowdsecurity/crowdsec:latest

# Add entrypoint that ensures acquis.yaml for Traefik and installs needed parsers
COPY ./compose/production/crowdsec/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Preserve image defaults to seed mounted /etc/crowdsec volume at runtime
RUN mkdir -p /defaults/crowdsec && cp -a /etc/crowdsec/. /defaults/crowdsec/

ENTRYPOINT ["/entrypoint.sh"]


