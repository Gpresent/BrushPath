type Character = {
    unicode: string;
    on: string[];
    kun: string[];
    nanori: string[];
    radicals: number[];
    english: string[];
    stroke_count: number;
    freq: number | null;
    grade: number | null;
    jlpt: number | null;
    compounds: any;
};
  
export default Character;