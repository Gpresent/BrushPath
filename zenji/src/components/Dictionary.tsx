import React from "react"
import "../styles.css"

interface DictionaryProps {
    title: string;
}
const DictionaryView : React.FC<DictionaryProps> = ({title}) => {
  return (
    <div className="dictionary-view clip-contents">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/unify-v3-copy.appspot.com/o/42y4mm64mdr-547%3A1018?alt=media&token=f7cd7b3b-335c-4510-9fbc-a0e3dc8a318d"
        alt="Not Found"
        className="background"
      />
      <div className="search-bar" />
      <div className="word-list clip-contents">
        <div className="word-card clip-contents">
          <p className="character">一</p>
          <p className="hiragana">いち</p>
          <p className="meaning">one</p>
        </div>
        <div className="word-card-1 clip-contents">
          <p className="character-1">一</p>
          <p className="hiragana-1">いち</p>
          <p className="meaning-1">one</p>
        </div>
        <div className="word-card-2 clip-contents">
          <p className="character-2">二</p>
          <p className="hiragana-2">いち</p>
          <p className="meaning-2">two</p>
        </div>
        <div className="word-card-3 clip-contents">
          <p className="character-3">三</p>
          <p className="hiragana-3">いち</p>
          <p className="meaning-3">three</p>
        </div>
        <div className="word-card-4 clip-contents">
          <p className="character-4">四</p>
          <p className="hiragana-4">いち</p>
          <p className="meaning-4">four</p>
        </div>
        <div className="word-card-5 clip-contents">
          <p className="character-5">五</p>
          <p className="hiragana-5">いち</p>
          <p className="meaning-5">five</p>
        </div>
        <div className="word-card-6 clip-contents">
          <p className="character-6">六</p>
          <p className="hiragana-6">いち</p>
          <p className="meaning-6">six</p>
        </div>
        <div className="word-card-7 clip-contents">
          <p className="character-7">七</p>
          <p className="hiragana-7">いち</p>
          <p className="meaning-7">seven</p>
        </div>
        <div className="word-card-8 clip-contents">
          <p className="character-8">八</p>
          <p className="hiragana-8">いち</p>
          <p className="meaning-8">eight</p>
        </div>
        <div className="word-card-9 clip-contents">
          <p className="character-9">一</p>
          <p className="hiragana-9">いち</p>
          <p className="meaning-9">one</p>
        </div>
        <div className="word-card-10 clip-contents">
          <p className="character-10">一</p>
          <p className="hiragana-10">いち</p>
          <p className="meaning-10">one</p>
        </div>
      </div>
      <p className="my-words">My Words</p>
      
    </div>
  )
}

export default DictionaryView