# teste-tecnico-backend-senior-2025-trimestre-1
Teste técnico para a posição de Backend Dev Sênior. Edição do primeiro trimestre de 2025.

## A proposta: Upload e Exibição de Imagens + Cache + Testes + Docker + Terraform

A ideia é bem simples:

- [ ] uma rota `POST /upload/image` que recebe uma **única imagem** com limite de 5MB e
    - [ ] compacta a imagem para reduzir o tamanho do arquivo salvo
    - [ ] retorna o código de status 400 em caso de arquivo com tipo diferente de imagem (png, jpg, webp)
    - [ ] retorna o código de status 413 em caso de arquivo com tamanho maior que 5MB
    - [ ] retorna o código de status 204 em caso de sucesso
- [ ] uma rota `GET /static/image/:filename` e
    - [ ] retornando o código de status 404 em caso de não existência de um arquivo
    - [ ] retornando a imagem com status 200 em caso de o arquivo existir no servidor

Para infra, vamos usar o seguinte conjunto:

- [ ] um arquivo `Dockerfile` para fazer o build da imagem a partir da imagem `node:22-alpine`;
- [ ] implementação de Terraform + provider voltado para o docker para subir os contêineres **localmente**.
- [ ] Ainda na implementação do Terraform, implementar duas instâncias da aplicação + um proxy reverso de sua escolha + um servidor de caching em memória.

Para testes, buscamos:

- [ ] Testes unitários
- [ ] Testes de integração (e2e)
- [ ] Testes de estresse de endpoints (use a ferramenta que preferir)

## Pontos de Qualidade

- A ideia inicial é que os arquivos sejam armazenados dentro do volume do container da aplicação, **mas que exista possibilidade de intercambiar o sistema de arquivos com um sistema externo, como por exemplo o AWS S3 (não necessário para o teste, apenas a intercambialidade)**
- Teremos um cache de 60s de TTL para cada arquivo.
- O arquivo deve estar disponível antes mesmo de ser persistido no sistema de arquivos.
- O arquivo só deve ser lido a partir do sistema de arquivos se não houver cache válido para o mesmo.

## Restrições ao código-fonte do Aplicativo.

A única limitação é o uso requerido da runtime `node.js` e/ou extensões voltadas ao TypeScript, como por exemplo o `ts-node`, lib que fornece uma CLI para transpilar typescript e executar o resultado final usando node.

Você tem total liberdade para usar as demais bibliotecas que mais lhe fornecerem produtividade.

Acaso você esteja utilizando este projeto como um meio de estudo, nós o aconselhamos a usar a biblioteca padrão para lidar com requisições web do Node.js, `http`.

## O que estamos avaliando

Este teste busca avaliar as seguintes competências:

- Capacidade de aplicação pertinente de Design Patterns;
- Capacidade de interação com APIs de sistema;
- Capacidade de desenvolver soluções que usam o conceito de concorrência para extrair maior desempenho do hardware;
- Domínio sobre a linguagem JavaScript;
- Domínio sobre a runtime `node.js`;
- Capacidade de organização de código (Adendo: organize da forma que for mais familiarizado, não estamos olhando para a estrutura de pastas, mas sim para a coesão e o desacoplamento) e
- Capacidade de lidar com imagens e contêineres Docker.
- Capacidade de lidar com infraestrutura como código (IaC).
