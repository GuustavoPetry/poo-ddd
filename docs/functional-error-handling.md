*Gustavo Petry:*
# Either - Functional Error Handling

## Classe Left<L, R>
1. propriedade readonly com tipo genérico -> L
2. construtor recebe um valor e atribui a propriedade
3. método isRigth() retorna false
4. método isLeft() retorna true

---

## Classe Rigth<L, R>
1. propriedade readonly com tipo genérico -> R
2. construtor recebe um valor e atribui a propriedade
3. método isRigth() retorna -> true
4. método isLeft() retorna -> false

---

## type Either<L, R> = Left<L, R> | Rigth<L, R>
1. tipo Either será retornado pelos serviços

---

## const left
1. arrow function
2. parâmetro tipo genérico -> L
3. retorno do tipo -> Either<L, R> 
4. retorna uma instância da classe Left

---

## const rigth
1. arrow function
2. parâmetro tipo genérico -> R
3. retorno do tipo -> Either<L, R> 
4. retorna uma instância da classe Rigth

---