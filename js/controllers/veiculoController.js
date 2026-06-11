import { veiculoService } from '../services/veiculoService.js';
import { marcaService } from '../services/marcaService.js';
import { modeloService } from '../services/modeloService.js';

const tabela = document.querySelector('#tabela');
const form = document.querySelector('#formVeiculo');
const selMarca = document.querySelector('#selMarca');
const selModelo = document.querySelector('#selModelo');
const modalBS = new bootstrap.Modal(document.getElementById('modalVeiculo'));

async function carregarDropdowns() {
    try {
        const [marcas, modelos] = await Promise.all([
            marcaService.listar(),
            modeloService.listar()
        ]);

        selMarca.innerHTML = '<option value="" disabled selected>Selecione uma Marca</option>' +
            (marcas || []).map(m => `<option value="${m.id ?? m.ID ?? m.Id}">${m.nome ?? m.Nome ?? ''}</option>`).join('');

        selModelo.innerHTML = '<option value="" disabled selected>Selecione um Modelo</option>' +
            (modelos || []).map(m => `<option value="${m.id ?? m.ID ?? m.Id}">${m.nome ?? m.Nome ?? ''}</option>`).join('');
    } catch (erro) {
        console.error('Erro ao carregar dados dos seletores:', erro);
    }
}

async function atualizarTela() {
    tabela.innerHTML = "";
    try {
        const lista = await veiculoService.listar();
        (lista || []).forEach(v => {
            const descricao = v.descricao ?? v.Descricao ?? 'Sem descrição';
            const ano = v.ano ?? v.Ano ?? '-';
            const horimetro = v.horimetro ?? v.Horimetro ?? '-';
            const id = v.id ?? v.ID ?? v.Id ?? '';

            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${descricao}</td>
                <td>${ano}</td>
                <td>${horimetro}</td>
                <td>
                    <button class="btn btn-danger btn-sm" data-id="${id}">Excluir</button>
                </td>
            `;
            tabela.appendChild(linha);
        });
    } catch (erro) {
        console.error('Erro ao listar veículos:', erro);
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
        const id = document.querySelector('#idV').value;
        const objetoVeiculo = {
            descricao: document.querySelector('#descV').value.trim(),
            ano: parseInt(document.querySelector('#anoV').value, 10) || null,
            horimetro: parseInt(document.querySelector('#horiV').value, 10) || 0,
            marcaId: parseInt(selMarca.value, 10) || null,
            modeloId: parseInt(selModelo.value, 10) || null
        };

        if (id) {
            await veiculoService.atualizar(id, objetoVeiculo);
        } else {
            await veiculoService.cadastrar(objetoVeiculo);
        }

        form.reset();
        document.querySelector('#idV').value = "";
        modalBS.hide();
        atualizarTela();
    } catch (erro) {
        console.error('Erro ao salvar veículo:', erro);
    }
});

tabela.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-danger')) {
        const id = e.target.getAttribute('data-id');
        if (confirm('Deseja apagar este veículo?')) {
            try {
                await veiculoService.excluir(id);
                atualizarTela();
            } catch (erro) {
                console.error('Erro ao excluir veículo:', erro);
            }
        }
    }
});

async function init() {
    await carregarDropdowns();
    await atualizarTela();
}

init();