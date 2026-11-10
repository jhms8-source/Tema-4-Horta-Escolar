
# Diagrama de Classes - Horta Escolar

## Histórico de Versões
| Versão | Data | Descrição | Autor |
| :---: | :---: | :--- | :--- |
| **v1.0** | 09/11/2026 | Modelo conceitual de classes derivado do BD relacional| Hiago Correia de Souza |
| **v2.0** | 10/11/2026 | adição do método cadastrar () na classe usuário | Hiago Correia de Souza |
## Diagrama de Classes

```mermaid
classDiagram
    class Usuario {
        +int id_usuario PK
        +string nome
        +string email
        +string senha
        +cadastrar () boolean 
    }

    class Canteiro {
        +int id_canteiro PK
        +string identificacao
        +string localizacao
        +float area
        +string status
        +int id_usuario FK
    }

    class Cultura {
        +int id_cultura PK
        +string nome
    }

    class Plantio {
        +int id_plantio PK
        +date data_plantio
        +date data_prevista
        +float quantidade
        +string unidade
        +string status
        +int id_cultura FK
        +int idCanteiro FK
        +int id_usuario FK
    }

    class PlantioCultura {
        +int id_plantio PK, FK
        +int id_cultura PK, FK
    }

    class Colheita {
        +int id_colheita PK
        +date data_colheita
        +float quantidade_kg
        +boolean colheita_final
        +string destino
        +int idCanteiro FK
        +int id_tarefa FK
        +int idcolheita FK
    }

    class PlantioColheita {
        +int id_plantio PK, FK
        +int id_colheita PK, FK
    }

    class Tarefa {
        +int id_tarefa PK
        +string tipo
        +time hora_inicio
        +time hora_fim
        +string descricao
        +string status
        +date fecha_data
        +int id_voluntario FK
    }

    class PlantioTarefa {
        +int id_plantio PK, FK
        +int id_tarefa PK, FK
    }

    class Voluntario {
        +int id_voluntario PK
        +string nome
        +string telefone
    }

    class Escala {
        +int id_escala PK
        +int id_voluntario FK
        +int id_tarefa FK
    }

    %% Ligacoes com Cardinalidades da Imagem Original
    Usuario "1" -- "0..*" Canteiro : gerencia / cadastra
    Usuario "1" -- "0..*" Plantio : registra
    Canteiro "1" -- "0..*" Plantio : contem
    Cultura "1" -- "0..*" Plantio : baseia

    Plantio "1" -- "0..*" PlantioCultura : possui
    Cultura "1" -- "0..*" PlantioCultura : associada

    Plantio "0..*" -- "0..*" PlantioColheita : gera
    Colheita "1" -- "0..*" PlantioColheita : pertence

    Canteiro "1" -- "0..*" Colheita : realiza
    Tarefa "1" -- "0..*" Colheita : gera

    Plantio "0..*" -- "0..*" PlantioTarefa : requer
    Tarefa "1" -- "0..*" PlantioTarefa : executa

    Voluntario "1" -- "0..*" Tarefa : realiza
    Voluntario "1" -- "0..*" Escala : participa
    Tarefa "1" -- "0..*" Escala : agendada
```
