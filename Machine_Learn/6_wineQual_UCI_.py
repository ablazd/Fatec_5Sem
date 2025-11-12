
"""
Univ da Californa em Irvine (UCI) Machine Learning Repository
https://archive.ics.uci.edu/datasets

NESTA VERSÃO, O CONJUNTO DE DADOS SERÁ DIVIDIDO EM TREINAMENTO E TESTE
PARA ISTO, UMA NOVA CLASSE DA BIBLIOTECA SCIKIT-LEARN SERÁ IMPORTADA
"""
#%% BIBLIOTECAS

# VERIFICAR SE ESTÃO INSTALADAS NO AMBIENTE RNA_env
# python -m pip list

# SENÃO, INSTALAR CONFORME ABAIXO
# python -m pip install scikit-learn - somente uma vez
# python -m pip install ucimlrepo - somente uma vez
# python -m pip install pandas

from sklearn.neural_network import MLPClassifier
# https://scikit-learn.org/stable/modules/generated/sklearn.neural_network.MLPClassifier.html#sklearn.neural_network.MLPClassifier

from sklearn.model_selection import train_test_split   # separa treinamento e teste
from sklearn.metrics import accuracy_score

import pandas as pd 


#%% CARGA DOS DADOS

'''
Univ da Californa em Irvine (UCI) Machine Learning Repository

Dois conjuntos de dados estão incluídos, relacionados a amostras de vinho verde tinto e branco, do norte de Portugal. 
O objetivo é modelar a qualidade do vinho com base em testes físico-químicos 
(consulte [Cortez et al., 2009], http://www3.dsi.uminho.pt/pcortez/wine/).

Variáveis de entrada (com base em testes físico-químicos):
   1 - acidez fixa
   2 - acidez volátil
   3 - ácido cítrico
   4 - açúcar residual
   5 - cloretos
   6 - dióxido de enxofre livre
   7 - dióxido de enxofre total
   8 - densidade
   9 - pH
   10 - sulfatos
   11 - álcool

Variável de saída (com base em dados sensoriais):
   12 - qualidade (pontuação entre 0 e 10)

https://archive.ics.uci.edu/dataset/186

'''

from ucimlrepo import fetch_ucirepo
  
# fetch dataset 
wine_quality = fetch_ucirepo(id=186) 
  
# data (as pandas dataframes) 
X = wine_quality.data.features 
y = wine_quality.data.targets 
  
# metadata - não obrigatório
print('\nMetadados', wine_quality.metadata) 
  
# informações das variáveis  - não obrigatório
print('\nVariaveis', wine_quality.variables) 

print('\nMATRIZ DOS DADOS DE ENTRADA\n', X)      # '\n' linha seguinte
input('Aperte uma tecla para continuar:')
print('\nVETOR DAS CLASSES\n', y)
input('Aperte uma tecla para continuar:')

# X matriz de atributos ou características (campos)
# y vetor de classes (Qualidade)


#%% DIVIDA O CONJUNTO DE DADOS EM TREINAMENTO E TESTE

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    ## test_size=0.2 = 20% dos dados para teste
    ## random_state=42 = "semente" para iniciar o selecionador aleatório de quais dados serão teste
print("\nFormato dados de treinamento", X_train.shape, y_train.shape)
print("Formato dados de teste", X_test.shape, y_test.shape)
input('Aperte uma tecla para continuar:')


#%% CONFIG REDE NEURAL

mlp = MLPClassifier(verbose=True,    # default=False imprime mensagens de progresso
                    hidden_layer_sizes=(10,),  # default (100,)
                    max_iter=1000,   # default=200
                    tol=1e-6,       # default=1e-4
                    activation='logistic')   # default 'relu'

                    # n_iter_no_changeint, default=10
                    # solver{‘lbfgs’, ‘sgd’, ‘adam’}, default=’adam’
                    # batch_size=<N_int>, default=’auto’
                    # learning_rate{‘constant’, ‘invscaling’, ‘adaptive’}, default=’constant’
                    # early_stopping=<bool>, default=False


#%% TREINAMENTO DA REDE

mlp.fit(X_train, y_train)      # executa treinamento - ver terminal


#%% teste um exemplar
'''
   1 - acidez fixa
   2 - acidez volátil
   3 - ácido cítrico
   4 - açúcar residual
   5 - cloretos
   6 - dióxido de enxofre livre
   7 - dióxido de enxofre total
   8 - densidade
   9 - pH
   10 - sulfatos
   11 - álcool
'''
# vinho desconhecido com as medições:          1    2    3    4    5     6     7      8     9    10    11
print('\nQualidade prevista: ', mlp.predict( [[ 7.0, 0.5, 0.2, 2.0, 0.07, 10.0, 50.0, 0.991, 3.3, 0.55, 10.0 ]] ) )
input('Aperte uma tecla para continuar:')


#%% DESEMPENHO SOBRE O CONJUNTO DE TESTE

# Faça previsões
y_pred = mlp.predict(X_test)
print(y_pred.dtype, ' vetor de previsoes = ', y_pred)
input('Aperte uma tecla para continuar:')

# Avalie o desempenho do modelo
accuracy = accuracy_score(y_test, y_pred)
print("\nAcurácia:", accuracy)   # soma dos acertos / nº dados de teste
input('Aperte uma tecla para continuar:')


#%% MATRIZ DE CONFUSÃO
from sklearn.metrics import confusion_matrix

# Calcular a matriz de confusão
matriz_confusao = confusion_matrix(y_test, y_pred)

# Imprimir a matriz de confusão
print("Matriz de Confusão:")
print(matriz_confusao)

# REPRESENTAÇÃO GRÁFICA
# instalar a biblioteca matplolib, se ainda não o fez
# python3.12.exe -m pip install matplotlib

import matplotlib.pyplot as plt
from sklearn.metrics import ConfusionMatrixDisplay

cm = confusion_matrix(y_test, y_pred, labels=mlp.classes_)

display = ConfusionMatrixDisplay(confusion_matrix=cm,
                              display_labels=mlp.classes_)
display.plot()
plt.show()


#%% Tente diferentes combinações de camadas e neurônios
for tam_camada_oculta in [(20,), (40,), (100,), (10, 10), (20, 20), (30, 30), (50, 50)]:
    mlp = MLPClassifier(hidden_layer_sizes = tam_camada_oculta, 
                    max_iter=1000,   # default=200
                    tol=1e-6,       # default=1e-4
                    activation='logistic')   # default 'relu'
    mlp.fit(X_train, y_train)
    y_pred = mlp.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    print("\nAcurácia com ", mlp.hidden_layer_sizes, " neurons:", accuracy)


#%% ALGUNS PARÂMETROS DA REDE

print("\nClasses = ", mlp.classes_)     # lista de classes
print("Erro = ", mlp.loss_)    # fator de perda (erro)
print("Amostras visitadas = ", mlp.t_)     # número de amostras de treinamento visitadas 
print("Atributos de entrada = ", mlp.n_features_in_)   # número de atributos de entrada (campos de X)
print("N ciclos = ", mlp.n_iter_)      # númerode iterações no treinamento
print("N de camadas = ", mlp.n_layers_)    # número de camadas da rede
print("Tamanhos das camadas ocultas: ", mlp.hidden_layer_sizes)
print("N de neurons saida = ", mlp.n_outputs_)   # número de neurons de saida
print("F de ativação = ", mlp.out_activation_)  # função de ativação utilizada

## TEORIA: 
# Verdadeiros e falsos positivos / negativos
# Acurácia, precisão, recall, score F, 