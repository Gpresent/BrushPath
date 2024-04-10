import { describe, it, expect, vi } from 'vitest';
import getCoordsMax from '../coord-utils/getCoordsMax';
import getTotalLengthAllPaths from '../coord-utils/getTotalLengthAllPaths';
import inside from '../coord-utils/inside';

describe('getCoordsMax', () => {
    it('should return the maximum value for the specified index', () => {
        const coords = [
            [1, 2],
            [3, 4],
            [5, 6],
        ];
        const index = 0; // Testing for x-coordinates
        expect(getCoordsMax(coords, index)).toBe(5);

        const indexY = 1; // Testing for y-coordinates
        expect(getCoordsMax(coords, indexY)).toBe(6);
    });
});

describe('getTotalLengthAllPaths', () => {
    it('calculates total length of all paths', () => {
        const paths = [
            { getTotalLength: vi.fn(() => 10) },
            { getTotalLength: vi.fn(() => 20) },
            { getTotalLength: vi.fn(() => 30) },
        ];
        expect(getTotalLengthAllPaths(paths)).toBe(60);
    });
});

describe('inside', () => {
    it('determines if a point is inside a polygon', () => {
        const polygon = [
            [0, 0],
            [0, 5],
            [5, 5],
            [5, 0]
        ];
        expect(inside([2, 2], polygon)).toBe(true);
        expect(inside([6, 6], polygon)).toBe(false);
    });
});