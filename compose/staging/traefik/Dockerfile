FROM docker.io/traefik:3.3.5
COPY ./compose/staging/traefik/traefik.yml /etc/traefik/
ENTRYPOINT ["traefik", "--configFile=/etc/traefik/traefik.yml"]