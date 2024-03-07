type Character = {
    unicode: string;
    unicode_str: string;
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
    parts: string[];
};
  
export default Character;