type Character = {
    id: string;
    unicode: string;
    unicode_str: string;
    on: string[];
    kun: string[];
    nanori: string[];
    radicals: number[];
    english: string[];
    one_word_meaning : string;
    stroke_count: number;
    freq: number | null;
    grade: number | null;
    jlpt: number | null;
    compounds: any;
    parts: string[];
    selected?: boolean;
    coords: any;
    totalLengths: number;
};

export default Character;
