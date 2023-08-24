"use strict"

/* 2. CREAR OBJETO BASE DE DATOS = db */

const rlmcDB = firebase.firestore();

/* 3. CREAR OBJETOS GENERALES */

const form = document.querySelector("#FClientes");

const tblclientes = document.querySelector("#tblCliente>tbody");

const collectionName = "clientes";

var editStatus = false;

var idSeleccionado = "";

/* 4. METODOS DEL CRUD FIREBASE */

const onInsert = newCli => rlmcDB.collection(collectionName).doc().set(newCli);

const onUpdate = (paramId, newCli) => rlmcDB.collection(collectionName).doc(paramId).update(newCli);

const onDelete = paramId => rlmcDB.collection(collectionName).doc(paramId).delete();

const finalAll = () => rlmcDB.collection(collectionName).get();

const findById = paramId => rlmcDB.collection(collectionName).doc(paramId).get();

const onFindAll = callback => rlmcDB.collection(collectionName).onSnapshot(callback);

/* 5. CARGAR LA TABLE CON ONFINDALL */
window.addEventListener("load", async()=>{
    await onFindAll( query =>{
        tblclientes.innerHTML = "";
        //console.log(query);
        query.forEach( doc =>{
            //console.log(doc.id);
            let data = doc.data();

            tblclientes.innerHTML += `
                                        <tr>
                                            <td>${data.nombreC}</td> 
                                            <td>${data.cedulaC}</td>
                                            <td>${data.nacionalidadC}</td>
                                            <td>${data.telefonoC}</td>
                                            <td>${data.numAptC}</td>
                                            <td>${data.inicioContC}</td>
                                            <td>${data.finalContC}</td>
                                            <td>${data.renovC}</td>
                                            <td>${data.montoAlqC}</td>
                                            <td>${data.montoAUAlqC}</td>
                                            <td>${data.ultAqlC}</td>
                                            <td>${data.proxAuAqlC}</td>
                                            <td>${data.docC}</td>
                                            <td>${data.cedC}</td>
                                            <td>${data.correoC}</td>
                                            <td>${data.devAptC}</td>
                                            <td>
                                                <button id="IGEditarBTN" type="button" class="btn btn-warning btn-editar" data-id = "${doc.id}">EDITAR</button>
                                                <button id="IGBorrarBTN" type="button" class="btn btn-danger btn-borrar" data-id = "${doc.id}">BORRAR</button>
                                            </td>
                                        </tr>
                                      `;
        });
        /* --------------------BORRAR-------------------- */

        const btnBorrar = document.querySelectorAll(".btn-borrar");

        btnBorrar.forEach( btn =>{
            btn.addEventListener("click", async ev =>{
                //console.log(ev.target.dataset.id);
                if(confirm("Desea borrar el cliente?")){
                    await onDelete(ev.target.dataset.id);
                    alert("Cliente borrado existosamente!");
                }
            })
        });

        /* --------------------EDITAR----------------------- */

        const btn_editar = document.querySelectorAll(".btn-editar");

        btn_editar.forEach(btn => {
            btn.addEventListener("click",async ev=> {
                const docSeleccionado = await findById(ev.target.dataset.id);
                const clienteSeleccionado = docSeleccionado.data();
                
                form.NombreCliente.value = clienteSeleccionado.nombreC;
                form.CedulaClienteCliente.value = clienteSeleccionado.cedulaC;
                form.NacionCliente.value = clienteSeleccionado.nacionalidadC;
                form.TelCliente.value = clienteSeleccionado.telefonoC;
                form.NumAptCliente.value = clienteSeleccionado.numAptC;
                form.FechaContraCliente.value =clienteSeleccionado.inicioContC;
                form.FechaFContraCliente.value = clienteSeleccionado.finalContC;
                form.RenovAlqCliente.value = clienteSeleccionado.renovC;
                form.MontoAlqCliente.value = clienteSeleccionado.montoAlqC;
                form.MontoAlqAuCliente.value = clienteSeleccionado.montoAUAlqC;
                form.UltAuCliente.value = clienteSeleccionado.ultAqlC;
                form.PUltAuCliente.value = clienteSeleccionado.proxAuAqlC;
                form.DocCliente.value = clienteSeleccionado.docC;
                form.CedEscCliente.value = clienteSeleccionado.cedC;
                form.CorreoCliente.value = clienteSeleccionado.correoC;
                form.FechaDevCliente.value = clienteSeleccionado.devAptC;
                 
                form.EnviarFCbtn.innerText = "Modificar";

                editStatus = true;
                idSeleccionado = ev.target.dataset.id;
            });
        });
    });    
});


/* 6. CONFIGURAR EL SUBMIT */
form.addEventListener("submit", async ev =>{
    ev.preventDefault();
    
    //CARGAR VARIABLES CON FORM
    let nombreC = form.NombreCliente.value;
    let cedulaC = form.CedulaCliente.value;
    let nacionalidadC = form.NacionCliente.value;
    let telefonoC = form.TelCliente.value;
    let numAptC = form.NumAptCliente.value;
    let inicioContC = form.FechaContraCliente.value;
    let finalContC = form.FechaFContraCliente.value;
    let renovC = form.RenovAlqCliente.value;
    let montoAlqC = form.MontoAlqCliente.value;
    let montoAUAlqC = form.MontoAlqAuCliente.value;
    let ultAqlC = form.UltAuCliente.value;
    let proxAuAqlC = form.PUltAuCliente.value;
    let docC = form.DocCliente.value;
    let cedC = form.CedEscCliente.value;
    let correoC = form.CorreoCliente.value;
    let devAptC = form.FechaDevCliente.value;

    try{
        if(!editStatus){
            await onInsert(
                {nombreC,
                    cedulaC,
                    nacionalidadC,
                    telefonoC,
                    numAptC,
                    inicioContC,
                    finalContC,
                    renovC,
                    montoAlqC,
                    montoAUAlqC,
                    ultAqlC,
                    proxAuAqlC,
                    docC,
                    cedC,
                    correoC,
                    devAptC
                });
            alert("Informacion almacenada correctamente!")
            limpiar();
        }else{
            await onUpdate(idSeleccionado, 
                {nombreC,
                    cedulaC,
                    nacionalidadC,
                    telefonoC,
                    numAptC,
                    inicioContC,
                    finalContC,
                    renovC,
                    montoAlqC,
                    montoAUAlqC,
                    ultAqlC,
                    proxAuAqlC,
                    docC,
                    cedC,
                    correoC,
                    devAptC
                });
            alert("Informacion modificada correctamente!")
            limpiar(); 
        } 
    }catch (error){
        alert("Error!. Detalle: " + error);
    }
});

function limpiar (){
    form.reset();
    form.tipoA.focus();
    form.EnviarFCbtn.innerText = "Guardar";
    editStatus = false;
    idSeleccionado= "";
}