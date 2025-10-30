import { Intensity, Point, Segment } from './type';
import { validateInput, compressAndTrim } from './utils';

class IntensitySegments {
    private segments: Segment[] = [];

    private getPoint(segment: Segment): Point {
        return segment[0];
    }

    /** Get the intensity of a segment */
    private getIntensity(segment: Segment): Intensity {
        return segment[1];
    }

    /** Create a new segment */
    private createSegment(point: Point, intensity: Intensity): Segment {
        return [point, intensity];
    }


    /**
     * Find intensity at a specific point position
     * inherit from the closest segment before the point
     * @param point - The point to search for
     * @returns The intensity at that point (0 if point is before all segments)
     */
    private findIntensityAt(point: Point): Intensity {
        for (let j = this.segments.length - 1; j >= 0; j--) {
            if (this.getPoint(this.segments[j]) <= point) {
                return this.getIntensity(this.segments[j]);
            }
        }
        return 0;
    }

    /**
     * Copy segments from current array until a condition is met
     * Pure function - returns new array and metadata
     * @param startIndex - Starting index
     * @param condition - Condition to check for each segment
     * @returns Object with copied segments, last intensity, and next index
     */
    private collectSegmentsWhile(
        startIndex: number,
        condition: (point: Point) => boolean
    ): { segments: Segment[]; lastIntensity: Intensity; nextIndex: number } {
        const segments: Segment[] = [];
        let lastIntensity: Intensity = 0;
        let index = startIndex;

        while (index < this.segments.length &&
            condition(this.getPoint(this.segments[index]))) {
            const segment = this.segments[index];
            segments.push(segment);
            lastIntensity = this.getIntensity(segment);
            index++;
        }

        return { segments, lastIntensity, nextIndex: index };
    }

    /**
     * Find the next index after skipping segments that meet a condition
     * Pure function - doesn't modify anything
     * @param startIndex - Starting index
     * @param condition - Condition to check for each segment
     * @returns Next index after skipping
     */
    private skipSegmentsWhile(
        startIndex: number,
        condition: (point: Point) => boolean
    ): number {
        let index = startIndex;
        while (index < this.segments.length &&
            condition(this.getPoint(this.segments[index]))) {
            index++;
        }
        return index;
    }

    /**
     * Check if there's a segment at the specified point
     * Pure function - returns data without side effects
     * @param index - Current index
     * @param point - The point to check
     * @returns Object with intensity (if exists) and next index
     */
    private checkPointAt(
        index: number,
        point: Point
    ): { intensity: Intensity | undefined; nextIndex: number } {
        if (index < this.segments.length &&
            this.getPoint(this.segments[index]) === point) {
            return {
                intensity: this.getIntensity(this.segments[index]),
                nextIndex: index + 1
            };
        }
        return { intensity: undefined, nextIndex: index };
    }

    /**
     * Add intensity to the specified interval (cumulative)
     * @param from - Starting point of the interval
     * @param to - Ending point of the interval
     * @param amount - Intensity to add (can be negative)
     */
    add(from: Point, to: Point, amount: Intensity): void {
        validateInput(from, to, amount);

        const intensityAtToOriginal = this.findIntensityAt(to);

        // Collect segments before 'from'
        const { 
            segments: beforeFromSegments, 
            lastIntensity: intensityBeforeFrom, 
            nextIndex: indexAfterFrom 
        } = this.collectSegmentsWhile(0, (point) => point < from);
        
        const newSegments = [...beforeFromSegments];
        let curIndex = indexAfterFrom;

        // Handle 'from' position
        const { 
            intensity: fromPointIntensity, 
            nextIndex: indexAfterFromCheck 
        } = this.checkPointAt(curIndex, from);
        
        const intensityAtFrom = fromPointIntensity ?? intensityBeforeFrom;
        curIndex = indexAfterFromCheck;
        newSegments.push(this.createSegment(from, intensityAtFrom + amount));

        // Process segments in [from, to) with added intensity
        const { 
            segments: middleSegments, 
            nextIndex: indexAfterMiddle 
        } = this.collectSegmentsWhile(curIndex, (point) => point < to);
        
        for (const segment of middleSegments) {
            newSegments.push(this.createSegment(
                this.getPoint(segment), 
                this.getIntensity(segment) + amount
            ));
        }
        curIndex = indexAfterMiddle;

        // Handle 'to' position
        const { nextIndex: indexAfterTo } = this.checkPointAt(curIndex, to);
        curIndex = indexAfterTo;
        newSegments.push(this.createSegment(to, intensityAtToOriginal));

        // Collect remaining segments after 'to'
        const { segments: afterToSegments } = this.collectSegmentsWhile(curIndex, () => true);
        newSegments.push(...afterToSegments);

        // Compress and clean
        this.segments = compressAndTrim(newSegments);
    }

    /**
     * Set absolute intensity for the specified interval
     * 
     * @param from - Starting point of the interval
     * @param to - Ending point of the interval
     * @param amount - Absolute intensity value
     */
    set(from: Point, to: Point, amount: Intensity): void {
        validateInput(from, to, amount);

        // Collect segments before 'from' and record intensity
        const { 
            segments: beforeFromSegments, 
            lastIntensity, 
            nextIndex: indexAfterFrom 
        } = this.collectSegmentsWhile(0, (point) => point < from);
        
        const newSegments = [...beforeFromSegments];
        let curIndex = indexAfterFrom;
        let intensityBeforeFrom = lastIntensity;

        // Check 'from' position (will be recreated)
        const { 
            intensity: fromPointIntensity, 
            nextIndex: indexAfterFromCheck 
        } = this.checkPointAt(curIndex, from);
        
        if (fromPointIntensity !== undefined) {
            intensityBeforeFrom = fromPointIntensity;
        }
        curIndex = indexAfterFromCheck;

        // Add new segment at 'from' with target intensity
        newSegments.push(this.createSegment(from, amount));

        // Skip all segments in [from, to) - they're being replaced
        curIndex = this.skipSegmentsWhile(curIndex, (point) => point < to);

        // Handle 'to' position - restore to intensity before 'from'
        const { nextIndex: indexAfterTo } = this.checkPointAt(curIndex, to);
        curIndex = indexAfterTo;
        newSegments.push(this.createSegment(to, intensityBeforeFrom));

        // Collect remaining segments after 'to'
        const { segments: afterToSegments } = this.collectSegmentsWhile(curIndex, () => true);
        newSegments.push(...afterToSegments);

        this.segments = compressAndTrim(newSegments);
    }


    /**
     * Convert segments to JSON string
     */
    toString(): string {
        return JSON.stringify(this.segments);
    }
}

export { IntensitySegments };
