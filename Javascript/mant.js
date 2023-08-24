"use strict"

/* 2. CREAR OBJETO BASE DE DATOS = db */

const rlmcDB = firebase.firestore();

/* 3. CREAR OBJETOS GENERALES */

const form = document.querySelector("#FMant");

const tblMantenimiento = document.querySelector("#tblMant>tbody");

const collectionName = "mant";

var editStatus = false;

var idSeleccionado = "";

/* 4. METODOS DEL CRUD FIREBASE */

const onInsert = newMant => rlmcDB.collection(collectionName).doc().set(newMant);

const onUpdate = (paramId, newMant) => rlmcDB.collection(collectionName).doc(paramId).update(newMant);

const onDelete = paramId => rlmcDB.collection(collectionName).doc(paramId).delete();

const finalAll = () => rlmcDB.collection(collectionName).get();

const findById = paramId => rlmcDB.collection(collectionName).doc(paramId).get();

const onFindAll = callback => rlmcDB.collection(collectionName).onSnapshot(callback);

/* 5. CARGAR LA TABLE CON ONFINDALL */
window.addEventListener("load", async()=>{
    await onFindAll( query =>{
        tblMantenimiento.innerHTML = "";
        //console.log(query);
        query.forEach( doc =>{
            //console.log(doc.id);
            let data = doc.data();

            tblMantenimiento.innerHTML += `
                                        <tr>
                                            <td>${data.tipoM}</td> 
                                            <td>${data.fechaM}</td>
                                            <td>${data.costoM}</td>
                                            <td>${data.proveedorM}</td>
                                            <td>${data.telefonoM}</td>
                                            <td>${data.notasM}</td>
                                            <td>
                                                <button id="MEditarBTN" type="button" class="btn btn-warning btn-editar" data-id = "${doc.id}">EDITAR</button>
                                                <button id="MBorrarBTN" type="button" class="btn btn-danger btn-borrar" data-id = "${doc.id}">BORRAR</button> 
                                            </td>
                                        </tr>
                                      `;
        });
        /* --------------------BORRAR-------------------- */

        const btnBorrar = document.querySelectorAll(".btn-borrar");

        btnBorrar.forEach( btn =>{
            btn.addEventListener("click", async ev =>{
                //console.log(ev.target.dataset.id);
                if(confirm("Desea borrar el mantenimiento?")){
                    await onDelete(ev.target.dataset.id);
                    alert("Mantenimiento borrado existosamente!");
                }
            })
        });

        /* --------------------EDITAR----------------------- */

        const btn_editar = document.querySelectorAll(".btn-editar");

        btn_editar.forEach(btn => {
            btn.addEventListener("click",async ev=> {
                const docSeleccionado = await findById(ev.target.dataset.id);
                const mantSeleccionado = docSeleccionado.data();
                
                form.tipoMant.value = mantSeleccionado.tipoM;
                form.FechaMant.value = mantSeleccionado.fechaM;
                form.CostoMant.value = mantSeleccionado.costoM;
                form.ProveedorMant.value = mantSeleccionado.proveedorM;
                form.TelMant.value = mantSeleccionado.telefonoM;
                form.NotasMant.value = mantSeleccionado.notasM;
                
                form.EnviarFbtn.innerText = "Modificar";

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
    let tipoM = form.tipoMant.value;
    let fechaM = form.FechaMant.value;
    let costoM = form.CostoMant.value;
    let proveedorM = form.ProveedorMant.value;
    let telefonoM = form.TelMant.value;
    let notasM = form.NotasMant.value;

    try{
        if(!editStatus){
            await onInsert(
                {tipoM, 
                    fechaM, 
                    costoM, 
                    proveedorM, 
                    telefonoM, 
                    notasM});
            alert("Mantenimiento almacenado correctamente!")
            limpiar();
        }else{
            await onUpdate(idSeleccionado, 
                {tipoM, 
                    fechaM, 
                    costoM, 
                    proveedorM, 
                    telefonoM, 
                    notasM});
            alert("Mantenimiento modificado correctamente!")
            limpiar(); 
        } 
    }catch (error){
        alert("Error!. Detalle: " + error);
    }
});

function limpiar (){
    form.reset();
    form.tipoM.focus();
    form.EnviarFbtn.innerText = "Guardar";
    editStatus = false;
    idSeleccionado= "";
}