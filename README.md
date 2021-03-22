# whatsapp_bot

Projeto criado em [Node.js], [Typescript], [PostgreSQL] e [TypeORM] com objetivo de

## Requisitos

* [Node.js] - Nodejs 14 ou superior;
* [PostgreSQL] - Uma instância do banco Postgres ou outro banco do tipo relacional;
* Um número de telefone com whatsapp configurado e executando em um smartphone e outro que será cadastrado como responsável pelo envio de comandos ao bot.

## Instalação

Após clonar este projeto, é necessário criar um banco de dados que será utilizado no projeto. Em seguida, crie um arquivo na raiz do projeto seguindo o *.env.example* como referência, inserindo as informações para pleno funcionamento do projeto. Agora, para instalar as dependências necessárias, em seu terminal de comandos ("apontando" para o diretório do projeto) execute o comando **npm install**. Para que seu banco seja atualizado com as tabelas e dados iniciais necessários, execute o comando **npm run migrate:run**. Pronto, seu o está preparado para executar em sua máquina, execute o último comando **npm start** e aguarde a aplicação conectar-se ao banco e exibir um QRCode que deve ser escaneado utilizando o whatsapp no smartphone com o número que será utlizado pelo bot.


## Utilização

## Contato
welingtonfidelis@gmail.com
<br>
Sugestões e pull requests são sempre bem vindos 🤓 

License
----

MIT

**Free Software, Hell Yeah!**

[Node.js]: <https://nodejs.org/en/>
[TypeORM]: <https://typeorm.io/#/>
[PostgreSQL]: <https://www.postgresql.org/>
[TypeScript]: <https://www.typescriptlang.org/>
[venom-bot]: <https://www.npmjs.com/package/venom-bot>