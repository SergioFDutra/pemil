'use client';

import React from 'react';
import Titulo from '@/componentes/Titulo';
import Tarefas from '@/componentes/Tarefas';

function App(): JSX.Element{

  return(
    <div className='App'>
      <Titulo/>
      <Tarefas /> 
    </div>
  );
}

export default App;


