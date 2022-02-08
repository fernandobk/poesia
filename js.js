
async function init(){
    // Solicitamos datos al servicio
    let obt = await fetch('https://api.jsonbin.io/v3/b/6200bb9bf77b236211eef335', {headers: {'X-Bin-Meta':false}});
    if( obt.status === 200 ){
        localStorage.data = await obt.text();
    }

    window.data = JSON.parse(localStorage.data);
    mostrar_frase();
}

function mostrar_frase(n){
    let i = parseInt(localStorage.index);
    if( isNaN(i) ){ i = window.data.length - 1; }
    
    if( isFinite(n) ){
        i = i + n;
        if( i === -1 ){ i = window.data.length - 1; }
        if( i === window.data.length ){ i = 0; }
    }
    if( n === 0 ){
        i = Math.floor(Math.random() * window.data.length );
    }
    // Almacenamos nuevo índice
    localStorage.index = i;
    
    // Imprimir frase
    frase.innerText = window.data[i].frase;
    pie.innerText = window.data[i].pie;

    return i;
}

async function enviar_frase(){
    let p_frase = prompt('Escribir frase');
    let p_pie = prompt('Escribir pie de la frase');

    window.data.push( {frase: p_frase,pie: p_pie} );
    
    let obt = await fetch(
        'https://api.jsonbin.io/v3/b/6200bb9bf77b236211eef335',
        {
            method: 'PUT',
            body: JSON.stringify(window.data),
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': '$2b$10$e9hka2uXqiI51ffQjR2zj.x.RW11VhFa7yJ5Ydu4x0z58ap1MKsLi', // Aclaración: Esta clave debería estar oculta o en el backend en un proyecto serio.
                'X-Bin-Versioning': false
            }
        }
    );

    if( obt.status === 200 ){
        init();
    } else {
        console.error(obt.json());
        alert(`Error ${obt.status}: ${obt.statusText} \n Ver consola.`);
    }
}