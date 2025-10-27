import {
    validateInput,
    insertIntoSorted,
    findClosestLeftPoint,
    mapToSortedArray
} from './utils';

class IntensitySegments {
    private segmentMap: Map<number, number> = new Map();
    private sortedKeys: number[] = [];

    /**
     * Set the absolute value for the interval.
     * @param from - The start point of the interval
     * @param to - The end point of the interval
     * @param amount - The amount of the interval
     * @throws {Error} - If the input is invalid
     */
    set(from: number, to: number, amount: number): void {
        validateInput(from, to, amount);

        // Add from point if not exists
        if (!this.segmentMap.has(from)) {
            insertIntoSorted(this.sortedKeys, from);
        }
        this.segmentMap.set(from, amount);

        // Add to point if not exists
        if (!this.segmentMap.has(to)) {
            insertIntoSorted(this.sortedKeys, to);
        }

        // Update all existing points in the interval
        this.sortedKeys.forEach((key) => {
            if (key > from && key < to) {
                this.segmentMap.set(key, amount);
            }
        });

        // Set the 'to' point to restore the intensity from before this range
        const closestLeftBeforeTo = findClosestLeftPoint(this.sortedKeys, to);
        if (closestLeftBeforeTo !== undefined && closestLeftBeforeTo < from) {
            // If the closest left point is before 'from', use its intensity
            this.segmentMap.set(to, this.segmentMap.get(closestLeftBeforeTo) || 0);
        } else {
            // Otherwise, the range extends beyond any previous data
            this.segmentMap.set(to, 0);
        }
    }



    private updateIntermediatePoints(from: number, to: number, amount: number): void {
        this.sortedKeys.forEach((key) => {
            if (key > from && key < to) {
                this.segmentMap.set(key, (this.segmentMap.get(key) || 0) + amount);
            }
        });
    }


    private handleAddStartPoint(from: number, amount: number): void {
        if (this.segmentMap.has(from)) {
            this.segmentMap.set(from, (this.segmentMap.get(from) || 0) + amount);
        } else {
            // Insert new point and inherit intensity from left
            insertIntoSorted(this.sortedKeys, from);
            const closestLeftPoint = findClosestLeftPoint(this.sortedKeys, from);

            if (closestLeftPoint !== undefined) {
                this.segmentMap.set(from, (this.segmentMap.get(closestLeftPoint) || 0) + amount);
            } else {
                this.segmentMap.set(from, amount);
            }
        }
    }

    private handleAddEndPoint(to: number, amount: number): void {
        if (!this.segmentMap.has(to)) {
            insertIntoSorted(this.sortedKeys, to);
            // Find the intensity BEFORE adding this range
            // The closest left point already has the new intensity added
            // So we need to subtract the amount to get the original intensity
            const closestLeftPoint = findClosestLeftPoint(this.sortedKeys, to);
            if (closestLeftPoint !== undefined) {
                const currentIntensity = this.segmentMap.get(closestLeftPoint) || 0;
                // The 'to' point marks the END of this range, so subtract the amount
                this.segmentMap.set(to, currentIntensity - amount);
            } else {
                this.segmentMap.set(to, 0);
            }
        }
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

        // Handle start point
        this.handleAddStartPoint(from, amount);

        // Update intermediate points (must do BEFORE handling end point)
        this.updateIntermediatePoints(from, to, amount);

        // Handle end point (must do AFTER updating intermediate points)
        this.handleAddEndPoint(to, amount);
    }


    /**
     * Convert the intensity segments to a string
     * @returns The string representation of the intensity segments
     */
    toString(): string {
        const res = mapToSortedArray(this.segmentMap, this.sortedKeys);
        console.log(res);
        return JSON.stringify(res);
    }
}

// 导出类
export { IntensitySegments };