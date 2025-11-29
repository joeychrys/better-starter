FROM docker.io/traefik:3.3.6
RUN mkdir -p /etc/traefik/acme \
  && touch /etc/traefik/acme/acme.json \
  && chmod 600 /etc/traefik/acme/acme.json

COPY ./compose/production/traefik/entrypoint.sh /entrypoint.sh.custom
RUN chmod +x /entrypoint.sh.custom

COPY ./compose/production/traefik/traefik.yml /etc/traefik/traefik.yml.template

ENTRYPOINT ["/entrypoint.sh.custom"]
CMD ["traefik"]