import { useState, useEffect, FormEvent } from 'react'
import { supabase } from '../../lib/initSupabase';

interface Tarefa {
    id?: number;
    descricao: string
    status: string // descobrir como usar enum
    data_criacao: string //descobrir formato de datetime
}

export default function Tarefas() {

    const [descricao, setDescricao] = useState<string>();

    const [tarefas, setTarefas] = useState([]);

    useEffect(() => {
        buscaTarefas()
    }, [])

    const buscaTarefas = async () => {
        console.log("Buscando tarefas");
        let { data: tarefas, error } = await supabase
            .from('tarefas')
            .select('*')
            .order('id', true)

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
            tarefas.push(tarefasAlteradas[0])
            setTarefas(tarefas)
            console.log(tarefas)
        }
        alert('Tarefa adicionada!');
    }

    const editarTarefa = async (id: number) => {
        console.log("Editando tarefas");
        supabase.channel('custom-update-channel').on(
            'postgres_changes',
            { event: 'UPDATE', schema: 'public', table: 'tarefas' },
            (payload) => {
                console.log('Change received!', payload)
            }
        )
            .subscribe()
    }

    const removerTarefa = async (id: number) => {

        console.log("Removendo tarefas", id);
        await supabase
            .from('tarefas')
            .delete()
            .eq('id', id)
        setTarefas(tarefas.filter((x) => x.id != id))
    }

    const selecionaStatus = async (status: boolean) => {
        console.log("Selecionando status",status);
        let { data: tarefas, error } = await supabase
            .from('tarefas')
            .select('status')
        if (error) console.log('error', error)

        else {
            setTarefas(tarefas)
            console.log(tarefas)
        }


    }

    let nomeCliente: string = ""

    return (
        <div>
            <div className="container">

                <form className="new-task-container" onSubmit={adicionaTarefa}>
                    <label htmlFor="name" className="labelTarefa"></label>
                    <input type="text" name="descricao" id="descricao"
                        placeholder='Digite uma nova tarefa...'
                        onChange={(e) => setDescricao(e.target.value)}
                    />
                    <button className="new-task-button" type='submit'>Adicionar</button>
                </form>


                <form className="tasks-container" >
                    <ol className="items-grid">
                        {tarefas?.map(tarefa => (
                            <li key={tarefa.id}>
                                <span>{tarefa.descricao}</span>
                                <input type="text" name="descricao" id="descricao" 
                                    placeholder='Editar...' value={descricao}
                                    onChange={(e) => {
                                        setError('')
                                        setTarefas(e.target.value)
                                    }}
                                />
                                <button className="btn-black" onClick={() => editarTarefa(tarefa)}>
                                   Editar
                                </button>
                                <button onClick={() => removerTarefa(tarefa.id)}>Remover</button>
                            </li>
                        ))}
                    </ol>
                </form>
            </div>


            <div className="container">


                <form className="new-task-container" onSubmit={selecionaStatus}>
                    <div className="label">Tarefa Realizada</div>
                    <input type="checkbox" id="txtPesquisa" />
                    <button className="new-task-button" type='submit'>Pesquisar</button>
                </form>
                <div className="tasks-container">
                    <ol className="items-grid">
                        {tarefas?.map(tarefa => (
                            <li key={tarefa.id}>
                                <span>{tarefa.descricao}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </div>
    )
}