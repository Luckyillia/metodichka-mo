import { NavItem } from '@/types/manualTypes';

export const navItems: NavItem[] = [
    { id: 'overview', title: 'Содержание', icon: '📋' },
    { id: 'lectures', title: 'Лекции', icon: '📚' },
    { id: 'training', title: 'Тренировки', icon: '🏃' },
    { id: 'events', title: 'Мероприятия', icon: '🎯' },
    { id: 'exam-rules', title: 'Правила экзаменов', icon: '📝' },
    { id: 'exam-conduct', title: 'Принятие экзаменов', icon: '✅' },
    { id: 'interview-conscript', title: 'Собеседование (Срочная)', icon: '👤' },
    { id: 'interview-contract', title: 'Собеседование (Контракт)', icon: '👥' },
    { id: 'inactive-schedule', title: 'График неактивов', icon: '📅' },
    { id: 'work-procedures', title: 'Процедуры работы', icon: '⚙️' },
    { id: 'announcements', title: 'Доска объявлений', icon: '📢' },
    { id: 'forum-rules', title: 'Правила форума', icon: '🌐' },
    { id: 'forum-responses', title: 'Ответы на форуме', icon: '💬' },
];

// Удаляем экспорт sections, так как он больше не нужен