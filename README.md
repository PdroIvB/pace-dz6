<p align="center"><a href="https://github.com/PdroIvB/pace-dz6" target="_blank"><img src="storage\app\public\logopace.png" width="400" alt="Laravel Logo"></a></p>

# Sobre o Projeto

P.A.C.E. - Produção e Acompanhamento de Controle Eficiente </br>

É um software criado, a princípio, para disciplina de Prática Profissional> Projeto de Software do grupo 36. </br>

A ideia do sistema é ser uma ferramenta de gerenciamento de software segundo a metodologia ágil Kanban. Onde um gestor poderia criar uma Área de Trabalho (quadro)
e convidar colaboradores para criar e organizar cartões (tarefas). </br>

# Rodando

## Dependências

### Download e instalação

Antes de começarmos a trabalhar no projeto, temos que instalar as dependências primeiro.</br>
Vamos começar instalando os pré-clone, que consistem em dependências muito importantes para o bom funcionamento futuro do projeto.

#### Pré Clone

 - [NPM](https://nodejs.org/en) </br>
 - [git](https://git-scm.com/) </br>
 - [Composer](https://getcomposer.org/download/) </br>
 - [PHP](https://www.php.net/) </br>
 - [MySQL](https://www.mysql.com/) </br>

---

## Clonando

Acesse o GitHub na página do projeto. Assim que a página carregar, procure por um botão escrito <b>Code</b>. Clicando sobre ele, você verá as siglas HTTPS, onde encontrará o link que deverá ser copiado.

No terminal digite o seguinte comando: </br>
```shell
git clone *link https*
```

Aguarde até o projeto ser clonado em sua máquina e, em seguida, entre na pasta do arquivo.</br>
```shell
cd pace-dz6
```

## Instalação

### Diretorio /full-stack-test

---

No terminal:</br>
```shell
composer install
```
Aguarde ate finalizar e digite</br>
```shell
 npm install
```

---

## Configurações

### Arquivos .ENV

---

Copie o .env.example para um .env apropriado </br>
```shell
cp .env.example .env
```

#### .ENV do Back 

Preencha as credenciais, principalmente da conexão com o banco de dados (crie um banco de dados no seu servidor para o projeto)

` DB_CONNECTION=mysql ` </br>
` DB_HOST=127.0.0.1 ` </br>
` DB_PORT=3306 ` </br>
` DB_DATABASE=laravel ` </br>
` DB_USERNAME=root ` </br>
` DB_PASSWORD= ` </br>

---

## Criando o banco de dados

Agora com a conxão configurada, na pasta raiz do projeto, você pode rodar:
```shell
php artisan migrate:fresh
```

Assim você terá toda a estrutura novinha do banco de dados.

# Rodando o projeto!

Para rodar o projeto agora, basta, nas pasta raiz `/` rodar o comando:

```shell
php artisan serve
```

E o comando:

```shell
npm run dev
```

E tanto o front quando o back devem estar funcionando. </br>
Agora basta acessar seu navegador em ` http://localhost:8000 `
