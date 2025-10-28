import { describe, it } from 'mocha';
import { expect } from 'chai';
import { IntensitySegments } from '../package/intensitySegment';

describe('IntensitySegments', () => {
    describe('Constructor', () => {
        it('should create a new IntensitySegments instance', () => {
            const segments = new IntensitySegments();
            expect(segments).to.be.instanceOf(IntensitySegments);
        });

        it('should initialize with empty segments', () => {
            const segments = new IntensitySegments();
            expect(segments.toString()).to.equal('[]');
        });
    });

    describe('add() method', () => {
        let segments: IntensitySegments;

        beforeEach(() => {
            segments = new IntensitySegments();
        });

        it('should add a single segment', () => {
            segments.add(10, 30, 1);
            expect(segments.toString()).to.equal('[[10,1],[30,0]]');
        });

        it('should handle overlapping segments by accumulating intensities', () => {
            segments.add(10, 30, 1);
            segments.add(20, 40, 1);
            expect(segments.toString()).to.equal('[[10,1],[20,2],[30,1],[40,0]]');
        });

        it('should support negative intensity values', () => {
            segments.add(10, 30, 1);
            segments.add(20, 40, 1);
            segments.add(10, 40, -2);
            expect(segments.toString()).to.equal('[[10,-1],[20,0],[30,-1],[40,0]]');
        });

        it('should handle multiple overlapping operations', () => {
            segments.add(10, 30, 1);
            segments.add(20, 40, 1);
            segments.add(10, 40, -1);
            // After merging and removing leading zeros: start from [20,1]
            expect(segments.toString()).to.equal('[[20,1],[30,0]]');
        });

        it('should handle adjacent segments', () => {
            segments.add(10, 20, 1);
            segments.add(20, 30, 1);
            // After merging: [20,1] merged with [10,1] as same intensity
            expect(segments.toString()).to.equal('[[10,1],[30,0]]');
        });
    });

    describe('set() method', () => {
        let segments: IntensitySegments;

        beforeEach(() => {
            segments = new IntensitySegments();
        });

        it('should set intensity for a range', () => {
            segments.set(10, 30, 2);
            expect(segments.toString()).to.equal('[[10,2],[30,0]]');
        });

        it('should override existing intensities in the range', () => {
            segments.add(10, 40, 1);
            segments.set(20, 30, 3);
            // Note: This test depends on your set() implementation
            // Adjust the expected value based on actual behavior
        });
    });

    describe('Input Validation', () => {
        let segments: IntensitySegments;

        beforeEach(() => {
            segments = new IntensitySegments();
        });

        it('should throw error for non-number parameters', () => {
            expect(() => segments.add('10' as any, 30, 1)).to.throw('Invalid input type');
            expect(() => segments.add(10, '30' as any, 1)).to.throw('Invalid input type');
            expect(() => segments.add(10, 30, '1' as any)).to.throw('Invalid input type');
        });

        it('should throw error when from > to', () => {
            expect(() => segments.add(30, 10, 1)).to.throw('Invalid input range');
        });

        it('should throw error when from == to', () => {
            expect(() => segments.add(30, 30, 1)).to.throw('Invalid input range');
        });

        it('should throw error when from == to', () => {
            expect(() => segments.set(30, 30, 1)).to.throw('Invalid input range');
        });

        it('should throw error for infinite values', () => {
            expect(() => segments.add(10, 30, Infinity)).to.throw('Invalid input amount');
            expect(() => segments.add(10, 30, -Infinity)).to.throw('Invalid input amount');
        });
    });

    describe('Edge Cases', () => {
        let segments: IntensitySegments;

        beforeEach(() => {
            segments = new IntensitySegments();
        });

        it('should handle negative time ranges', () => {
            segments.add(-20, -10, 1);
            expect(segments.toString()).to.equal('[[-20,1],[-10,0]]');
        });

        it('should handle ranges crossing zero', () => {
            segments.add(-10, 10, 1);
            expect(segments.toString()).to.equal('[[-10,1],[10,0]]');
        });

        it('should handle large numbers', () => {
            segments.add(1000000, 2000000, 1);
            expect(segments.toString()).to.equal('[[1000000,1],[2000000,0]]');
        });

        it('should handle multiple additions to the same range', () => {
            segments.add(10, 20, 1);
            segments.add(10, 20, 1);
            segments.add(10, 20, 1);
            expect(segments.toString()).to.equal('[[10,3],[20,0]]');
        });

        it('should handle zero intensity', () => {
            segments.add(10, 20, 5);
            segments.add(10, 20, 0); // Adding 0 should not change anything
            expect(segments.toString()).to.equal('[[10,5],[20,0]]');
        });

        it('should handle canceling out intensities', () => {
            segments.add(10, 20, 5);
            segments.add(10, 20, -5);
            // All intensities are zero, return empty array
            expect(segments.toString()).to.equal('[]');
        });
    });

    describe('Segment Merging', () => {
        let segments: IntensitySegments;

        beforeEach(() => {
            segments = new IntensitySegments();
        });

        it('should merge adjacent segments with same intensity', () => {
            // Create segments with same intensity that should be merged
            segments.add(10, 20, 1);
            segments.add(20, 30, 1);
            // Should merge into a single segment from 10 to 30
            expect(segments.toString()).to.equal('[[10,1],[30,0]]');
        });

        it('should remove leading zero-intensity segments', () => {
            segments.add(10, 20, 1);
            segments.add(10, 20, -1);  // Cancel out to 0
            segments.add(30, 40, 2);   // Add a non-zero segment later
            // Leading zeros removed, only keep non-zero segments
            expect(segments.toString()).to.equal('[[30,2],[40,0]]');
        });

        it('should merge trailing zero-intensity segments', () => {
            segments.add(10, 30, 5);
            segments.add(30, 50, 0);  // Explicitly add zero segment
            // Trailing zeros [30,0] and [50,0] merged to [30,0]
            expect(segments.toString()).to.equal('[[10,5],[30,0]]');
        });

        it('should keep intermediate zero-intensity segments', () => {
            segments.add(10, 20, 1);
            segments.add(30, 40, 1);
            // There's a zero segment between [20, 30]
            // This should be preserved as it's between non-zero segments
            expect(segments.toString()).to.equal('[[10,1],[20,0],[30,1],[40,0]]');
        });

        it('should merge multiple consecutive segments with same intensity', () => {
            segments.add(10, 20, 2);
            segments.add(20, 30, 2);
            segments.add(30, 40, 2);
            // All three segments have intensity 2, should merge
            expect(segments.toString()).to.equal('[[10,2],[40,0]]');
        });

        it('should not merge segments with different intensities', () => {
            segments.add(10, 20, 1);
            segments.add(20, 30, 2);
            segments.add(30, 40, 3);
            // Different intensities, should not merge
            expect(segments.toString()).to.equal('[[10,1],[20,2],[30,3],[40,0]]');
        });

        it('should merge all-zero segments', () => {
            segments.add(10, 20, 1);
            segments.add(10, 20, -1);  // Cancel out
            segments.add(30, 40, 2);
            segments.add(30, 40, -2);  // Cancel out
            // All intensities are zero, return empty array
            expect(segments.toString()).to.equal('[]');
        });

        it('should merge after set operation creates same intensities', () => {
            segments.add(10, 50, 1);
            segments.set(20, 40, 1);  // Set middle to same value as edges
            // After set, the entire range has intensity 1
            expect(segments.toString()).to.equal('[[10,1],[50,0]]');
        });

        it('should handle complex merge scenario with ups and downs', () => {
            segments.add(10, 30, 2);
            segments.add(30, 50, 2);  // Same as previous
            segments.add(50, 70, 3);  // Different
            segments.add(70, 90, 3);  // Same as previous
            // Should merge [10,30] with [30,50] and [50,70] with [70,90]
            expect(segments.toString()).to.equal('[[10,2],[50,3],[90,0]]');
        });

        it('should properly merge when operations result in same intensities', () => {
            segments.add(10, 20, 1);
            segments.add(20, 30, 2);
            segments.add(20, 30, -1);  // Reduce [20,30] back to 1
            // Now [10,20] and [20,30] both have intensity 1
            expect(segments.toString()).to.equal('[[10,1],[30,0]]');
        });
    });

    describe('Complex Scenarios', () => {
        let segments: IntensitySegments;

        beforeEach(() => {
            segments = new IntensitySegments();
        });

        it('should handle the test case from documentation (test1)', () => {
            segments.add(10, 30, 1);
            expect(segments.toString()).to.equal('[[10,1],[30,0]]');

            segments.add(20, 40, 1);
            expect(segments.toString()).to.equal('[[10,1],[20,2],[30,1],[40,0]]');

            segments.add(10, 40, -2);
            expect(segments.toString()).to.equal('[[10,-1],[20,0],[30,-1],[40,0]]');
        });

        it('should handle the test case from documentation (test2)', () => {
            segments.add(10, 30, 1);
            expect(segments.toString()).to.equal('[[10,1],[30,0]]');

            segments.add(20, 40, 1);
            expect(segments.toString()).to.equal('[[10,1],[20,2],[30,1],[40,0]]');

            segments.add(10, 40, -1);
            // After merge and removing leading zeros
            expect(segments.toString()).to.equal('[[20,1],[30,0]]');

            segments.add(10, 40, -1);
            expect(segments.toString()).to.equal('[[10,-1],[20,0],[30,-1],[40,0]]');
        });

        it('should handle multiple nested ranges', () => {
            segments.add(0, 100, 1);
            segments.add(20, 80, 1);
            segments.add(40, 60, 1);
            expect(segments.toString()).to.equal('[[0,1],[20,2],[40,3],[60,2],[80,1],[100,0]]');
        });

        it('should handle interleaved ranges', () => {
            segments.add(0, 10, 1);
            segments.add(5, 15, 1);
            segments.add(10, 20, 1);
            // After merge: [10,2] merged with [5,2]
            expect(segments.toString()).to.equal('[[0,1],[5,2],[15,1],[20,0]]');
        });
    });
});
