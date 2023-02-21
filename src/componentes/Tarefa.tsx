import React, { ChangeEvent } from "react";


export default function Tarefa(){
    

    let nomeCliente: string = ""

    // const txtTarefaOnChange =(event : ChangeEvent<HTMLInputElement>)=>{
    //     // console.log(event.target.value)

    //     nomeCliente = event.target.value
    // }
    // const btnAdicionarClick = ()  => {
    //     alert('Oi'.concat(nomeCliente))

    // }

    return(
    <div className="componenteTarefa">
        <label>Tarefa:</label>
        <input type="text" id="txtTarefa" maxLength={150} />
        <input type="button" value="Adicionar"/>
    </div>
    )
}