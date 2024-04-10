// src/__tests__/characterParser.test.ts
import { describe, it, expect } from 'vitest';
import characterParser from '../utils/characterParser';
import Character from '../types/Character';

describe('characterParser', () => {
    it('returns null for null input', () => {
        expect(characterParser(null)).toBeNull();
    });

    it('parses character correctly', () => {
        const mockData = {
            literal: '字',
            unicode_str: '5b57',
            on: ['ジ', 'チ'],
            kun: ['あざ', 'あざな', 'な'],
            nanori: ['ひろ'],
            meanings: ['character', 'letter', 'word'],
            one_word_meaning: 'character',
            stroke_count: 6,
            freq: 150,
            grade: 2,
            jlpt: 5,
            compounds: ['字典 (じてん)'],
            parts: ['宀', '子'],
            radicals: [{ value: 1 }, { value: 2 }],
        };

        const expected: Character = {
            unicode: '字',
            unicode_str: '5b57',
            on: ['ジ', 'チ'],
            kun: ['あざ', 'あざな', 'な'],
            nanori: ['ひろ'],
            radicals: [1, 2],
            english: ['character', 'letter', 'word'],
            one_word_meaning: 'character',
            stroke_count: 6,
            freq: 150,
            grade: 2,
            jlpt: 5,
            compounds: ['字典 (じてん)'],
            parts: ['宀', '子'],
        };

        expect(characterParser(mockData)).toEqual(expected);
    });


});
