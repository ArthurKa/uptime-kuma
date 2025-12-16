#!/bin/sh -e

deployStats() {
  docker compose --profile stats build &&
  docker compose --profile stats up -d &&
  docker exec nginx-certbot nginx -s reload &&
  docker image prune -f &&
  docker builder prune -f --keep-storage 3GB &&
  true
}
deployAll() {
  docker compose --profile all build &&
  docker compose --profile all up -d &&
  docker exec nginx-certbot nginx -s reload &&
  docker image prune -f &&
  docker builder prune -f --keep-storage 3GB &&
  true
}

# Run function with name provided in $1
set +x
if [ "$1" != "" ]; then
  command="$(echo $1|tr '-' '_')"
  shift
else command="default"; fi
if (type "$command" >/dev/null 2>&1) && \
  [ "$(echo $command | cut -c -1)" != "_" ]; then
  set -x
  $command "$@"
else
  echo "Command \"$command\" not found."
  exit 1
fi
