
# Diagrama de Classes - Horta Escolar

## Histórico de Versões
| Versão | Data | Descrição | Autor |
| :---: | :---: | :--- | :--- |
| **v1.0** | 09/11/2026 | Modelo conceitual de classes derivado do BD relacional| Hiago Correia de Souza |
| **v2.0** | 17/11/2026 |diagrama atualizado para POO, com novos comportamentos e dadods| Hiago Correia de Souza |
## Diagrama de Classes

```mermaid
classDiagram
    class Usuario {
        - int id
        - String nome
        - String email
        - String senha
        - List~Canteiro~ canteiros
        - List~Plantio~ plantios
        + gerenciarCanteiro()
        + registrarPlantio()
    }

    class Canteiro {
        - int id
        - String identificacao
        - String localizacao
        - float area
        - String status
        - Usuario responsavel
        - List~Plantio~ plantios
        - List~Colheita~ colheitas
    }

    class Cultura {
        - int id
        - String nome
    }

    class Plantio {
        - int id
        - LocalDate dataPlantio
        - LocalDate dataPrevista
        - float quantidade
        - String unidade
        - String status
        - List~Cultura~ culturas
        - Canteiro canteiro
        - Usuario usuario
        - List~Tarefa~ tarefas
        - List~Colheita~ colheitas
    }

    class Colheita {
        - int id
        - LocalDate dataColheita
        - float quantidadeKg
        - boolean colheitaFinal
        - String destino
        - Canteiro canteiro
        - Tarefa tarefa
        - List~Plantio~ plantios
    }

    class Tarefa {
        - int id
        - String tipo
        - LocalTime horaInicio
        - LocalTime horaFim
        - String descricao
        - String status
        - LocalDate fechaData
        - Voluntario voluntario
        - List~Plantio~ plantios
    }

    class Voluntario {
        - int id
        - String nome
        - String telefone
        - List~Tarefa~ tarefas
    }

    class Escala {
        - int id
        - Voluntario voluntario
        - Tarefa tarefa
    }

    %% Associações Diretas (POO)
    Usuario "1" --> "*" Canteiro : canteiros
    Usuario "1" --> "*" Plantio : plantios
    Canteiro "1" --> "*" Plantio : plantios
    Canteiro "1" --> "*" Colheita : colheitas
    Canteiro "*" --> "1" Usuario : responsavel
    
    Plantio "*" --> "1" Canteiro : canteiro
    Plantio "*" --> "1" Usuario : usuario
    Plantio "*" --> "*" Cultura : culturas
    Plantio "*" --> "*" Tarefa : tarefas
    Plantio "*" --> "*" Colheita : colheitas

    Colheita "*" --> "1" Canteiro : canteiro
    Colheita "*" --> "1" Tarefa : tarefa

    Voluntario "1" --> "*" Tarefa : tarefasAtribuidas
    Tarefa "*" --> "1" Voluntario : voluntario
    Escala "*" --> "1" Voluntario : voluntario
    Escala "*" --> "1" Tarefa : tarefa
```
