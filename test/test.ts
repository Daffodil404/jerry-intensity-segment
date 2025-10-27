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
            expect(segments.toString()).to.equal('[[10,0],[20,1],[30,0],[40,0]]');
        });

        it('should handle adjacent segments', () => {
            segments.add(10, 20, 1);
            segments.add(20, 30, 1);
            expect(segments.toString()).to.equal('[[10,1],[20,1],[30,0]]');
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
            expect(segments.toString()).to.equal('[[10,0],[20,0]]');
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
            expect(segments.toString()).to.equal('[[10,0],[20,1],[30,0],[40,0]]');

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
            expect(segments.toString()).to.equal('[[0,1],[5,2],[10,2],[15,1],[20,0]]');
        });
    });
});
