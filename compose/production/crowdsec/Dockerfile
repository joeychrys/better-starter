FROM crowdsecurity/crowdsec:latest

# Copy custom acquis.yaml, overwriting the default
COPY acquis.yaml /etc/crowdsec/acquis.yaml

# Copy appsec configuration
COPY appsec-config.yaml /etc/crowdsec/acquis.d/appsec.yaml
