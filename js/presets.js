/**
 * presets.js
 * База данных всех шейков и их параметров.
 */

// 1. Список всех ID шейков (для рандомайзера и проверок)
window.allShakes = [
    // SOFT
    'soft-shake-1', 'soft-shake-2', 'soft-shake-3', 'soft-shake-4', 'soft-shake-5',
    'soft-shake-6', 'soft-shake-7', 'soft-shake-8', 'soft-shake-9', 'soft-shake-10',
    'soft-shake-11', 'soft-shake-12', 'soft-shake-13', 'soft-shake-14', 'soft-shake-15',
    // HARD
    'hard-shake-1', 'hard-shake-2', 'hard-shake-3', 'hard-shake-4', 'hard-shake-5',
    'hard-shake-6', 'hard-shake-7', 'hard-shake-8', 'hard-shake-9', 'hard-shake-10',
    'hard-shake-11', 'hard-shake-12', 'hard-shake-13', 'hard-shake-14', 'hard-shake-15',
    // DIRTY
    'dirty-shake-1', 'dirty-shake-2', 'dirty-shake-3', 'dirty-shake-4', 'dirty-shake-5',
    'dirty-shake-6', 'dirty-shake-7', 'dirty-shake-8', 'dirty-shake-9', 'dirty-shake-10',
    'dirty-shake-11', 'dirty-shake-12', 'dirty-shake-13', 'dirty-shake-14', 'dirty-shake-15',
    // FAST
    'fast-shake-1', 'fast-shake-2', 'fast-shake-3', 'fast-shake-4', 'fast-shake-5',
    'fast-shake-6', 'fast-shake-7', 'fast-shake-8', 'fast-shake-9', 'fast-shake-10',
    'fast-shake-11', 'fast-shake-12', 'fast-shake-13', 'fast-shake-14', 'fast-shake-15',
];

// 2. Параметры для визуального превью (freq - частота, amp - амплитуда)
window.shakeParams = {
    // ================= SOFT =================
    'soft-shake-1':  { freq: 4.7,  amp: 1.3 },
    'soft-shake-2':  { freq: 5.9,  amp: 2.6 },
    'soft-shake-3':  { freq: 5.9,  amp: 5.0 },
    'soft-shake-4':  { freq: 5.0,  amp: 1.2 },
    'soft-shake-5':  { freq: 4.0,  amp: 1.3 },
    'soft-shake-6':  { freq: 6.0,  amp: 2.3 },
    'soft-shake-7':  { freq: 3.0,  amp: 1.0 },
    'soft-shake-8':  { freq: 5.5,  amp: 1.6 },
    'soft-shake-9':  { freq: 2.0,  amp: 2.6 },
    'soft-shake-10': { freq: 5.0,  amp: 2.3 },
    'soft-shake-11': { freq: 6.0,  amp: 3.2 },
    'soft-shake-12': { freq: 6.5,  amp: 3.3 },
    'soft-shake-13': { freq: 4.0,  amp: 2.5 },
    'soft-shake-14': { freq: 5.0,  amp: 1.0 },
    'soft-shake-15': { freq: 4.0,  amp: 2.8 },

    // ================= HARD =================
    'hard-shake-1':  { freq: 6.4,  amp: 3.6 },
    'hard-shake-2':  { freq: 4.7,  amp: 1.3 },
    'hard-shake-3':  { freq: 3.4,  amp: 2.5 },
    'hard-shake-4':  { freq: 10.0, amp: 2.0 },
    'hard-shake-5':  { freq: 5.0,  amp: 3.2 },
    'hard-shake-6':  { freq: 7.0,  amp: 2.7 },
    'hard-shake-7':  { freq: 4.0,  amp: 2.6 },
    'hard-shake-8':  { freq: 8.0,  amp: 3.2 },
    'hard-shake-9':  { freq: 6.0,  amp: 3.0 },
    'hard-shake-10': { freq: 7.0,  amp: 2.7 },
    'hard-shake-11': { freq: 8.0,  amp: 2.8 },
    'hard-shake-12': { freq: 10.0, amp: 2.7 },
    'hard-shake-13': { freq: 12.0, amp: 3.1 },
    'hard-shake-14': { freq: 9.0,  amp: 3.1 },
    'hard-shake-15': { freq: 10.0, amp: 3.2 },

    // ================= DIRTY =================
    'dirty-shake-1':  { freq: 3.1,  amp: 3.2 },
    'dirty-shake-2':  { freq: 17.1, amp: 3.7 },
    'dirty-shake-3':  { freq: 14.0, amp: 3.8 },
    'dirty-shake-4':  { freq: 17.0, amp: 3.9 },
    'dirty-shake-5':  { freq: 9.0,  amp: 3.1 },
    'dirty-shake-6':  { freq: 8.0,  amp: 3.4 },
    'dirty-shake-7':  { freq: 11.0, amp: 2.7 },
    'dirty-shake-8':  { freq: 13.0, amp: 2.9 },
    'dirty-shake-9':  { freq: 11.0, amp: 2.9 },
    'dirty-shake-10': { freq: 12.0, amp: 3.2 },
    'dirty-shake-11': { freq: 12.0, amp: 3.2 },
    'dirty-shake-12': { freq: 11.0, amp: 2.9 },
    'dirty-shake-13': { freq: 13.0, amp: 3.2 },
    'dirty-shake-14': { freq: 11.0, amp: 3.4 },
    'dirty-shake-15': { freq: 10.0, amp: 3.5 },

    // ================= FAST =================
    'fast-shake-1':  { freq: 9.0,  amp: 2.6 },
    'fast-shake-2':  { freq: 23.0, amp: 1.6 },
    'fast-shake-3':  { freq: 20.0, amp: 0.6 },
    'fast-shake-4':  { freq: 14.0, amp: 1.0 },
    'fast-shake-5':  { freq: 12.0, amp: 1.3 },
    'fast-shake-6':  { freq: 9.0,  amp: 2.5 },
    'fast-shake-7':  { freq: 18.0, amp: 2.3 },
    'fast-shake-8':  { freq: 10.0, amp: 1.6 },
    'fast-shake-9':  { freq: 9.0,  amp: 3.2 },
    'fast-shake-10': { freq: 9.0,  amp: 3.3 },
    'fast-shake-11': { freq: 13.0, amp: 3.1 },
    'fast-shake-12': { freq: 12.0, amp: 3.1 },
    'fast-shake-13': { freq: 7.0,  amp: 2.0 },
    'fast-shake-14': { freq: 9.0,  amp: 2.9 },
    'fast-shake-15': { freq: 11.0, amp: 3.1 },
};