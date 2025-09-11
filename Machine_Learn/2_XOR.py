import pandas as pd  # pyright: ignore[reportMissingImports]
import numpy as np  # pyright: ignore[reportMissingImports]
import matplotlib.pyplot as plt  # pyright: ignore[reportMissingImports]
import sklearn as sk  # pyright: ignore[reportMissingImports]
 
#Importação da biblioteca
from sklearn.neural_network import MLPClassifier  # pyright: ignore[reportMissingImports]
 
#Carga dos dados
X =[[0,0],[0,1],[1,0],[1,1]]
Y =[0,1,1,0]
 
#Configuração da Rede Neural
mlp = MLPClassifier(verbose=True, max_iter=2000,
                    tol=1e-3,
                    activation='relu')
 
#Treinamento da Rede Neural
mlp.fit(X,Y)  #executa o treinamento
 
#Teste da Rede Neural
for caso in X:
    print('caso:', caso, 'previsto:', mlp.predict([caso]))
 
 
#print(mlp.predict([[0,0]]))
#print(mlp.predict([[0,1]]))
#print(mlp.predict([[1,0]]))
#print(mlp.predict([[1,1]]))
 
#Alguns parâmetros da Rede Neural
print("Classes:", mlp.classes_) #Lista de classes
print("Erro:", mlp.loss_) #Fator de perda
print("Amostras Visitadas:", mlp.t_) #Numero de entradas de treinamento
print("Atributos de entrada:", mlp.n_features_in_) #Numero de atributos de entrada
print("Número de Ciclos:", mlp.n_iter_) #Numero de iterações no treinamento
print("Número de camadas:", mlp.n_layers_) #Numero de camadas da rede
print("Tamanho das camadas ocultas:", mlp.hidden_layer_sizes)
print("Número de neurônios de saída:", mlp.n_outputs_) #número de neurônios de saída
print("F de ativação:", mlp.out_activation_) #função de ativação
 