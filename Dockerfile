# region help-files
FROM node:22.15.0-alpine AS help-files_stats
WORKDIR /app

COPY helpers/purify-package-lock.js helpers/
COPY package.json package-lock.json ./
COPY packages/common/package.json packages/common/
COPY projects/stats/package.json projects/stats/

RUN node helpers/purify-package-lock.js
RUN npm i --package-lock-only --ignore-scripts


FROM node:22.15.0-alpine AS help-files_package-jsons
WORKDIR /app

COPY helpers/make-docker-package-jsons.js helpers/
COPY package.json ./
COPY packages/common/package.json packages/common/
COPY projects/stats/package.json projects/stats/

RUN node helpers/make-docker-package-jsons.js


FROM scratch as help-files
WORKDIR /app

COPY --from=help-files_stats /app/package-lock.json package-lock-stats.json

COPY --from=help-files_package-jsons /app/docker-*package.json ./
COPY --from=help-files_package-jsons /app/packages/common/docker-*package.json packages/common/
COPY --from=help-files_package-jsons /app/projects/stats/docker-*package.json projects/stats/
# endregion


FROM node:22.15.0-alpine AS stats
WORKDIR /app

COPY --from=help-files /app/package-lock-stats.json package-lock.json
COPY --from=help-files /app/docker-package.json package.json
COPY --from=help-files /app/packages/common/docker-package.json packages/common/package.json
COPY --from=help-files /app/projects/stats/docker-package.json projects/stats/package.json

COPY helpers/start-checks.js helpers/check-package-versions.js helpers/
COPY helpers/modify-node-modules helpers/modify-node-modules
COPY .nvmrc .

RUN npm ci

COPY tsconfig.json ./
COPY packages/common/src packages/common/src
COPY projects/stats projects/stats
COPY --from=help-files /app/docker-build-package.json package.json
COPY --from=help-files /app/projects/stats/docker-build-package.json projects/stats/package.json

RUN npm run stats:ts:noWatch

ENTRYPOINT npm run stats:start
