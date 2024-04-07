import React, { Suspense, useContext, useEffect, useState } from "react";

import "../styles/styles.css";
import "../styles/dict.css";

import SearchableCharacterList from "../components/SearchableCharacterList";

interface DictionaryProps {
  title: string;
}

const DictionaryView: React.FC<DictionaryProps> = ({ title }) => {

  return (
    <div className="dictionary-view">
      <p className="my-words">Dictionary</p>
      <SearchableCharacterList selectable={false} />
    </div>
  );
};


export default DictionaryView;
