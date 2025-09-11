
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
O conjunto de dados refere-se a clientes de um distribuidor atacadista. 
Inclui o gasto anual em unidades monetárias (m.u.) em diversas categorias de produtos.

1) FRESCOS: gasto anual (m.u.) com produtos frescos (Contínuo); 
2) LEITE: gasto anual (m.u.) com produtos lácteos (Contínuo); 
3) MERCEARIA: gasto anual (m.u.) com produtos de mercearia (Contínuo); 
4) CONGELADOS: gasto anual (m.u.) com produtos congelados (Contínuo); 
5) DETERGENTES_PAPEL: gasto anual (m.u.) em detergentes e produtos de papel (Contínuo); 
6) DELICATESSEN: gasto anual (m.u.) em produtos de delicatessen (Contínuo); 
7) CHANNEL: canal dos clientes - HoReCa (Hotel/Restaurante/Café) ou canal de varejo (Nominal); 
8) REGION: região dos clientes - Lisboa, Porto ou outra (Nominal)

https://archive.ics.uci.edu/dataset/292/wholesale+customers

'''

# python -m pip install ucimlrepo - somente uma vez

from ucimlrepo import fetch_ucirepo

# obter conjunto de dados 
clientes_atacadistas = fetch_ucirepo(id=292) 

# data (as pandas dataframes) 
X = clientes_atacadistas.data.features 
y = clientes_atacadistas.data.targets 

'''
# Se falhar, recuperar de arquivo de dados
clientes_atacadistas = pd.read_csv('wholesale+customers/Wholesale customers data.csv')
print(clientes_atacadistas)
input('Aperte uma tecla para continuar')
X = clientes_atacadistas.loc[:,'Fresh':'Delicassen']  # de Fresh até Delicassen
y = clientes_atacadistas['Region']  # para classificar por região
ou
y = clientes_atacadistas['Channel']  # para classificar por canal
'''

print('\n', X)      # '\n' linha seguinte
input('Aperte uma tecla para continuar:')
print('\n', y)
input('Aperte uma tecla para continuar:')

# X matriz de atributos ou características (campos)
# y vetor de classes (Region)
  
# metadata 
print(clientes_atacadistas.metadata) 
  
# variable information 
print(clientes_atacadistas.variables) 

#%% CONFIG REDE NEURAL

mlp = MLPClassifier(verbose=True, 
                    max_iter=10000, 
                    tol=1e-6,
                    hidden_layer_sizes = 50, 
                    activation='logistic')

#%% TREINAMENTO DA REDE

mlp.fit(X,y)      # executa treinamento - ver o terminal
input('Aperte uma tecla para continuar:')

#%% teste

# Channel  Fresh Milk  Grocery  Frozen  Detergents Paper  Delicassen
# Canal Leite Frescos Mercearia Congelados Detergentes Papel Iguarias
print('Regiao prevista: ', mlp.predict( [[ 2, 1000, 1000, 4000, 6000, 500, 1800 ]] ) )
input('Aperte uma tecla para continuar:')

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
