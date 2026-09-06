'use server';

// Базовые URL
const AUTH_URL = 'https://api.ozon.ru'; // для получения токена
const API_URL = 'https://api-seller.ozon.ru'; // для остальных методов

export async function getWarehouses() {
  const clientId = process.env.OZON_CLIENT_ID;
  const clientSecret = process.env.OZON_CLIENT_SECRET;

  console.log('🔑 ClientId:', clientId ? '✅ есть' : '❌ нет');
  console.log('🔑 ClientSecret:', clientSecret ? '✅ есть' : '❌ нет');

  if (!clientId || !clientSecret) {
    return { error: 'Client ID или Client Secret не настроены.' };
  }

  try {
    // 1. Получаем токен (используем api.ozon.ru)
    console.log('📤 Запрос к /v1/token на', AUTH_URL);
    const tokenRes = await fetch(`${AUTH_URL}/v1/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials',
      }),
    });

    const tokenText = await tokenRes.text();
    console.log('📥 Текст ответа токена (первые 500 символов):', tokenText.substring(0, 500));

    let tokenData;
    try {
      tokenData = JSON.parse(tokenText);
    } catch (e) {
      console.error('❌ Ошибка парсинга JSON токена:', e);
      return { error: `Ответ токена не JSON: ${tokenText.substring(0, 200)}` };
    }

    if (!tokenRes.ok) {
      return {
        error: `Ошибка токена (${tokenRes.status}): ${tokenData.error_description || tokenData.message || JSON.stringify(tokenData)}`,
      };
    }

    const accessToken = tokenData.access_token;
    if (!accessToken) {
      return { error: 'Токен не получен' };
    }
    console.log('✅ Токен получен (первые 10 символов):', accessToken.substring(0, 10));

    // 2. Запрос складов (используем api-seller.ozon.ru)
    console.log('📤 Запрос к /v2/warehouse/list на', API_URL);
    const warehouseRes = await fetch(`${API_URL}/v2/warehouse/list`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ limit: 100 }),
    });

    const warehouseText = await warehouseRes.text();
    console.log('📥 Текст ответа складов (первые 500):', warehouseText.substring(0, 500));

    let warehouseData;
    try {
      warehouseData = JSON.parse(warehouseText);
    } catch (e) {
      return { error: `Ответ складов не JSON: ${warehouseText.substring(0, 200)}` };
    }

    if (!warehouseRes.ok) {
      return {
        error: `Ошибка складов (${warehouseRes.status}): ${warehouseData.message || warehouseData.code || JSON.stringify(warehouseData)}`,
      };
    }

    const warehouses = warehouseData.warehouses || warehouseData.result?.items || [];
    return { data: warehouses };
  } catch (error) {
    console.error('❌ Исключение в getWarehouses:', error);
    if (error instanceof Error) {
      return { error: `fetch failed: ${error.message}` };
    }
    return { error: 'Неизвестная ошибка' };
  }
}