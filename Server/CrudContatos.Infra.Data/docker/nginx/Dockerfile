# Nginx como proxy reverso central da aplicacao.
# Recebe todas as requisicoes na porta 8082 e roteia:
#   /api/* → backend:8080
#   /*     → frontend:80
# A config e montada via volume no docker-compose (nao precisa rebuildar a imagem para mudar rotas).
FROM nginx:alpine

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
