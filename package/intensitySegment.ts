import {
    validateInput,
    findInsertPosition,
    trimZeroSegments
} from './utils';

class IntensitySegments {
    private segmentMap: Map<number, number> = new Map();
    private sortedKeys: number[] = [];

    /**
     * Ensures a boundary point exists in the data structure
     * If the point doesn't exist, inserts it and inherits intensity from the nearest left point
     * @param point - The boundary point to insert
     */
    private insertPoint(point: number): void {
        if (this.segmentMap.has(point)) {
            return; 
        }

        const index = findInsertPosition(this.sortedKeys, point);
        
        // Inherit intensity from the left (default to 0 if no left point exists)
        const inheritedValue = index > 0 
            ? this.segmentMap.get(this.sortedKeys[index - 1])! 
            : 0;
        
        this.sortedKeys.splice(index, 0, point);
        
        this.segmentMap.set(point, inheritedValue);
    }

    /**
     * Set the absolute value for the interval.
     * @param from - The start point of the interval
     * @param to - The end point of the interval
     * @param amount - The amount of the interval
     * @throws {Error} - If the input is invalid
     */
    set(from: number, to: number, amount: number): void {
        validateInput(from, to, amount);

        this.insertPoint(from);
        this.insertPoint(to);

        const startIndex = findInsertPosition(this.sortedKeys, from);
        const endIndex = findInsertPosition(this.sortedKeys, to);

        // Set all points within the interval to the specified intensity
        this.sortedKeys.slice(startIndex, endIndex).forEach(point => {
            this.segmentMap.set(point, amount);
        });

        // Restore the 'to' point's intensity to the value before the range
        // Since insertPoint(to) inherited from the left,
        // but if the left point is within [from, to), it's already been set to amount
        // We need to find the intensity before 'from'
        const valueBeforeRange = startIndex > 0 
            ? this.segmentMap.get(this.sortedKeys[startIndex - 1])! 
            : 0;
        this.segmentMap.set(to, valueBeforeRange);
    }

    /**
     * Add intensity to the specified interval (cumulative)
     * @param from - The start point of the interval
     * @param to - The end point of the interval
     * @param amount - The amount of the interval
     * @throws {Error} - If the input is invalid
     */
    add(from: number, to: number, amount: number): void {
        validateInput(from, to, amount);

        this.insertPoint(from);
        this.insertPoint(to);

        const startIndex = findInsertPosition(this.sortedKeys, from);
        const endIndex = findInsertPosition(this.sortedKeys, to);

        // Accumulate intensity for all points within the interval
        this.sortedKeys.slice(startIndex, endIndex).forEach(point => {
            this.segmentMap.set(point, this.segmentMap.get(point)! + amount);
        });
    }


    /**
     * Convert the intensity segments to a string
     * Merges consecutive segments with same intensity
     * @returns The string representation of the intensity segments
     */
    toString(): string {
        const merged: [number, number][] = [];
        let lastIntensity: number | null = null;

        // Merge consecutive segments with same intensity
        this.sortedKeys.forEach(point => {
            const intensity = this.segmentMap.get(point)!;
            if (intensity === lastIntensity) return;
            merged.push([point, intensity]);
            lastIntensity = intensity;
        });

        // Trim leading and trailing zero segments
        const trimmed = trimZeroSegments(merged);

        return JSON.stringify(trimmed);
    }
}

export { IntensitySegments };