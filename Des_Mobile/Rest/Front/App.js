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
      if (cepLimpo.length === 8) {
        const response = await fetch(url + '/api/cep/' + cepLimpo);
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
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf
          }
        }));
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao buscar CEP: ' + error.message);
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
      <Text style={styles.title}>Sistema de Gestão de Alunos</Text>
      
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => {
          setTelaAtual('listar');
          carregarAlunos();
        }}
      >
        <Text style={styles.menuButtonText}>📋 Listar Alunos</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => {
          limparFormulario();
          setTelaAtual('adicionar');
        }}
      >
        <Text style={styles.menuButtonText}>➕ Adicionar Aluno</Text>
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
        <Text style={styles.menuButtonText}>🔍 Testar CEP</Text>
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
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Lista de Alunos</Text>
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={carregarAlunos}
        >
          <Text style={styles.refreshButtonText}>🔄</Text>
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
                  <Text style={styles.actionButtonText}>👁️ Ver</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => {
                    setAlunoSelecionado(item);
                    preencherFormulario(item);
                    setTelaAtual('editar');
                  }}
                >
                  <Text style={styles.actionButtonText}>✏️ Editar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => deletarAluno(item._id, item.nome)}
                >
                  <Text style={styles.actionButtonText}>🗑️ Excluir</Text>
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
          <Text style={styles.backButtonText}>← Voltar</Text>
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
          <Text style={styles.backButtonText}>← Voltar</Text>
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  menuButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    margin: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  menuButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  refreshButton: {
    padding: 10,
  },
  refreshButtonText: {
    fontSize: 20,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 50,
    color: '#666',
  },
  alunoCard: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alunoNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  alunoMatricula: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  alunoEndereco: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  alunoActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  actionButton: {
    padding: 8,
    borderRadius: 5,
    minWidth: 60,
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: '#34C759',
  },
  editButton: {
    backgroundColor: '#FF9500',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  form: {
    padding: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  cepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cepInput: {
    flex: 1,
    marginRight: 10,
  },
  cepButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
  },
  cepButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginRight: 10,
  },
  cursoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cursoInput: {
    flex: 1,
    marginRight: 10,
  },
  cursoButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cursoButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cursosList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  cursoItem: {
    backgroundColor: '#E3F2FD',
    padding: 8,
    margin: 5,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cursoText: {
    marginRight: 8,
    fontSize: 14,
  },
  cursoRemoveButton: {
    backgroundColor: '#FF3B30',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cursoRemoveText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  alunoDetails: {
    padding: 15,
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  cursoDetail: {
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
    marginBottom: 5,
  },
});
