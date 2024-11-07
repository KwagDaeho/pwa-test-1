# FROM 615299758656.dkr.ecr.ap-northeast-2.amazonaws.com/node:latest
# 여거는 더블랙에서 도커 허브의 유료정책 떄문에 별도로 노드 이미지를 빌드해서 ecr ( 엘라 컨테이너 레지스트리 ) 에 올려뒀던 거
FROM node:21-alpine
# FROM public.ecr.aws/docker/library/node:lts-slim

WORKDIR /app

# 도커 최적화 - 나중에 필요한것만 남기고 전체카피 제거하기
# COPY package*.json ./
# COPY yarn.lock ./
# COPY .pnp.cjs ./
# COPY .yarnrc.yml ./
# COPY .pnp.loader.mjs ./
# COPY .yarn/releases ./
# COPY .yarn/sdks ./

COPY . .

RUN yarn cache clean --all
RUN yarn set version stable
RUN yarn install
RUN yarn build

EXPOSE 80
# Start the application
CMD ["yarn", "start", "-p", "80"]
