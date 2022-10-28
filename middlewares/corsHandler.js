const corsOriginHandler = (req, res, next) => {
  // Массив доменов, с которых разрешены кросс-доменные запросы
  const allowedCors = [
    'https://kushnerik-diplom.nomoredomains.icu',
    'http://kushnerik-diplom.nomoredomains.icu',
    'localhost:3000',
  ];

  const { origin } = req.headers; // Сохраняем источник запроса в переменную origin
  // проверяем, что источник запроса есть среди разрешённых
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  return next();
};

const corsOptionsHandler = (req, res, next) => {
  // Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  // Сохраняем тип запроса (HTTP-метод) в соответствующую переменную
  const { method } = req;
  // сохраняем список заголовков исходного запроса
  const requestHeaders = req.headers['access-control-request-headers'];

  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    // разрешаем кросс-доменные запросы с этими заголовками
    res.header('Access-Control-Allow-Headers', requestHeaders);
    // завершаем обработку запроса и возвращаем результат клиенту
    return res.end();
  }

  return next();
};

module.exports = { corsOriginHandler, corsOptionsHandler };
