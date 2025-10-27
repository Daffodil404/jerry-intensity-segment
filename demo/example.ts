import { IntensitySegments } from '../package/intensitySegment';
const exapmle1 = () => {
    const segments = new IntensitySegments();
    segments.toString(); // Should be "[]"
    segments.add(10, 30, 1);
    segments.toString(); // Should be: "[[10,1],[30,0]]"
    segments.add(20, 40, 1);
    segments.toString(); // Should be: "[[10,1],[20,2],[30,1],[40,0]]"
    segments.add(10, 40, -2);
    segments.toString(); // Should be: "[[10,-1],[20,0],[30,-1],[40,0]]"
}


// Another example sequence:
const exapmle2 = () => {
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


exapmle1();
exapmle2();