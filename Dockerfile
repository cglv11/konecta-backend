FROM node:alpine AS builder

# Declaring env
ENV NODE_ENV production

# Setting up the work directory
WORKDIR /app

# Copying all the files in our project
COPY . .

# Installing dependencies
RUN npm install --force

# Generate Prisma client
RUN npx prisma generate

# Default command to start the app
CMD ["npm", "start"]