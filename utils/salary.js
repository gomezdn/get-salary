import 'dotenv/config';
import fetch from 'node-fetch';

const USD_SALARY = parseInt(process.env.USD_SALARY);

const api_urls = {
  ccl: 'https://mercados.ambito.com/dolarrava/cl/variacion',
  oficial: 'https://mercados.ambito.com/dolar/oficial/variacion',
  doc: 'https://criptoya.com/api/letsbit/doc/ars',
};

async function getCclPrice() {
  const res = await (await fetch(api_urls.ccl)).json();
  if (res && res.valor) {
    return parseFloat(res.valor);
  } else {
    return null;
  }
}

async function getOficialPrice() {
  const res = await (await fetch(api_urls.oficial)).json();
  if (res && res.venta) {
    return parseFloat(res.venta);
  } else {
    return null;
  }
}

async function getDocPrice() {
  const res = await (await fetch(api_urls.doc)).json();
  if (res && res.bid) {
    return parseFloat(res.bid);
  } else {
    return null;
  }
}

export async function getSalary(retries = 3) {
  if (!USD_SALARY) {
    throw new Error('Please set a salary in USD first in .env file');
  }

  try {
    const startTime = Date.now();

    const precio_dolar_ccl = await getCclPrice();
    const precio_dolar_oficial = await getOficialPrice();
    const precio_doc = await getDocPrice();

    const bruto_en_pesos = parseFloat(precio_dolar_ccl * USD_SALARY);
    const especias_en_pesos = parseFloat(bruto_en_pesos * 0.2);
    const neto_en_pesos_sin_especias = parseFloat(
      bruto_en_pesos * 0.83 - especias_en_pesos
    );
    const cantidad_de_rdoc = parseFloat(
      (especias_en_pesos / precio_dolar_oficial).toFixed(2)
    );
    const rdoc_en_pesos = parseFloat(
      (cantidad_de_rdoc * precio_doc).toFixed(2)
    );
    const neto = parseFloat(
      (neto_en_pesos_sin_especias + rdoc_en_pesos).toFixed(2)
    );

    return {
      data: {
        precio_dolar_ccl,
        precio_dolar_oficial,
        precio_doc,
        bruto_en_pesos,
        especias_en_pesos,
        cantidad_de_rdoc,
        neto_en_pesos_sin_especias,
        rdoc_en_pesos,
        neto,
      },
      debug: {
        api_urls,
        script_execution_time: `${(Date.now() - startTime) / 1000} secs`,
      },
    };
  } catch (e) {
    if (retries) {
      console.log(`There was an error, retrying... (${retries} retries left).`);
      getSalary(retries - 1);
    } else {
      console.error(e);
      throw new Error('Failed too many times, exiting. Try again in a while');
    }
  }
}

(async function () {
  const res = await getSalary();
  console.log(res);
})();
