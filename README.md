# pagar-gateway

### Resumo de funcionamento
Este microsserviço em NodeJS tem como objetivo:
- Criar novos usuários para utilização dos recursos
- Processar transações com cartões de débito ou crédito
- Visualizar todas as transações já realizadas
- Visualizar todos os recebíveis resultantes dessas transações
- Filtrar o valor total a receber ou que já foi recebido

### Estrutura de diretórios
```
    .
    ├── configs            # Dentro dessa pasta está o arquivo contendo as constantes da aplicação
    ├── server             # Arquivos contendo as configurações gerais do servidor da aplicação
    ├── src                # db, lib, models, services, utils
    └── test               # Testes unitários
```

### Chamadas
### **POST** /user - *Cadastro de usuário*
**Cadastra um usuário e gera credenciais de acesso, sendo a primeira clientid que é um uuid e clientkey sendo um hash**

body: {
	name - string contendo o nome do usuário
	email -  string contendo o email do usuário
}

>:white_check_mark: **_Retorno com sucesso_**

>**HTTP Status**
```
200
```

>**Response**
```js
{
    "clientid": "52e7fdb9-1565-45bf-ba37-1ac6b18681a4",
    "clientkey": "$2a$10$7tCJ6USYDcUaPKOjJcTwwusS2QnHj/HdM.gI5O4D3NBCYQa33oPR2"
}
```

>:x:**_Erros possíveis_**

Status  | Message
------- | -------------------------------------------
400     | Check body request
400     | Error fields
500     | There was a problem saving user


### **POST** /transactions - *Cadastro de transação*
**Processa uma transação gerando seu respectivo recebível**

headers: {
    clientid - Credêncial de acesso UUID que é retornado no cadastro de usuário
    clientkey - Credêncial de acesso Hash também retornado no cadastro de usuário
    Content-Type - application/json
}

body: {
	value - inteiro contendo o valor da transação em centavos(ex: 110,00 => 11000),
	description - string contendo a descrição do que foi comprado
	paymentMethod - string contendo o tipo do cartão(credit_card ou debit_card)
	cardNumber - string contendo o numero do cartão sem espaços
	bearerName - string contendo o nome do portador do cartão
	cardExpiration - string contendo a expiração do cartão
	cvv - string contendo o cvv do cartão 
}

>:white_check_mark: **_Retorno com sucesso_**

>**HTTP Status**
```
200
```

>**Response**
```js
{
    "value": "110.00",
    "description": "Casinha de cachorro",
    "paymentmethod": "credit_card",
    "cardnumber": "************8885",
    "bearername": "gabriel junior",
    "cardexpiration": "09/2021",
    "created_at": "2019-09-19T05:07:19.045Z"
}
```

>:x:**_Erros possíveis_**

Status  | Message
------- | -------------------------------------------
401     | Unauthorized request credentials
404     | User not found
400     | Invalid credentials
400     | Check body request
400     | Error fields
404     | Transaction not found
500     | There was a problem saving transaction
404     | Payable not found
500     | There was a problem saving payable


### **GET** /transactions - *Busca todas as transações*
**Retorna todas as transações criadas**

headers: {
    clientid - Credêncial de acesso UUID que é retornado no cadastro de usuário
    clientkey - Credêncial de acesso Hash também retornado no cadastro de usuário
    Content-Type - application/json
}

>:white_check_mark: **_Retorno com sucesso_**

>**HTTP Status**
```
200
```

>**Response**
```js
[
    {
        "value": "34.55",
        "description": "Comida de cachorro",
        "paymentmethod": "debit_card",
        "cardnumber": "************8885",
        "bearername": "gabriel junior",
        "cardexpiration": "09/2021",
        "created_at": "2019-09-18T17:34:18.535Z"
    },
    ...
]
```

>:x:**_Erros possíveis_**

Status  | Message
------- | -------------------------------------------
401     | Unauthorized request credentials
404     | User not found
400     | Invalid credentials
404     | Transaction not found
500     | There was a problem get transaction


### **GET** /payables - *Busca todos os recebíveis*
**Retorna todas os recebíveis de um usuário mostrando a data que ele ira receber e valor corrigído pela taxa**

headers: {
    clientid - Credêncial de acesso UUID que é retornado no cadastro de usuário
    clientkey - Credêncial de acesso Hash também retornado no cadastro de usuário
    Content-Type - application/json
}

>:white_check_mark: **_Retorno com sucesso_**

>**HTTP Status**
```
200
```

>**Response**
```js
[
    {
        "payable": "33.51",
        "paymentdate": "09/18/2019",
        "status": "paid",
        "created_at": "2019-09-18T17:34:18.598Z"
    },
    ...
]
```

>:x:**_Erros possíveis_**

Status  | Message
------- | -------------------------------------------
401     | Unauthorized request credentials
404     | User not found
400     | Invalid credentials
404     | Payable not found
500     | There was a problem get payable


### **GET** /payables?balance - *Busca o saldo dos recebíveis*
**Retorna o saldo com base no status do recebível podendo ser o saldo do que ele ja recebeu como também o que ainda ira receber**

headers: {
    clientid - Credêncial de acesso UUID que é retornado no cadastro de usuário
    clientkey - Credêncial de acesso Hash também retornado no cadastro de usuário
    Content-Type - application/json
}

params: {
    balance - string referente ao status(paid ou waiting_funds) dos recebíveis ao qual o usuário deseja saber o saldo
}

>:white_check_mark: **_Retorno com sucesso_**

>**HTTP Status**
```
200
```

>**Response**
```js
{
    "balance": "330.51",
    "type": "paid"
}
```

>:x:**_Erros possíveis_**

Status  | Message
------- | -------------------------------------------
401     | Unauthorized request credentials
404     | User not found
400     | Invalid credentials
404     | Payable not found
500     | There was a problem get payable


### Instalação
**Caso esteja em ambiente Windows, você deverá utilizar o terminal do Ubuntu para Windows.**

Para executar a aplicação em ambiente desenvolvimento, basta executar os seguintes comandos no terminal: 
```bash
git clone https://github.com/GabrielDuarteJr/pagar-gateway.git
npm install | yarn
```
A aplicação estará rodando em http://localhost:3000.

### Database
**O banco de dados utilizado e o postgres, portanto e necessário telo configurado na sua maquina para poder utilizar esse microsserviço**

### Testes
Com a aplicação instalada, para executar os testes unitários, utilize o comando `npm test` ou 'yarn test' no terminal.
