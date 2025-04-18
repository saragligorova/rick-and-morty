import './App.css';
import React from 'react';
import Characters from './components/Characters';
import { useTranslation } from 'react-i18next';

function App() {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) =>{
    i18n.changeLanguage(lang);
  };

  return (
    <div style={{padding: '20px'}}>
      <Characters/>
    </div>
  )
}

export default App;
