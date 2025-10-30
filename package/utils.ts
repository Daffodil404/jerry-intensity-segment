/**
 * Utility functions for IntensitySegments
 */

/**
 * Validates input parameters for segment operations
 * @param from - The start point of the interval
 * @param to - The end point of the interval
 * @param amount - The amount of the interval
 * @throws {Error} - If the input is invalid
 */
export function validateInput(from: number, to: number, amount: number): void {
    // check the input type
    if (typeof from !== 'number' || typeof to !== 'number' || typeof amount !== 'number') {
        throw new Error('Invalid input type');
    }

    // check the input range
    if (from >= to) {
        throw new Error('Invalid input range');
    }

    // check the amount is not infinity
    if (amount === Infinity || amount === -Infinity) {
        throw new Error('Invalid input amount');
    }
}

/**
 * 
 * @param segments - The segments to compress and clean
 * @returns The compressed and cleaned segments
 */
export function compressAndTrim(segments: [number, number][]): [number, number][] {
    if (segments.length === 0) return [];

    // Step 1: Remove consecutive duplicates (O(n))
    const compressed: [number, number][] = [];
    for (let i = 0; i < segments.length; i++) {
        const [point, intensity] = segments[i];
        const lastIntensity = compressed.length > 0 ? compressed[compressed.length - 1][1] : null;

        if (intensity !== lastIntensity) {
            compressed.push([point, intensity]);
        }
    }

    if (compressed.length === 0) return [];

    // Step 2: Remove leading zeros (O(n))
    let startIndex = 0;
    while (startIndex < compressed.length && compressed[startIndex][1] === 0) {
        startIndex++;
    }

    if (startIndex >= compressed.length) {
        return []; // All zeros
    }

    // Step 3: Find last non-zero and keep one trailing zero (O(n))
    let endIndex = compressed.length - 1;
    while (endIndex > startIndex && compressed[endIndex][1] === 0) {
        endIndex--;
    }

    // Include one trailing zero if it exists
    if (endIndex < compressed.length - 1) {
        endIndex++;
    }

    return compressed.slice(startIndex, endIndex + 1);
}