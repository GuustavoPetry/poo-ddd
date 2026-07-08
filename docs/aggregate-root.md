# Classe Abstrata Aggregate Root

1. estende Entity<Props>
2. propriedade privada -> _domainEvents
3. getter para -> _domainEvents
4. método que recebe um DomainEvent, adiciona em _domainEvents e adiciona o agregado na lista DomainEvents.markedAggregates
5. método que limpa a propriedade _domainEvents