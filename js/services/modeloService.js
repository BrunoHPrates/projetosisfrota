<<<<<<< HEAD
const URL = "https://x8ki-letl-twmt.n7.xano.io/api:RVfx6S4N/modelo";
=======
const URL = "https://x8ki-letl-twmt.n7.xano.io/api:ijUECDHD/modelo";
>>>>>>> 4164a8fa02f74748850aa5378fb3797b75f9dcd9
export const modeloService = {
    listar: () => fetch(URL).then(r => r.json()),
    cadastrar: (d) => fetch(URL, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(d) }),
    atualizar: (id, d) => fetch(`${URL}/${id}`, { method: 'PATCH', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(d) }),
    excluir: (id) => fetch(`${URL}/${id}`, { method: 'DELETE' })
};