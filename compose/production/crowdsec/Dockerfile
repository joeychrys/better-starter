FROM docker.io/crowdsecurity/crowdsec:latest

# Add entrypoint that ensures acquis.yaml for Traefik and installs needed parsers
COPY ./compose/production/crowdsec/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Preserve image defaults to seed mounted /etc/crowdsec volume at runtime
RUN mkdir -p /defaults/crowdsec && \
    if [ -d /etc/crowdsec ]; then cp -r /etc/crowdsec/* /defaults/crowdsec/ 2>/dev/null || true; fi

ENTRYPOINT ["/entrypoint.sh"]


