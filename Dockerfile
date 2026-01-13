# region help-files
FROM node:22.15.0-alpine AS help-files_stats
WORKDIR /app

COPY helpers/purify-package-lock.js helpers/
COPY package.json package-lock.json ./
COPY libs/common/package.json libs/common/
COPY apps/stats/package.json apps/stats/

RUN node helpers/purify-package-lock.js
RUN npm i --package-lock-only --ignore-scripts


FROM node:22.15.0-alpine AS help-files_package-jsons
WORKDIR /app

COPY helpers/make-docker-package-jsons.js helpers/
COPY package.json ./
COPY libs/common/package.json libs/common/
COPY apps/stats/package.json apps/stats/

RUN node helpers/make-docker-package-jsons.js


FROM scratch AS help-files
WORKDIR /app

COPY --from=help-files_stats /app/package-lock.json package-lock-stats.json

COPY --from=help-files_package-jsons /app/docker-*package.json ./
COPY --from=help-files_package-jsons /app/libs/common/docker-*package.json libs/common/
COPY --from=help-files_package-jsons /app/apps/stats/docker-*package.json apps/stats/
# endregion


FROM node:22.15.0-alpine AS stats
WORKDIR /app

COPY --from=help-files /app/package-lock-stats.json package-lock.json
COPY --from=help-files /app/docker-package.json package.json
COPY --from=help-files /app/libs/common/docker-package.json libs/common/package.json
COPY --from=help-files /app/apps/stats/docker-package.json apps/stats/package.json

COPY helpers/start-checks.js helpers/check-package-versions.js helpers/
COPY helpers/modify-node-modules helpers/modify-node-modules
COPY .nvmrc .

RUN npm ci

COPY tsconfig.json ./
COPY libs/common/src libs/common/src
COPY apps/stats apps/stats
COPY --from=help-files /app/docker-build-package.json package.json
COPY --from=help-files /app/apps/stats/docker-build-package.json apps/stats/package.json

RUN npm run stats:ts:noWatch

ENTRYPOINT npm run stats:start
