
"""
Univ da Californa em Irvine (UCI) Machine Learning Repository
https://archive.ics.uci.edu/datasets
"""
#%% BIBLIOTECAS

# pip install scikit-learn - somente uma vez

from sklearn.neural_network import MLPClassifier

# deve instalar a biblioteca Pandas junto
# python -m pip install pandas

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

https://archive.ics.uci.edu/dataset/292/wholesale+customers

'''

# python -m pip install ucimlrepo - somente uma vez

from ucimlrepo import fetch_ucirepo
  
# fetch dataset 
wine_quality = fetch_ucirepo(id=186) 
  
# data (as pandas dataframes) 
X = wine_quality.data.features 
y = wine_quality.data.targets 
  
# metadata 
print('\nMetadados', wine_quality.metadata) 
  
# variable information 
print('\nVariaveis', wine_quality.variables) 

print('\n', X)      # '\n' linha seguinte
input('Aperte uma tecla para continuar:')
print('\n', y)
input('Aperte uma tecla para continuar:')

# X matriz de atributos ou características (campos)
# y vetor de classes (Qualidade)


#%% CONFIG REDE NEURAL

mlp = MLPClassifier()

# mlp.fit(X,y)      # executa treinamento - ver console - insuficiente

mlp = MLPClassifier(verbose=True, 
                    hidden_layer_sizes=(10,5), 
                    max_iter=10000, 
                    tol=1e-6, 
                    activation='logistic')

#%% TREINAMENTO DA REDE

mlp.fit(X,y)      # executa treinamento - ver console

#%% teste
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
print('Qualidade prevista: ', mlp.predict( [[ 7.0, 0.5, 0.2, 2.0, 0.07, 10.0, 50.0, 0.991, 3.3, 0.55, 10.0 ]] ) )
input('Aperte uma tecla para continuar:')

#%% ALGUNS PARÂMETROS DA REDE

print("Classes = ", mlp.classes_)     # lista de classes
print("Erro = ", mlp.loss_)    # fator de perda (erro)
print("Amostras visitadas = ", mlp.t_)     # número de amostras de treinamento visitadas 
print("Atributos de entrada = ", mlp.n_features_in_)   # número de atributos de entrada (campos de X)
print("N ciclos = ", mlp.n_iter_)      # númerode iterações no treinamento
print("N de camadas = ", mlp.n_layers_)    # número de camadas da rede
print("Tamanhos das camadas ocultas: ", mlp.hidden_layer_sizes)
print("N de neurons saida = ", mlp.n_outputs_)   # número de neurons de saida
print("F de ativação = ", mlp.out_activation_)  # função de ativação utilizada
