//campos del firmlario
const mascotaInput= document.querySelector("#mascota");
const propietarioInput= document.querySelector("#propietario");
const telefonoInput= document.querySelector("#telefono");
const fechaInput= document.querySelector("#fecha");
const horaInput= document.querySelector("#hora");
const sintomasInput= document.querySelector("#sintomas");

let editando;

//UI
const formulario=document.querySelector("#nueva-cita");
const contenedorCitas= document.querySelector("#citas");

//clases
class citas {
    constructor (){
        this.citas=[];
    }

    agregarCita(cita){
        this.citas=[...this.citas, cita];
    }

    eliminarCita(id){
        this.citas= this.citas.filter (cita => cita.id !== id)  //recorro todas las citas y traigo todas las diferentes a la que le estoy pasando
    }

    editarCita(citaActualizada){
        this.citas=this.citas.map( cita => cita.id===citaActualizada.id ? citaActualizada : cita);  //itera en cada cita, y cuando encuentra la cita que paso con la misma del array de citas, la reemplazo, si no coincide, mantengo la cita actual
    }
}

class UI {
    imprimirAlerta(mensaje, tipo) {
        const divMensaje= document.createElement("div");

        divMensaje.textContent=mensaje;

        if(tipo=== "error"){
            divMensaje.classList.add("error", "mb-2");
        }else{
            divMensaje.classList.add("exito");
        }

       // formulario.appendChild(divMensaje);
        document.querySelector("#uno").insertBefore(divMensaje, document.querySelector("#nueva-cita"))

        setTimeout(()=> {
            divMensaje.remove();
        },3000);
    }

    imprimirCitas({citas}) {
        this.limpiarHTML();

        citas.forEach(cita => {
            const {mascota,propietario,telefono,fecha,hora,sintomas, id}= cita;

            const divCita= document.createElement("div");
            divCita.dataset.id= id;
            divCita.classList.add("cardcard")

            const mascotaParrafo= document.createElement("p");
            mascotaParrafo.textContent= mascota;
            mascotaParrafo.classList.add("text-uppercase", "fs-4")

            const propietarioParrafo= document.createElement("p");
            propietarioParrafo.innerHTML= `<span class="fw-bold"> Propietario: </span> ${propietario}`;

            const telefonoParrafo= document.createElement("p");
            telefonoParrafo.innerHTML=  `<span class="fw-bold"> Telefono: </span> ${telefono}`;

            const fechaParrafo= document.createElement("p");
            fechaParrafo.innerHTML= `<span class="fw-bold"> Fecha: </span> ${fecha}`;

            const horaParrafo= document.createElement("p");
            horaParrafo.innerHTML=  `<span class="fw-bold"> Hora: </span> ${hora}`;

            const sintomasParrafo= document.createElement("p");
            sintomasParrafo.innerHTML=  `<span class="fw-bold"> Sintomas: </span> ${sintomas}`;

            const btnEliminar= document.createElement("button");
            btnEliminar.classList.add("btn", "btn-danger", "me-2")
            btnEliminar.innerHTML='Eliminar';
            btnEliminar.onclick= () => eliminar(id);

            const btnModificar= document.createElement("button");
            btnModificar.classList.add("btn", "btn-success", "me-2")
            btnModificar.innerHTML='Modificar';
            btnModificar.onclick= () => modificar(cita);

            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnModificar);

            contenedorCitas.appendChild(divCita);
        });
    }

    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

const administarCitas= new citas();
const ui= new UI();

//registrar eventos
eventListeners();

function eventListeners(){
    mascotaInput.addEventListener("input", datosCita);
    propietarioInput.addEventListener("input", datosCita);
    telefonoInput.addEventListener("input", datosCita);
    fechaInput.addEventListener("input", datosCita);
    horaInput.addEventListener("input", datosCita);
    sintomasInput.addEventListener("input", datosCita);

    formulario.addEventListener("submit", nuevaCita);
}

//objeto principal
const citaObj={
    mascota: "",
    propietario: "",
    telefono: "",
    fecha: "",
    hora: "",
    sintomas:""
}

//funciones
function datosCita(e){
    const campo= e.target.name;
    const valor= e.target.value;

    citaObj[campo]= valor;
}

function nuevaCita(e){
    e.preventDefault();

    const {mascota,propietario,telefono,fecha,hora,sintomas}= citaObj;

    if(mascota ==="" || propietario ==="" || telefono ==="" || fecha ==="" || hora ==="" || sintomas ===""){
        ui.imprimirAlerta("todos los campos son obligatorios", "error");
        return;
    }

    //saber si estoy en modo edicion o no
    if(editando===true){
        //console.log("estoy editando")
        administarCitas.editarCita( {...citaObj } );
        ui.imprimirAlerta("Modificacion exitosa", "exito");
        editando=false;
    }
    else{
        //console.log("creando cita")
        citaObj.id= Date.now();
        administarCitas.agregarCita({...citaObj});
        ui.imprimirAlerta("Se agrego correctamente", "exito");
    }

    formulario.reset();
    reiniciarObjeto();
    
    ui.imprimirCitas(administarCitas);
}

function reiniciarObjeto(){
    citaObj.mascota= "";
    citaObj.propietario= "";
    citaObj.telefono= "";
    citaObj.fecha= "";
    citaObj.hora= "";
    citaObj.sintomas="";
}

function eliminar(id){
    administarCitas.eliminarCita(id);
    ui.imprimirAlerta("la cita se elimino", "error");
    ui.imprimirCitas(administarCitas);
}

function modificar(cita){
    const {mascota,propietario,telefono,fecha,hora,sintomas, id}= cita;

    mascotaInput.value=mascota;
    propietarioInput.value= propietario;
    telefonoInput.value= telefono;
    fechaInput.value= fecha;
    horaInput.value= hora;
    sintomasInput.value= sintomas;

    citaObj.mascota= mascota;
    citaObj.propietario= propietario;
    citaObj.telefono= telefono;
    citaObj.fecha= fecha;
    citaObj.hora= hora;
    citaObj.sintomas=sintomas;
    citaObj.id=id;

    editando=true;
}