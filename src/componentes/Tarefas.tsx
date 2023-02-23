import { useState, useEffect, FormEvent } from 'react'
import { supabase } from '../../lib/initSupabase';


interface Tarefa {
    id?: number;
    descricao: string
    status: boolean
    data_criacao: string //descobrir formato de datetime
}

export default function Tarefas() {

    const [descricao, setDescricao] = useState<string>('');
    const [tarefas, setTarefas] = useState<Tarefa[]>([]);
    const [status, setStatus] = useState<string>('');
    const [tarefasFiltradas, setTarefasFiltradas] = useState<Tarefa[]>([]);

    useEffect(() => {
        buscaTarefas()
    }, [])

    const buscaTarefas = async () => {
        console.log("Buscando tarefas");
        let { data: tarefas, error } = await supabase
            .from('tarefas')
            .select('*')
            .order('id', {ascending: true})

        if (error) console.log('error', error)

        else {
            setTarefas(tarefas)
            console.log(tarefas)
        }
    }

    const adicionaTarefa = async (event: FormEvent) => {
        event.preventDefault()

        console.log("Adicionando tarefas");

        let { data: tarefasAlteradas, error } = await supabase
            .from('tarefas')
            .insert([
                { descricao: descricao },
            ])
            .select()

        if (error) console.log('error', error)

        else {
            const tarefasAtuais = tarefas.concat(tarefasAlteradas)
            console.log(tarefasAtuais)
            setTarefas(tarefasAtuais)
        }
    }

    const editarTarefa = async (e: Event, id: number) => {
        e.preventDefault()
        console.log("Editando tarefa", id);

        await supabase
            .from('tarefas')
            .update([
                { descricao: descricao },
            ])
            .eq('id', id)

        let tarefasAtuais: Tarefa[] = []
        for (let tarefa of tarefas){
            if(tarefa.id === id){
                tarefa.descricao = descricao
            }
            tarefasAtuais.push(tarefa)        
        }
        console.log(tarefasAtuais)
        setTarefas(tarefasAtuais)
    }

    const concluirTarefa = async (e: Event, id: number) => {
        e.preventDefault()
        console.log("Editando tarefa", id);

        await supabase
            .from('tarefas')
            .update([
                { status: true },
            ])
            .eq('id', id)

        let tarefasAtuais: Tarefa[] = []
        for (let tarefa of tarefas){
            if(tarefa.id === id){
                tarefa.status = true
            }
            tarefasAtuais.push(tarefa)        
        }

        console.log(tarefasAtuais)
        setTarefas(tarefasAtuais)
    }

    const removerTarefa = async (e: Event, id: number) => {
        e.preventDefault()
        console.log("Removendo tarefas", id);
        await supabase
            .from('tarefas')
            .delete()
            .eq('id', id)
        
        setTarefas(tarefas.filter((x) => x.id != id))
    }

    const selecionaStatus = async (e: Event) => {
        e.preventDefault()
        console.log("Selecionando status", status)
        if (status === 'true') {
            setTarefasFiltradas(tarefas?.filter(tarefa => tarefa.status === true))
        } else if (status === 'false' ) {
            setTarefasFiltradas(tarefas?.filter(tarefa => tarefa.status === false))
        } else if (status === 'todas') {
            setTarefasFiltradas(tarefas)
        }
    }

    return (
        <div>
            <div className="container">

                <form className="new-task-container" onSubmit={adicionaTarefa}>
                    <label htmlFor="name" className="labelTarefa"></label>
                    <input type="text" name="descricao" id="descricao"
                        placeholder='Digite uma nova tarefa...' maxLength={30}
                        onChange={(e) => setDescricao(e.target.value)}
                    />
                    <button className="new-task-button" type='submit'>Adicionar</button>
                </form>


                <form className="tasks-container" >
                    <ol className="items-grid">
                        {tarefas?.map(tarefa => (
                            <li key={tarefa.id}>
                                <span>{tarefa.descricao}</span>
                                <input className='textEditar' type="text" name="descricao" id="descricao"
                                    placeholder='Editar...'
                                    onChange={(e) => {
                                        setDescricao(e.target.value)
                                    }}
                                />
                                <button className='new-task-button' onClick={(e) => editarTarefa(e, tarefa.id)}>Editar</button>
                                <button className='new-task-button' onClick={(e) => removerTarefa(e, tarefa.id)}>Remover</button>
                                <button className='new-task-button' onClick={(e) => concluirTarefa(e, tarefa.id)}>Concluir</button>
                            </li>
                        ))}
                    </ol>
                </form>
            </div>


            <div className="container">

                <form className="new-task-container">
                    <label className='textEditar'> Escolha o tipo de tarefa:
                        <select className='textEditar' onChange={(e) => { setStatus(e.target.value) }}>
                            <option value="">Selecione</option>
                            <option value="true">Tarefas realizadas</option>
                            <option value="false">Tarefas não realizadas</option>
                            <option value="todas">Todas</option>
                        </select>
                        <label>{ }</label>
                    </label>
                    <button className="new-task-button" onClick={(e) => selecionaStatus(e)} >Pesquisar</button>
                </form>

                <div className="tasks-container">
                    <ol className="items-grid">
                        {tarefasFiltradas?.map(tarefa => (
                            <li className='lista' key={tarefa.id}>
                                <span>{tarefa.descricao}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    )
}