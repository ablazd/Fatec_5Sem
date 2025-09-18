import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TextInput, Alert, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function App() {
  // Configuração da URL
  const url = 'http://192.168.50.69:3000';
  
  // Estados para controle de telas e dados
  const [telaAtual, setTelaAtual] = useState('menu'); // menu, listar, adicionar, editar, visualizar
  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Estados para formulário de adicionar/editar
  const [formData, setFormData] = useState({
    matricula: '',
    nome: '',
    endereco: {
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    },
    cursos: []
  });
  const [novoCurso, setNovoCurso] = useState('');

  // Carregar alunos
  const carregarAlunos = async () => {
    setLoading(true);
    try {
      const response = await fetch(url + '/api/alunos');
      const data = await response.json();
      setAlunos(data);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar alunos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Buscar CEP
  const buscarCEP = async (cep) => {
    try {
      const cepLimpo = cep.replace(/\D/g, '');
      
      if (cepLimpo.length !== 8) {
        Alert.alert('Erro', 'CEP deve ter 8 dígitos');
        return;
      }

      setLoading(true);
      const response = await fetch(url + '/api/cep/' + cepLimpo);
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.erro) {
        Alert.alert('Erro', 'CEP não encontrado');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          cep: cep,
          logradouro: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || ''
        }
      }));
      
      Alert.alert('Sucesso', 'CEP encontrado e preenchido automaticamente!');
      
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      Alert.alert('Erro', 'Erro ao buscar CEP: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Adicionar curso
  const adicionarCurso = () => {
    if (novoCurso.trim() && !formData.cursos.includes(novoCurso.trim())) {
      setFormData(prev => ({
        ...prev,
        cursos: [...prev.cursos, novoCurso.trim()]
      }));
      setNovoCurso('');
    }
  };

  // Remover curso
  const removerCurso = (index) => {
    setFormData(prev => ({
      ...prev,
      cursos: prev.cursos.filter((_, i) => i !== index)
    }));
  };

  // Salvar aluno
  const salvarAluno = async () => {
    if (!formData.matricula || !formData.nome) {
      Alert.alert('Erro', 'Matrícula e nome são obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const method = telaAtual === 'editar' ? 'PUT' : 'POST';
      const urlCompleta = telaAtual === 'editar' 
        ? url + '/api/alunos/' + alunoSelecionado._id
        : url + '/api/alunos';

      const response = await fetch(urlCompleta, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        Alert.alert('Sucesso', telaAtual === 'editar' ? 'Aluno atualizado!' : 'Aluno criado!');
        limparFormulario();
        setTelaAtual('listar');
        carregarAlunos();
      } else {
        Alert.alert('Erro', data.error || 'Erro ao salvar aluno');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar aluno: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Deletar aluno
  const deletarAluno = async (id, nome) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o aluno "${nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await fetch(url + '/api/alunos/' + id, {
                method: 'DELETE'
              });
              
              if (response.ok) {
                Alert.alert('Sucesso', 'Aluno excluído!');
                carregarAlunos();
              } else {
                const data = await response.json();
                Alert.alert('Erro', data.error || 'Erro ao excluir aluno');
              }
            } catch (error) {
              Alert.alert('Erro', 'Erro ao excluir aluno: ' + error.message);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // Limpar formulário
  const limparFormulario = () => {
    setFormData({
      matricula: '',
      nome: '',
      endereco: {
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: ''
      },
      cursos: []
    });
    setNovoCurso('');
  };

  // Preencher formulário para edição
  const preencherFormulario = (aluno) => {
    setFormData({
      matricula: aluno.matricula,
      nome: aluno.nome,
      endereco: aluno.endereco || {
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: ''
      },
      cursos: aluno.cursos || []
    });
  };

  // Renderizar tela do menu
  const renderMenu = () => (
    <View style={styles.container}>
      <Text style={styles.title}>Gestão de Alunos</Text>
      
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => {
          setTelaAtual('listar');
          carregarAlunos();
        }}
      >
        <Text style={styles.menuButtonText}>Listar Alunos</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => {
          limparFormulario();
          setTelaAtual('adicionar');
        }}
      >
        <Text style={styles.menuButtonText}>Adicionar Aluno</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => {
          fetch(url + '/api/cep/01310100')
            .then(response => response.json())
            .then(data => {
              Alert.alert('Teste CEP', JSON.stringify(data, null, 2));
            })
            .catch(error => Alert.alert('Erro', error.message));
        }}
      >
        <Text style={styles.menuButtonText}>Testar CEP</Text>
      </TouchableOpacity>
    </View>
  );

  // Renderizar lista de alunos
  const renderListaAlunos = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setTelaAtual('menu')}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Lista de Alunos</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={carregarAlunos}
        >
          <Text style={styles.refreshButtonText}>↻</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Carregando...</Text>
      ) : (
        <FlatList
          data={alunos}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.alunoCard}>
              <Text style={styles.alunoNome}>{item.nome}</Text>
              <Text style={styles.alunoMatricula}>Matrícula: {item.matricula}</Text>
              <Text style={styles.alunoEndereco}>
                {item.endereco?.cidade}, {item.endereco?.estado}
              </Text>
              
              <View style={styles.alunoActions}>
                <TouchableOpacity 
                  style={[styles.actionButton, styles.viewButton]}
                  onPress={() => {
                    setAlunoSelecionado(item);
                    setTelaAtual('visualizar');
                  }}
                >
                  <Text style={styles.actionButtonText}>Ver</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => {
                    setAlunoSelecionado(item);
                    preencherFormulario(item);
                    setTelaAtual('editar');
                  }}
                >
                  <Text style={styles.actionButtonText}>Editar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => deletarAluno(item._id, item.nome)}
                >
                  <Text style={styles.actionButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );

  // Renderizar formulário de adicionar/editar
  const renderFormulario = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setTelaAtual('listar')}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {telaAtual === 'editar' ? 'Editar Aluno' : 'Adicionar Aluno'}
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Matrícula *</Text>
        <TextInput
          style={styles.input}
          value={formData.matricula}
          onChangeText={(text) => setFormData(prev => ({ ...prev, matricula: text }))}
          placeholder="Digite a matrícula"
        />

        <Text style={styles.label}>Nome Completo *</Text>
        <TextInput
          style={styles.input}
          value={formData.nome}
          onChangeText={(text) => setFormData(prev => ({ ...prev, nome: text }))}
          placeholder="Digite o nome completo"
        />

        <Text style={styles.sectionTitle}>Endereço</Text>
        
        <Text style={styles.label}>CEP</Text>
        <View style={styles.cepContainer}>
          <TextInput
            style={[styles.input, styles.cepInput]}
            value={formData.endereco.cep}
            onChangeText={(text) => {
              const formatted = text.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2');
              setFormData(prev => ({
                ...prev,
                endereco: { ...prev.endereco, cep: formatted }
              }));
            }}
            placeholder="00000-000"
            maxLength={9}
          />
          <TouchableOpacity 
            style={styles.cepButton}
            onPress={() => buscarCEP(formData.endereco.cep)}
          >
            <Text style={styles.cepButtonText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Logradouro</Text>
        <TextInput
          style={styles.input}
          value={formData.endereco.logradouro}
          onChangeText={(text) => setFormData(prev => ({
            ...prev,
            endereco: { ...prev.endereco, logradouro: text }
          }))}
          placeholder="Rua, Avenida, etc."
        />

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Número</Text>
            <TextInput
              style={styles.input}
              value={formData.endereco.numero}
              onChangeText={(text) => setFormData(prev => ({
                ...prev,
                endereco: { ...prev.endereco, numero: text }
              }))}
              placeholder="123"
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Complemento</Text>
            <TextInput
              style={styles.input}
              value={formData.endereco.complemento}
              onChangeText={(text) => setFormData(prev => ({
                ...prev,
                endereco: { ...prev.endereco, complemento: text }
              }))}
              placeholder="Apto, Casa, etc."
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Bairro</Text>
            <TextInput
              style={styles.input}
              value={formData.endereco.bairro}
              onChangeText={(text) => setFormData(prev => ({
                ...prev,
                endereco: { ...prev.endereco, bairro: text }
              }))}
              placeholder="Bairro"
            />
          </View>
          <View style={styles.halfInput}>
            <Text style={styles.label}>Cidade</Text>
            <TextInput
              style={styles.input}
              value={formData.endereco.cidade}
              onChangeText={(text) => setFormData(prev => ({
                ...prev,
                endereco: { ...prev.endereco, cidade: text }
              }))}
              placeholder="Cidade"
            />
          </View>
        </View>

        <Text style={styles.label}>Estado</Text>
        <TextInput
          style={styles.input}
          value={formData.endereco.estado}
          onChangeText={(text) => setFormData(prev => ({
            ...prev,
            endereco: { ...prev.endereco, estado: text }
          }))}
          placeholder="Estado"
        />

        <Text style={styles.sectionTitle}>Cursos</Text>
        <View style={styles.cursoContainer}>
          <TextInput
            style={[styles.input, styles.cursoInput]}
            value={novoCurso}
            onChangeText={setNovoCurso}
            placeholder="Digite um curso"
          />
          <TouchableOpacity 
            style={styles.cursoButton}
            onPress={adicionarCurso}
          >
            <Text style={styles.cursoButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cursosList}>
          {formData.cursos.map((curso, index) => (
            <View key={index} style={styles.cursoItem}>
              <Text style={styles.cursoText}>{curso}</Text>
              <TouchableOpacity 
                style={styles.cursoRemoveButton}
                onPress={() => removerCurso(index)}
              >
                <Text style={styles.cursoRemoveText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.saveButton}
          onPress={salvarAluno}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Salvando...' : 'Salvar Aluno'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // Renderizar visualização de aluno
  const renderVisualizarAluno = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setTelaAtual('listar')}
        >
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Detalhes do Aluno</Text>
      </View>

      {alunoSelecionado && (
        <View style={styles.alunoDetails}>
          <Text style={styles.detailTitle}>Informações Pessoais</Text>
          <Text style={styles.detailLabel}>Nome:</Text>
          <Text style={styles.detailValue}>{alunoSelecionado.nome}</Text>
          
          <Text style={styles.detailLabel}>Matrícula:</Text>
          <Text style={styles.detailValue}>{alunoSelecionado.matricula}</Text>

          <Text style={styles.detailTitle}>Endereço</Text>
          <Text style={styles.detailLabel}>CEP:</Text>
          <Text style={styles.detailValue}>{alunoSelecionado.endereco?.cep || 'N/A'}</Text>
          
          <Text style={styles.detailLabel}>Logradouro:</Text>
          <Text style={styles.detailValue}>{alunoSelecionado.endereco?.logradouro || 'N/A'}</Text>
          
          <Text style={styles.detailLabel}>Número:</Text>
          <Text style={styles.detailValue}>{alunoSelecionado.endereco?.numero || 'N/A'}</Text>
          
          <Text style={styles.detailLabel}>Complemento:</Text>
          <Text style={styles.detailValue}>{alunoSelecionado.endereco?.complemento || 'N/A'}</Text>
          
          <Text style={styles.detailLabel}>Bairro:</Text>
          <Text style={styles.detailValue}>{alunoSelecionado.endereco?.bairro || 'N/A'}</Text>
          
          <Text style={styles.detailLabel}>Cidade:</Text>
          <Text style={styles.detailValue}>{alunoSelecionado.endereco?.cidade || 'N/A'}</Text>
          
          <Text style={styles.detailLabel}>Estado:</Text>
          <Text style={styles.detailValue}>{alunoSelecionado.endereco?.estado || 'N/A'}</Text>

          <Text style={styles.detailTitle}>Cursos</Text>
          {alunoSelecionado.cursos && alunoSelecionado.cursos.length > 0 ? (
            alunoSelecionado.cursos.map((curso, index) => (
              <Text key={index} style={styles.cursoDetail}>• {curso}</Text>
            ))
          ) : (
            <Text style={styles.detailValue}>Nenhum curso cadastrado</Text>
          )}
        </View>
      )}
    </ScrollView>
  );

  // Renderizar tela atual
  const renderTelaAtual = () => {
    switch (telaAtual) {
      case 'menu':
        return renderMenu();
      case 'listar':
        return renderListaAlunos();
      case 'adicionar':
      case 'editar':
        return renderFormulario();
      case 'visualizar':
        return renderVisualizarAluno();
      default:
        return renderMenu();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {renderTelaAtual()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef2f2',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 20,
    color: '#7c2d12',
  },
  menuButton: {
    backgroundColor: '#dc2626',
    padding: 16,
    margin: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#dc2626',
    fontSize: 16,
    fontWeight: '500',
  },
  refreshButton: {
    padding: 8,
  },
  refreshButtonText: {
    fontSize: 18,
    color: '#7c2d12',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 50,
    color: '#6b7280',
  },
  alunoCard: {
    backgroundColor: '#ffffff',
    margin: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  alunoNome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  alunoMatricula: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  alunoEndereco: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  alunoActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  actionButton: {
    padding: 10,
    borderRadius: 6,
    minWidth: 70,
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: '#7c2d12',
  },
  editButton: {
    backgroundColor: '#dc2626',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
    color: '#1f2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#1f2937',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
    color: '#7c2d12',
  },
  cepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cepInput: {
    flex: 1,
    marginRight: 12,
  },
  cepButton: {
    backgroundColor: '#dc2626',
    padding: 12,
    borderRadius: 8,
  },
  cepButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginRight: 12,
  },
  cursoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cursoInput: {
    flex: 1,
    marginRight: 12,
  },
  cursoButton: {
    backgroundColor: '#dc2626',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cursoButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  cursosList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  cursoItem: {
    backgroundColor: '#fef2f2',
    padding: 8,
    margin: 4,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.2)',
  },
  cursoText: {
    marginRight: 8,
    fontSize: 14,
    color: '#7c2d12',
    fontWeight: '500',
  },
  cursoRemoveButton: {
    backgroundColor: '#ef4444',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cursoRemoveText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#dc2626',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  alunoDetails: {
    padding: 16,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
    color: '#7c2d12',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 12,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 8,
  },
  cursoDetail: {
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 12,
    marginBottom: 8,
  },
});
