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
        <div className="word-card clip-contents">
          <p className="character">一</p>
          <p className="hiragana">いち</p>
          <p className="meaning">one</p>
        </div>
        <div className="word-card clip-contents">
          <p className="character">一</p>
          <p className="hiragana">いち</p>
          <p className="meaning">one</p>
        </div>
        <div className="word-card clip-contents">
          <p className="character">一</p>
          <p className="hiragana">いち</p>
          <p className="meaning">one</p>
        </div>
        <div className="word-card clip-contents">
          <p className="character">一</p>
          <p className="hiragana">いち</p>
          <p className="meaning">one</p>
        </div>
        <div className="word-card clip-contents">
          <p className="character">一</p>
          <p className="hiragana">いち</p>
          <p className="meaning">one</p>
        </div>
        <div className="word-card clip-contents">
          <p className="character">一</p>
          <p className="hiragana">いち</p>
          <p className="meaning">one</p>
        </div>
        <div className="word-card clip-contents">
          <p className="character">一</p>
          <p className="hiragana">いち</p>
          <p className="meaning">one</p>
        </div>
        <div className="word-card clip-contents">
          <p className="character">一</p>
          <p className="hiragana">いち</p>
          <p className="meaning">one</p>
        </div>
        <div className="word-card clip-contents">
          <p className="character">一</p>
          <p className="hiragana">いち</p>
          <p className="meaning">one</p>
        </div>
      </div>
      <p className="my-words">My Words</p>
      
    </div>
  )
}

export default DictionaryView