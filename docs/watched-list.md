# Watched List

## Possui 4 propriedades, são elas:

1. currentItems: T[] -> itens atuais, pode alterar
2. initialItems: T[] -> itens iniciais, nunca altera
3. newItems: T[] -> itens novos
4. removedItems: T[] -> itens removidos

---

## Construtor é responsável por definir valores iniciais para as propriedades

---

## Método abstrato que recebe 2 valores com tipo genérico e retorna se os valores são iguais (boolean)

---

## Metódos Getter para as propriedades

---

## Métodos que verificam se um item está em: current, initial, new, removed

---

## Métodos que removem um item de: current, new, removed

---

## Metódo que adiciona um item

1. se estiver em removedItems, remove dos removidos
2. se não estiver em newItems e não estiver em initialItems, adiciona em newItems
3. se não estiver em currentItems, adiciona em currentItems

---

## Método que remove um item

1. remove de currentItems
2. se estiver em newItem, remove de newItem e encerra execução
3. se não estiver em removedItems, adicionar em removedItems

---

## Método que atualiza a lista

1. constante newItems -> filtra os itens do parâmetro que não estão em currentItems
2. constante removedItems -> filtra os itens de currentItems que não estão no parâmetro
3. define valores de current, new, removed

---