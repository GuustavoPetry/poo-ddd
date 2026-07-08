# Domain Events - Publish/Subscriber

## Funcionamento Geral

### Existem 2 propriedades principais, são elas:

1. markedAggregates: AggregateRoot<any>[]

- lista de entidades agregadas que foram instanciadas e estão disponíveis para serem disparadas

2. handlersMap: Record<string, DomainEventCallback[]>

- Map com chave string (nome da classe do evento) e valor lista de métodos a serem executados quando o agregado for salvo no repositório

---

## Instanciação do Agregado

- ao criar uma instância de um agregado, é chamado o método do agregado que recebe uma classe do tipo DomainEvent como parâmetro, e adiciona a propriedade domainEvents do agregado, e também executa o método da classe DomainEvents que adiciona o agregado na propriedade markedAggregates.

---

## Salvo no Repositório

- após o repositório criar o agregado no banco de dados, é chamado o métode de DomainEvents que percorre todos os itens da propriedade domainEvents (agregado) e para cada item faz uma verificação se o nome do construtor do objeto é uma chave na propriedade handlersMap. Se existir uma chave na propriedade handlersMap, executa todos os DomainEventCallback (lista) que estão como valor da chave -> constructor.name (item propriedade domainEvents do agregado)

---

## Funções Principais

1. Registrar chave (constructor.name) e valor (DomainEventCallback) na propriedade handlersMap (utilizado no subscriber, representa os metódos a serem executados para cada evento)

- caso não existir uma chave para determinado evento, criar uma com valor -> []
- adicionar o callback no valor da chave

2. Adicionar agregado na propriedade markedAggregates

- verifica se o agregado já existe na lista
- se não existir, adiciona o agregado na lista

3. Disparar todos os eventos do agregado

- se o agregado estiver na propriedade markedAggregates, disparar todos os eventos do agregado, limpar o propriedade domainEvents do agregado, remover o agregado da propriedade markedAggregates

---

## Funções Auxiliares

1. Buscar um agregado por ID na propriedade markedAggregates

2. Remover um agregado da propriedade markedAggregates

3. Disparar um único evento (DomainEvent)

- captura o constructor.name do evento
- se existir uma chave para esse evento na propriedade handlersMap, executa todos os callbacks da chave

4. Disparar todos os DomainEvent do agregado

- para cada item da propriedade domainEvents do agregado, executar a função que dispara um único evento

5. limpar a propriedade handlersMap

6. limpar a propriedade markedAggregates

---