FROM docker.io/crowdsecurity/crowdsec:latest

# Add entrypoint that ensures acquis.yaml for Traefik and installs needed parsers
COPY ./compose/production/crowdsec/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]


