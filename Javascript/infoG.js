"use strict"

/* 2. CREAR OBJETO BASE DE DATOS = db */

const rlmcDB = firebase.firestore();

/* 3. CREAR OBJETOS GENERALES */

const form = document.querySelector("#FinformG");

const tblinformacionG = document.querySelector("#tblInfoG>tbody");

const collectionName = "infoG";

var editStatus = false;

var idSeleccionado = "";

/* 4. METODOS DEL CRUD FIREBASE */

const onInsert = newinfoG => rlmcDB.collection(collectionName).doc().set(newinfoG);

const onUpdate = (paramId, newinfoG) => rlmcDB.collection(collectionName).doc(paramId).update(newinfoG);

const onDelete = paramId => rlmcDB.collection(collectionName).doc(paramId).delete();

const finalAll = () => rlmcDB.collection(collectionName).get();

const findById = paramId => rlmcDB.collection(collectionName).doc(paramId).get();

const onFindAll = callback => rlmcDB.collection(collectionName).onSnapshot(callback);

/* 5. CARGAR LA TABLE CON ONFINDALL */
window.addEventListener("load", async()=>{
    await onFindAll( query =>{
        tblinformacionG.innerHTML = "";
        //console.log(query);
        query.forEach( doc =>{
            //console.log(doc.id);
            let data = doc.data();

            tblinformacionG.innerHTML += `
                                        <tr>
                                            <td>${data.tipoA}</td> 
                                            <td>${data.bloqueA}</td>
                                            <td>${data.cantonA}</td>
                                            <td>${data.distritoA}</td>
                                            <td>${data.provinciaA}</td>
                                            <td>${data.direccionA}</td>
                                            <td>${data.numFA}</td>
                                            <td>${data.cantidadUA}</td>
                                            <td>${data.numSLA}</td>
                                            <td>${data.numSAA}</td>
                                            <td>${data.fechaCA}</td>
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
                if(confirm("Desea borrar el registro?")){
                    await onDelete(ev.target.dataset.id);
                    alert("Registro borrado existosamente!");
                }
            })
        });

        /* --------------------EDITAR----------------------- */

        const btn_editar = document.querySelectorAll(".btn-editar");

        btn_editar.forEach(btn => {
            btn.addEventListener("click",async ev=> {
                const docSeleccionado = await findById(ev.target.dataset.id);
                const infoSeleccionado = docSeleccionado.data();
                
                form.tipoApt.value = infoSeleccionado.tipoA;
                form.BloqueApt.value = infoSeleccionado.bloqueA;
                form.CantonApt.value = infoSeleccionado.cantonA;
                form.DistritoApt.value = infoSeleccionado.distritoA;
                form.ProvinciaApt.value = infoSeleccionado.provinciaA;
                form.DireccionExacta.value = infoSeleccionado.direccionA;
                form.NumFinca.value = infoSeleccionado.numFA;
                form.CantUn.value = infoSeleccionado.cantidadUA;
                form.NumServicioLuz.value = infoSeleccionado.numSLA;
                form.NumServicioAgua.value = infoSeleccionado.numSAA;
                form.FechaConstru.value = infoSeleccionado.fechaCA;
                
                form.EnviarFIGbtn.innerText = "Modificar";

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
    let tipoA = form.tipoApt.value;
    let bloqueA = form.BloqueApt.value;
    let cantonA = form.CantonApt.value;
    let distritoA = form.DistritoApt.value;
    let provinciaA = form.ProvinciaApt.value;
    let direccionA = form.DireccionExacta.value;
    let numFA = form.NumFinca.value;
    let cantidadUA = form.CantUn.value;
    let numSLA = form.NumServicioLuz.value;
    let numSAA = form.NumServicioAgua.value;
    let fechaCA = form.FechaConstru.value;

    try{
        if(!editStatus){
            await onInsert(
                {tipoA, 
                    bloqueA, 
                    cantonA, 
                    distritoA, 
                    provinciaA, 
                    direccionA,
                    numFA,
                    cantidadUA,
                    numSLA,
                    numSAA,
                    fechaCA
                });
            alert("Informacion almacenada correctamente!")
            limpiar();
        }else{
            await onUpdate(idSeleccionado, 
                {tipoA, 
                    bloqueA, 
                    cantonA, 
                    distritoA, 
                    provinciaA, 
                    direccionA,
                    numFA,
                    cantidadUA,
                    numSLA,
                    numSAA,
                    fechaCA});
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
    form.EnviarFIGbtn.innerText = "Guardar";
    editStatus = false;
    idSeleccionado= "";
}