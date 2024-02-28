type Character = {
    id: number;
    unicode: string;
    on: string[] | null;
    kun: string[] | null;
    nanori: string[] | null;
    radicals: any[] | null;
    english: string[];
    stroke_count: number;
    freq: number | null;
    grade: number | null;
    jplt: number | null;
    compounds: string[] | null;
};
  
export default Character;