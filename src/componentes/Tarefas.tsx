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

    const [selectedStatus, setSelectedStatus] = useState('');

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
        console.log("Editando tarefas", id);

        await supabase
            .from('tarefas')
            .update([
                { descricao: descricao },
            ])
            .eq('id', id)
    }

    const removerTarefa = async (id: number) => {

        console.log("Removendo tarefas", id);
        await supabase
            .from('tarefas')
            .delete()
            .eq('id', id)
        setTarefas(tarefas.filter((x) => x.id != id))
    }

    const selecionaStatus = async (status: any) => {
        console.log("Selecionando status", status);
        let { data: tarefas, error } = await supabase
            .from('tarefas')
            .select('status')
        if (error) console.log('error', error)

        if ([{ status: 'true' }]) {


        }else if([{ status: 'false' }]){

        }else if([{ status: 'todas' }]){

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
                                <input type="textEditar" name="descricao" id="descricao"
                                    placeholder='Editar...'
                                    onChange={(e) => {
                                        setDescricao(e.target.value)
                                    }}
                                />
                                <button className='new-task-button' onClick={() => editarTarefa(tarefa.id)}>Editar</button>
                                <button className='new-task-button' onClick={() => removerTarefa(tarefa.id)}>Remover</button>
                            </li>
                        ))}
                    </ol>
                </form>
            </div>


            <div className="container">

                <form className="new-task-container" onSubmit={selecionaStatus}>
                    <label> Escolha o tipo de tarefa:
                        <select onChange={(e) => { setDescricao(e.target.value) }}>
                            <option value="">Selecione</option>
                            <option value="true">Tarefas realizadas</option>
                            <option value="false">Tarefas não realizadas</option>
                            <option value="todas">Todas</option>
                        </select>
                    </label>
                    <button className="new-task-button" /*type='submit' value="Enviar"*/ onClick={() => selecionaStatus(tarefa.id)} >Pesquisar</button>
                </form>



                {/* <form className="new-task-container" onSubmit={selecionaStatus}>
                    <div className="label">Escolha o tipo de tarefa...</div>
                    <select placeholder='Escolha o tipo de tarefa...'>
                        <option value="realizada">Tarefas realizadas</option>
                        <option value="naoRealizada">Tarefas não realizadas</option>
                        <option selected value="todas">Todas</option>
                    </select>
                    <button className="new-task-button" type='submit'>Pesquisar</button>
                </form> */}
                <div className="tasks-container">
                    <ol className="items-grid">
                        {tarefas?.map(tarefa => (
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