// Проверка на этапе `tsc`/`next build`: в каждом словаре должны быть все ключи из ru.json.
// Если ключа не хватает, здесь появится ошибка типов с указанием языка.
import ru from '../../messages/ru.json';
import uz from '../../messages/uz.json';
import tg from '../../messages/tg.json';
import hy from '../../messages/hy.json';
import az from '../../messages/az.json';
import ka from '../../messages/ka.json';
import ky from '../../messages/ky.json';
import kk from '../../messages/kk.json';
import en from '../../messages/en.json';

type Messages = typeof ru;

export const translations = { ru, uz, tg, hy, az, ka, ky, kk, en } satisfies Record<string, Messages>;
