// Файл: pages/api/proxy.js
import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import httpProxy from 'http-proxy';

// Создаем прокси-сервер
const proxy = httpProxy.createProxyServer();

export default function(req, res) {
  // Получаем полный URL из запроса
  const { query: { route } } = parse(req.url, true);

  // Проверяем, что маршрут указан
  if (!route) {
    res.statusCode = 500;
    res.end(`Error: needs a route parameter in the query.`);
    return;
  }

  // Перенаправляем запрос на сервер v2ray
  proxy.web(req, res, {
    target: `ws://your-v2ray-server.com:${route}`,
    ws: true,
  });
}

// Не забудьте обработать ошибки
proxy.on('error', function(err, req, res) {
  console.log('proxy error', err);
  res.statusCode = 500;
  res.end(`Error: an error occurred in the proxy server.`);
});
