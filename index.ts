class IntensitySegments {
    private segmentMap: Map<number, number> = new Map();
    private sortedKeys: number[] = [];

    /**
     * Check the input is valid
     * @param from - The start point of the interval
     * @param to - The end point of the interval
     * @param amount - The amount of the interval
     * @throws {Error} - If the input is invalid
     */
    private check(from: number, to: number, amount: number) {
        // check the input type
        if (typeof from !== 'number' || typeof to !== 'number' || typeof amount !== 'number') {
            throw new Error('Invalid input type');
        }

        // check the input range
        if (from > to) {
            throw new Error('Invalid input range');
        }

        // check the amount is not infinity
        if (amount === Infinity || amount === -Infinity) {
            throw new Error('Invalid input amount');
        }

    }

    /**
     * Insert a new key into the sorted keys
     * @param key - The key to insert
     */
    private insertNewKeyIntoSorted(key: number) {
        let left = 0;
        let right = this.sortedKeys.length - 1;
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (this.sortedKeys[mid] < key) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        // insert key to the sorted keys
        this.sortedKeys.splice(left, 0, key);
    }

    /**
     * 
     * @param key - The key to find the closest left point
     * @returns 
     */
    private findClosestLeftPoint(key: number): number | undefined {
        let left = 0;
        let right = this.sortedKeys.length - 1;
        let result = -1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (this.sortedKeys[mid] < key) {  // 严格小于
                result = mid;
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        return result >= 0 ? this.sortedKeys[result] : undefined;
    }

    /**
     * Set the absolute value for the interval.
     * @param from - The start point of the interval
     * @param to - The end point of the interval
     * @param amount - The amount of the interval
     * @throws {Error} - If the input is invalid
     */
    set(from: number, to: number, amount: number) {
        this.segmentMap.set(from, amount);
        // loop through the sorted keys and set the amount for the interval
        this.sortedKeys.forEach((key) => {
            if (key >= from && key < to) {
                this.segmentMap.set(key, amount);
            }
        });
    }


    /**
     * 
     * @param from - The start point of the interval
     * @param to - The end point of the interval
     * @param amount - The amount of the interval
     */
    add(from: number, to: number, amount: number) {
        // set start point
        if (this.segmentMap.has(from)) {
            this.segmentMap.set(from, (this.segmentMap.get(from) || 0) + amount);
        } else {
            // if from point exists in the interval, add the amount
            // find the closest left point to the from point
            this.insertNewKeyIntoSorted(from);
            const closestLeftPoint = this.findClosestLeftPoint(from);
            if (closestLeftPoint !== undefined) {
                this.segmentMap.set(from, (this.segmentMap.get(closestLeftPoint) || 0) + amount);
            } else {
                this.segmentMap.set(from, amount);
            }
        }

        if (!this.segmentMap.has(to)) {
            this.insertNewKeyIntoSorted(to);
            this.segmentMap.set(to, 0);
        }

        // set period points
        this.sortedKeys.forEach((key) => {
            if (key > from && key < to) {
                this.segmentMap.set(key, (this.segmentMap.get(key) || 0) + amount);
            }
        });
    }


    /**
     * Convert the intensity segments to a string
     * @returns The string representation of the intensity segments
     */
    toString() {
        const res: [number, number][] = this.sortedKeys.map(key =>
            [key, this.segmentMap.get(key)!]
        );
        console.log(res);
        return JSON.stringify(res);
    }
}


console.log("test1");
function test() {
    // Here is an example sequence:
    // (data stored as an array of start point and value for each segment.)
    const segments = new IntensitySegments();
    segments.toString(); // Should be "[]"
    segments.add(10, 30, 1);
    segments.toString(); // Should be: "[[10,1],[30,0]]"
    segments.add(20, 40, 1);
    segments.toString(); // Should be: "[[10,1],[20,2],[30,1],[40,0]]"
    segments.add(10, 40, -2);
    segments.toString(); // Should be: "[[10,-1],[20,0],[30,-1],[40,0]]"
}
test();

console.log("test2");
function test2() {
    // Another example sequence:
    const segments = new IntensitySegments();
    segments.toString(); // Should be "[]"
    segments.add(10, 30, 1);
    segments.toString(); // Should be "[[10,1],[30,0]]"
    segments.add(20, 40, 1);
    segments.toString(); // Should be "[[10,1],[20,2],[30,1],[40,0]]"
    segments.add(10, 40, -1);
    segments.toString(); // Should be "[[20,1],[30,0]]"
    segments.add(10, 40, -1);
    segments.toString(); // Should be "[[10,-1],[20,0],[30,-1],[40,0]]"
}
test2();

// 导出类
export { IntensitySegments };