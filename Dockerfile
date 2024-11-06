FROM 615299758656.dkr.ecr.ap-northeast-2.amazonaws.com/node:latest

WORKDIR /app

COPY package*.json ./
COPY yarn.lock ./

COPY .pnp.cjs ./
COPY .yarnrc.yml ./
COPY .pnp.loader.mjs ./

COPY .yarn/releases ./
COPY .yarn/sdks ./

COPY . .


RUN yarn cache clean --all
RUN yarn set version stable
RUN yarn install
RUN yarn build


EXPOSE 8080

# Start the application
CMD ["yarn", "start", "-p", "8080"]
