FROM node:18-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

# 跳過部署步驟，避免出錯
# RUN npm run deploy

CMD [ "node", "index.js" ]
