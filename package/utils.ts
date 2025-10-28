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
 * Binary search to find the insertion position in a sorted array
 * @param sortedArray - The sorted array to search
 * @param key - The key to insert
 * @returns The index where the key should be inserted
 */
export function findInsertPosition(sortedArray: number[], key: number): number {
    let left = 0;
    let right = sortedArray.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (sortedArray[mid] < key) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return left;
}

/**
 * Binary search to find the closest point to the left of a given key
 * @param sortedArray - The sorted array to search
 * @param key - The key to find the closest left point for
 * @returns The closest left point, or undefined if none exists
 */
export function findClosestLeftPoint(sortedArray: number[], key: number): number | undefined {
    let left = 0;
    let right = sortedArray.length - 1;
    let result = -1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (sortedArray[mid] < key) {
            result = mid;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return result >= 0 ? sortedArray[result] : undefined;
}

/**
 * Insert a key into a sorted array while maintaining sort order
 * @param sortedArray - The sorted array to insert into
 * @param key - The key to insert
 */
export function insertIntoSorted(sortedArray: number[], key: number): void {
    const position = findInsertPosition(sortedArray, key);
    sortedArray.splice(position, 0, key);
}

/**
 * Convert a Map to a sorted array of [key, value] pairs
 * @param map - The map to convert
 * @param sortedKeys - The sorted keys array
 * @returns Array of [key, value] pairs
 */
export function mapToSortedArray(
    map: Map<number, number>, 
    sortedKeys: number[]
): [number, number][] {
    return sortedKeys.map(key => [key, map.get(key)!]);
}

/**
 * Trim leading and trailing zero-intensity segments
 * - Removes all leading zero-intensity points
 * - Removes trailing redundant zeros (keeps only the first trailing zero)
 * - Returns empty array if all segments are zero
 * @param segments - Array of [point, intensity] pairs
 * @returns Trimmed array
 */
export function trimZeroSegments(segments: [number, number][]): [number, number][] {
    if (segments.length === 0) {
        return segments;
    }

    // Remove leading zeros
    let startIndex = 0;
    while (startIndex < segments.length && segments[startIndex][1] === 0) {
        startIndex++;
    }

    // If all zeros, return empty array
    if (startIndex >= segments.length) {
        return [];
    }

    // Find last non-zero index
    let endIndex = segments.length - 1;
    while (endIndex > startIndex && segments[endIndex][1] === 0) {
        endIndex--;
    }

    // Include one trailing zero (if exists) to mark the end
    if (endIndex < segments.length - 1) {
        endIndex++;
    }

    return segments.slice(startIndex, endIndex + 1);
}