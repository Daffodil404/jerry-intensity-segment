import {
    validateInput,
    findClosestLeftPoint,
    mapToSortedArray
} from './utils';

class IntensitySegments {
    private segmentMap: Map<number, number> = new Map();
    private sortedKeys: number[] = [];
    private needsRebuild: boolean = false;  // 标记是否需要重建 sortedKeys

    /**
     * 标记需要重建 sortedKeys
     */
    private markDirty(): void {
        this.needsRebuild = true;
    }

    /**
     * 如果需要，重建 sortedKeys 数组
     * 避免多次 splice，改为一次性排序
     */
    private rebuildIfNeeded(): void {
        if (this.needsRebuild) {
            // 从 Map 的所有键重建有序数组 - O(n log n)
            this.sortedKeys = Array.from(this.segmentMap.keys()).sort((a, b) => a - b);
            this.needsRebuild = false;
        }
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

        // 直接添加到 Map，标记需要重建，不使用 splice
        if (!this.segmentMap.has(from)) {
            this.segmentMap.set(from, 0);  // 先设置占位值
            this.markDirty();
        }
        
        if (!this.segmentMap.has(to)) {
            this.segmentMap.set(to, 0);  // 先设置占位值
            this.markDirty();
        }

        // 重建 sortedKeys（如果有新键加入）
        this.rebuildIfNeeded();

        // 现在可以使用已排序的 sortedKeys
        this.segmentMap.set(from, amount);

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
            // 直接添加到 Map，标记需要重建，不使用 splice
            this.segmentMap.set(from, 0);  // 先设置占位值
            this.markDirty();
            this.rebuildIfNeeded();  // 立即重建以便后续操作

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
            // 直接添加到 Map，标记需要重建，不使用 splice
            this.segmentMap.set(to, 0);  // 先设置占位值
            this.markDirty();
            this.rebuildIfNeeded();  // 立即重建以便后续操作

            // Find the intensity BEFORE adding this range
            // The closest left point already has the new intensity added
            // So we need to subtract the amount to get the original intensity
            const closestLeftPoint = findClosestLeftPoint(this.sortedKeys, to);
            if (closestLeftPoint !== undefined) {
                const currentIntensity = this.segmentMap.get(closestLeftPoint) || 0;
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