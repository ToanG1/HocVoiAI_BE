FROM node:20.11

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/ 

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 5001

CMD ["npm", "run", "start:prod"]