FROM node:20-alpine AS builder

WORKDIR /app

# O .npmrc precisa vir junto: o projeto depende de legacy-peer-deps para
# resolver reactstrap 8 / bootstrap 4 com React 18.
COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .

# O Vite resolve as variaveis VITE_* em tempo de build, por isso a URL da API
# entra como build arg e nao como variavel de ambiente do container.
ARG VITE_API_URL=https://api.caxiaslixozero.com.br
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:1.27-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# 127.0.0.1 e nao localhost: dentro do container o localhost resolve para ::1 e
# o nginx escuta apenas em IPv4.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
