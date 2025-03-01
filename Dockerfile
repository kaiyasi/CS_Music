FROM node:18-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install

# 執行部署指令
RUN node deploy/deployGlobal.js

CMD [ "node", "index.js" ]
