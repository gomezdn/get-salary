# USAGE

## GET

### /getSalary

- It will use a default usdSalary.

#### /getSalary?usdSalary=\`number\`&cclPrice=\`number\`

- You can pass a usdSalary and/or cclPrice as a query params.

##### Response:

```json
      data: {
        precio_dolar_ccl: NUMBER
        precio_dolar_oficial: NUMBER
        precio_doc: NUMBER
        bruto_en_pesos: NUMBER
        especias_en_pesos: NUMBER
        cantidad_de_rdoc: NUMBER
        neto_en_pesos_sin_especias: NUMBER
        rdoc_en_pesos: NUMBER
        neto: NUMBER
      },
      debug: {
        API_URLS: {
          ccl: STRING
          oficial: STRING
          doc: STRING
        },
        script_execution_time: STRING
      }
```
