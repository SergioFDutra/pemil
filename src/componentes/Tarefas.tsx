import { useState, useEffect, FormEvent } from 'react'
import { supabase } from '../../lib/initSupabase';

interface Tarefa {
    id?: number;
    descricao?: string
    status: string // descobrir como usar enum
    data_criacao: string //descobrir formato de datetime
}
  const [formData, setFormData] = useState({
    descricao: '',
});

export default function Tarefas() {

    useEffect(() => {
        buscaTarefas()
    }, [])

    const buscaTarefas = async () => {
        console.log("Buscando tarefas");
        let { data: tarefas, error } = await supabase
        .from('tarefas')
        .select('*')
        if (error) console.log('error', error)
        else{
            setTarefas(tarefas)
            console.log(tarefas)
        }
    }

    const adicionaTarefa = async(/*event: FormEvent*/) => {
        // event.preventDefault();
        // const { descricao } = formData;

        // const data = new FormData()
        // data.append('descricao', descricao);

        let { data: tarefas, error } = await supabase
        .from('tarefas')
        .insert([
            { descricao:   'descricao'},
        ])
        if (error) console.log('error', error)
        else{
            setTarefas(tarefas)
            console.log(tarefas)
        }
        alert('Tarefa adicionada!');
    }

    const editarTarefa = async() => {
        const tarefas = supabase.channel('custom-update-channel').on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tarefas' },
        (payload) => {
        console.log('Change received!', payload)
        }
  )
  .subscribe()
        

    }

    let nomeCliente: string = ""

    return(
        
        <div className="container">
            <div className="new-task-container">
                <div className="labelTarefa"/>
                <input type="text" id="txtTarefa" placeholder='Tarefa...' />
                <button className="new-task-button" onClick={adicionaTarefa}>Adicionar</button>
            </div>
            <div className="tasks-container">
            </div>
            <div className="new-task-container">
                <div className="label"/>
                <input type="text" id="txtPesquisa" maxLength={150} />
                <button className="new-task-button">Pesquisar</button>
            </div>
            <div className="tasks-container">
            </div>
        </div> 
    )
}