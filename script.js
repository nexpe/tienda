
const categoriaMostrar = window.categoriaMostrar || "moto";
let productoActual="", precioActual=0;
let carrito = JSON.parse(localStorage.getItem("carritoMoto")) || [];
const carritoDiv=document.getElementById("carrito");

// ===== CONFIGURA AQUI LA CATEGORIA =====
//const categoriaMostrar = "persona"; 
// cambia a "persona" si quieres esa categoría

function toggleCarrito(){
  carritoDiv.classList.toggle("show");
}

function guardar(){
  localStorage.setItem("carritoMoto",JSON.stringify(carrito));
}

function abrirModal(nombre,precio){
  productoActual=nombre;
  precioActual=precio;
  nombreProd.innerText=nombre;
  document.getElementById("cantidad").value=1;
  modal.style.display="flex";
}

function agregar(){
  let cant=parseInt(document.getElementById("cantidad").value);
  carrito.push({nombre:productoActual,precio:precioActual,cantidad:cant});
  modal.style.display="none";
  guardar();
  actualizarCarrito();
}

function eliminar(i){
  carrito.splice(i,1);
  guardar();
  actualizarCarrito();
}

function vaciarCarrito(){
  if(confirm("Vaciar carrito?")){
    carrito=[];
    guardar();
    actualizarCarrito();
  }
}

function actualizarCarrito(){
  let lista=document.getElementById("lista");
  lista.innerHTML="";
  let total=0;

  carrito.forEach((p,i)=>{
    lista.innerHTML+=`
    <div class="item">
      <div>
        <b>${p.nombre}</b><br>
        ${p.cantidad} x S/ ${p.precio}
      </div>
      <button class="quitar" onclick="eliminar(${i})">✖</button>
    </div>`;
    
    total+=p.precio*p.cantidad;
  });

  document.getElementById("total").innerText="Total S/ "+total;
  document.getElementById("contador").innerText=carrito.length;
}

function enviarWhatsApp(){
  let texto="Pedido:%0A";
  let total=0;

  carrito.forEach(p=>{
    texto+=`${p.nombre} x${p.cantidad} S/${p.precio}%0A`;
    total+=p.precio*p.cantidad;
  });

  texto+="Total S/"+total;
  window.open("https://wa.me/51989660431?text="+texto,"_blank");
}


// ===== CARGAR CSV =====
fetch('productos.csv')
.then(r=>r.text())
.then(data=>{

  const tienda=document.getElementById('tienda');
  const filas=data.trim().split('\n');
  const productos=[];

  for(let i=1;i<filas.length;i++){

    const cols=filas[i].split(',');

    if(cols.length>=4){

      const precioLista=parseFloat(cols[0].trim());
      const precioVenta=parseFloat(cols[1].trim());
      const categoria=cols[2].trim().toLowerCase();
      const imagen=cols[3].trim();

      // FILTRO POR CATEGORIA
      if(categoria!==categoriaMostrar) continue;

      let nombre=imagen.split('/').pop().split('.')[0];

      nombre=nombre.replace(/^\d+[_-]?/,'');
      nombre=nombre.replace(/[_-]/g,' ')
                   .replace(/\b\w/g,l=>l.toUpperCase());

      productos.push({
        nombre,
        precio:precioVenta,
        imagen,
        precioLista
      });
    }
  }

  productos.sort((a,b)=>a.imagen.localeCompare(b.imagen));

  productos.forEach(p=>{
    const div=document.createElement('div');
    div.className='producto';

    div.innerHTML=`
      <img src="${p.imagen}">
      <h3>${p.nombre}</h3>
      <div class="precio">S/ ${p.precio}</div>
      <button class="btn" onclick="abrirModal('${p.nombre}',${p.precio})">
        Comprar
      </button>`;

    tienda.appendChild(div);
  });

});

actualizarCarrito();
