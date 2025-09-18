// Variáveis globais
let cursos = [];
let editCursos = [];
let modoEdicao = false;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Máscara para CEP
    document.getElementById('cep').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = value;
    });

    document.getElementById('editCep').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        value = value.replace(/(\d{5})(\d)/, '$1-$2');
        e.target.value = value;
    });

    // Event listeners
    document.getElementById('alunoForm').addEventListener('submit', salvarAluno);
    
    // Carregar alunos na inicialização
    carregarAlunos();
});

// Funções de navegação
function showSection(sectionName) {
    // Esconder todas as seções
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    // Mostrar seção selecionada
    const section = document.getElementById(sectionName + '-section');
    section.style.display = 'block';
    section.classList.add('active');
    
    // Ações específicas por seção
    if (sectionName === 'list') {
        carregarAlunos();
    } else if (sectionName === 'add') {
        limparFormulario();
    }
}

// Funções de CEP
async function buscarCEP() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        alert('CEP deve ter 8 dígitos');
        return;
    }
    
    try {
        // Mostrar loading
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Buscando...';
        button.disabled = true;
        
        const response = await fetch(`/api/cep/${cep}`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.erro) {
            alert('CEP não encontrado');
            return;
        }
        
        // Preencher campos automaticamente
        document.getElementById('logradouro').value = data.logradouro || '';
        document.getElementById('bairro').value = data.bairro || '';
        document.getElementById('cidade').value = data.localidade || '';
        document.getElementById('estado').value = data.uf || '';
        
        alert('CEP encontrado e preenchido automaticamente!');
        
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar CEP: ' + error.message);
    } finally {
        // Restaurar botão
        const button = event.target;
        button.textContent = 'Buscar';
        button.disabled = false;
    }
}

async function buscarCEPModal() {
    const cep = document.getElementById('editCep').value.replace(/\D/g, '');
    
    if (cep.length !== 8) {
        alert('CEP deve ter 8 dígitos');
        return;
    }
    
    try {
        // Mostrar loading
        const button = event.target;
        const originalText = button.textContent;
        button.textContent = 'Buscando...';
        button.disabled = true;
        
        const response = await fetch(`/api/cep/${cep}`);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.erro) {
            alert('CEP não encontrado');
            return;
        }
        
        // Preencher campos automaticamente
        document.getElementById('editLogradouro').value = data.logradouro || '';
        document.getElementById('editBairro').value = data.bairro || '';
        document.getElementById('editCidade').value = data.localidade || '';
        document.getElementById('editEstado').value = data.uf || '';
        
        alert('CEP encontrado e preenchido automaticamente!');
        
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        alert('Erro ao buscar CEP: ' + error.message);
    } finally {
        // Restaurar botão
        const button = event.target;
        button.textContent = 'Buscar';
        button.disabled = false;
    }
}

// Funções de cursos
function adicionarCurso() {
    const cursoInput = document.getElementById('cursoInput');
    const curso = cursoInput.value.trim();
    
    if (curso && !cursos.includes(curso)) {
        cursos.push(curso);
        cursoInput.value = '';
        atualizarListaCursos();
    }
}

function adicionarCursoModal() {
    const cursoInput = document.getElementById('editCursoInput');
    const curso = cursoInput.value.trim();
    
    if (curso && !editCursos.includes(curso)) {
        editCursos.push(curso);
        cursoInput.value = '';
        atualizarListaCursosModal();
    }
}

function removerCurso(index) {
    cursos.splice(index, 1);
    atualizarListaCursos();
}

function removerCursoModal(index) {
    editCursos.splice(index, 1);
    atualizarListaCursosModal();
}

function atualizarListaCursos() {
    const container = document.getElementById('cursosList');
    container.innerHTML = '';
    
    cursos.forEach((curso, index) => {
        const badge = document.createElement('div');
        badge.className = 'curso-item';
        badge.innerHTML = `
            ${curso}
            <button type="button" class="btn-close" onclick="removerCurso(${index})"></button>
        `;
        container.appendChild(badge);
    });
}

function atualizarListaCursosModal() {
    const container = document.getElementById('editCursosList');
    container.innerHTML = '';
    
    editCursos.forEach((curso, index) => {
        const badge = document.createElement('div');
        badge.className = 'curso-item';
        badge.innerHTML = `
            ${curso}
            <button type="button" class="btn-close" onclick="removerCursoModal(${index})"></button>
        `;
        container.appendChild(badge);
    });
}

// Funções de formulário
function limparFormulario() {
    document.getElementById('alunoForm').reset();
    cursos = [];
    atualizarListaCursos();
}

// Funções de CRUD
async function salvarAluno(e) {
    e.preventDefault();
    
    const formData = {
        matricula: document.getElementById('matricula').value,
        nome: document.getElementById('nome').value,
        endereco: {
            cep: document.getElementById('cep').value,
            logradouro: document.getElementById('logradouro').value,
            numero: document.getElementById('numero').value,
            complemento: document.getElementById('complemento').value,
            bairro: document.getElementById('bairro').value,
            cidade: document.getElementById('cidade').value,
            estado: document.getElementById('estado').value
        },
        cursos: cursos
    };
    
    try {
        const response = await fetch('/api/alunos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Aluno salvo com sucesso!');
            limparFormulario();
            showSection('list');
        } else {
            alert('Erro: ' + result.error);
        }
    } catch (error) {
        alert('Erro ao salvar aluno: ' + error.message);
    }
}

async function carregarAlunos() {
    const container = document.getElementById('alunosList');
    container.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Carregando...</span></div></div>';
    
    try {
        const response = await fetch('/api/alunos');
        const alunos = await response.json();
        
        if (alunos.length === 0) {
            container.innerHTML = '<div class="alert alert-info text-center">Nenhum aluno cadastrado</div>';
            return;
        }
        
        let html = `
            <table class="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Matrícula</th>
                        <th>Nome</th>
                        <th>Cidade/UF</th>
                        <th>Cursos</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        alunos.forEach(aluno => {
            const endereco = aluno.endereco ? `${aluno.endereco.cidade}/${aluno.endereco.estado}` : 'N/A';
            const cursosStr = aluno.cursos && aluno.cursos.length > 0 ? aluno.cursos.join(', ') : 'Nenhum';
            
            html += `
                <tr>
                    <td>${aluno.matricula}</td>
                    <td>${aluno.nome}</td>
                    <td>${endereco}</td>
                    <td><small>${cursosStr}</small></td>
                    <td>
                        <div class="btn-group" role="group">
                            <button class="btn btn-sm btn-outline-primary" onclick="visualizarAluno('${aluno._id}')" title="Visualizar">
                                Ver
                            </button>
                            <button class="btn btn-sm btn-outline-secondary" onclick="editarAluno('${aluno._id}')" title="Editar">
                                Editar
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="confirmarExclusao('${aluno._id}', '${aluno.nome}')" title="Excluir">
                                Excluir
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        container.innerHTML = html;
        
    } catch (error) {
        container.innerHTML = '<div class="alert alert-danger">Erro ao carregar alunos: ' + error.message + '</div>';
    }
}

async function visualizarAluno(id) {
    try {
        const response = await fetch(`/api/alunos/${id}`);
        const aluno = await response.json();
        
        if (response.ok) {
            preencherModal(aluno, false);
            document.getElementById('modalTitle').textContent = 'Detalhes do Aluno';
            document.getElementById('saveBtn').style.display = 'none';
            document.getElementById('deleteBtn').style.display = 'none';
            
            // Desabilitar campos para visualização
            const modal = document.getElementById('alunoModal');
            const inputs = modal.querySelectorAll('input');
            inputs.forEach(input => input.disabled = true);
            
            new bootstrap.Modal(modal).show();
        } else {
            alert('Erro: ' + aluno.error);
        }
    } catch (error) {
        alert('Erro ao carregar aluno: ' + error.message);
    }
}

async function editarAluno(id) {
    try {
        const response = await fetch(`/api/alunos/${id}`);
        const aluno = await response.json();
        
        if (response.ok) {
            preencherModal(aluno, true);
            document.getElementById('modalTitle').textContent = 'Editar Aluno';
            document.getElementById('saveBtn').style.display = 'inline-block';
            document.getElementById('deleteBtn').style.display = 'inline-block';
            
            // Habilitar campos para edição
            const modal = document.getElementById('alunoModal');
            const inputs = modal.querySelectorAll('input');
            inputs.forEach(input => input.disabled = false);
            
            modoEdicao = true;
            new bootstrap.Modal(modal).show();
        } else {
            alert('Erro: ' + aluno.error);
        }
    } catch (error) {
        alert('Erro ao carregar aluno: ' + error.message);
    }
}

function preencherModal(aluno, isEdit) {
    document.getElementById('editId').value = aluno._id;
    document.getElementById('editMatricula').value = aluno.matricula;
    document.getElementById('editNome').value = aluno.nome;
    
    if (aluno.endereco) {
        document.getElementById('editCep').value = aluno.endereco.cep || '';
        document.getElementById('editLogradouro').value = aluno.endereco.logradouro || '';
        document.getElementById('editNumero').value = aluno.endereco.numero || '';
        document.getElementById('editComplemento').value = aluno.endereco.complemento || '';
        document.getElementById('editBairro').value = aluno.endereco.bairro || '';
        document.getElementById('editCidade').value = aluno.endereco.cidade || '';
        document.getElementById('editEstado').value = aluno.endereco.estado || '';
    }
    
    editCursos = aluno.cursos ? [...aluno.cursos] : [];
    atualizarListaCursosModal();
}

async function salvarEdicao() {
    const id = document.getElementById('editId').value;
    
    const formData = {
        matricula: document.getElementById('editMatricula').value,
        nome: document.getElementById('editNome').value,
        endereco: {
            cep: document.getElementById('editCep').value,
            logradouro: document.getElementById('editLogradouro').value,
            numero: document.getElementById('editNumero').value,
            complemento: document.getElementById('editComplemento').value,
            bairro: document.getElementById('editBairro').value,
            cidade: document.getElementById('editCidade').value,
            estado: document.getElementById('editEstado').value
        },
        cursos: editCursos
    };
    
    try {
        const response = await fetch(`/api/alunos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Aluno atualizado com sucesso!');
            bootstrap.Modal.getInstance(document.getElementById('alunoModal')).hide();
            carregarAlunos();
        } else {
            alert('Erro: ' + result.error);
        }
    } catch (error) {
        alert('Erro ao atualizar aluno: ' + error.message);
    }
}

async function deletarAluno() {
    const id = document.getElementById('editId').value;
    
    try {
        const response = await fetch(`/api/alunos/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Aluno excluído com sucesso!');
            bootstrap.Modal.getInstance(document.getElementById('alunoModal')).hide();
            carregarAlunos();
        } else {
            alert('Erro: ' + result.error);
        }
    } catch (error) {
        alert('Erro ao excluir aluno: ' + error.message);
    }
}

function confirmarExclusao(id, nome) {
    if (confirm(`Tem certeza que deseja excluir o aluno "${nome}"?`)) {
        deletarAlunoDireto(id);
    }
}

async function deletarAlunoDireto(id) {
    try {
        const response = await fetch(`/api/alunos/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Aluno excluído com sucesso!');
            carregarAlunos();
        } else {
            alert('Erro: ' + result.error);
        }
    } catch (error) {
        alert('Erro ao excluir aluno: ' + error.message);
    }
}

// Reset do modal quando fechado
document.getElementById('alunoModal').addEventListener('hidden.bs.modal', function() {
    modoEdicao = false;
    editCursos = [];
    atualizarListaCursosModal();
    
    // Reabilitar todos os campos
    const inputs = this.querySelectorAll('input');
    inputs.forEach(input => input.disabled = false);
});
