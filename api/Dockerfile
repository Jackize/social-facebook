FROM node:16.17.1-alpine

ENV PORT=8080
ENV NODE_ENV=development
ENV SECRET='ecret'
ENV DATABASE_URL='postgresql://postgres:123456@172.17.0.2:5432/postgres'
ENV CLOUD_NAME='dpbhp5ury'
ENV CLOUD_API_KEY='168921146788365'
ENV CLOUD_API_SECRET='xyGefjjzHufGEcQDwyyjNUrR1tk'
ENV OPENAI_API_KEY='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'
ENV GOOGLE_CLIENT_ID='454362861673-tbo8m2u7g0mi5ohend7t99esivot2t9a.apps.googleusercontent.com'
ENV GOOGLE_CLIENT_SECRET='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'
ENV URL_FE='http://localhost:8080'
ENV URL_BE='http://localhost:8080'

WORKDIR /app
COPY . .
EXPOSE 8080
RUN npm install --production=false
CMD ["npm","run", "start"]
