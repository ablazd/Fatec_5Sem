#%% BIBLIOTECAS
# instalar bibloteca Pandas
# python -m pip install pandas

import pandas as pd  # pyright: ignore[reportMissingImports]
from sklearn.neural_network import MLPClassifier  # pyright: ignore[reportMissingImports]

#%% CARGA DOS DADOS
df_jogar = pd.read_csv('jogarTenis.csv')
print('Tabela de dados:\n', df_jogar)
input('Aperte uma tecla para continuar: \n')

#%% SELEÇÃO DOS DADOS
# rotulos ou marcadores
dias = df_jogar['Dia']
print("Rotulos:\n", dias)
input('Aperte uma tecla para continuar: \n')

# matriz de treinamento (registros com campos ou atributos)
X = df_jogar.loc[:, 'Aparencia':'Vento']   # de Aparência até Vento
print("Matriz de entradas (treinamento):\n", X)
input('Aperte uma tecla para continuar: \n')

# vetor de classes
y = df_jogar['Joga']
print("Vetor de classes (treinamento):\n", y)
input('Aperte uma tecla para continuar: \n')

#%% ONE HOT ENCODER - pois os dados são nominais
from sklearn.preprocessing import OneHotEncoder  # pyright: ignore[reportMissingImports]

# One-Hot Encoding
encoder = OneHotEncoder(sparse_output=False)
X = encoder.fit_transform( df_jogar.loc[:, 'Aparencia':'Vento'] )
print("Matriz de entradas codificadas:\n", X)
input('Aperte uma tecla para continuar: \n')

#%% CONFIG REDE NEURAL
mlp = MLPClassifier(verbose=True, 
                    max_iter=2000, 
                    tol=1e-3, 
                    activation='relu')

#%% TREINAMENTO DA REDE
mlp.fit(X,y)      # executa treinamento - ver console

#%% testes
print('\n')
for caso in X :
    print('caso: ', caso, ' previsto: ', mlp.predict([caso]) )

#%% teste de dado "não visto:"
X = ['nublado','fria','alta','fraco']

# X1 = encoder.fit_transform([X])  Não ajustar (fit) para o novo dado!!!
# Em vez, utilize o encoder já gerado:
X1 = encoder.transform([X])
print("\nNovo caso codificado: ", X1)
input('Aperte uma tecla para continuar: \n')

# previsão
print( X, '=', mlp.predict(X1) )
print("\n")

#%% ALGUNS PARÂMETROS DA REDE
print("Classes = ", mlp.classes_)     # lista de classes
print("Erro = ", mlp.loss_)        # fator de perda (erro)
print("Amostras visitadas = ", mlp.t_)           # número de amostras de treinamento visitadas 
print("Atributos de entrada = ", mlp.n_features_in_)   # número de atributos de entrada (campos de X)
print("N ciclos = ", mlp.n_iter_)      # númerode iterações no treinamento
print("N de camadas = ", mlp.n_layers_)    # número de camadas da rede
print("Tamanhos das camadas ocultas: ", mlp.hidden_layer_sizes)
print("N de neurons saida = ", mlp.n_outputs_)   # número de neurons de saida
print("F de ativação = ", mlp.out_activation_)  # função de ativação utilizada
