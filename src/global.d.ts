import { routing } from '@/i18n/routing';
import ru from '../messages/ru.json';

declare module 'next-intl' {
    interface AppConfig {
        Locale: (typeof routing.locales)[number];
        Messages: typeof ru;
    }
}