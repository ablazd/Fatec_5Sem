#%% BIBLIOTECAS

from sklearn.neural_network import MLPClassifier

#%% CARGA DOS DADOS

X = [ [0,0], [0,1], [1,0], [1,1] ]
y = [ [0], [1], [1], [0] ]

#%% CONFIG REDE NEURAL

mlp = MLPClassifier(verbose=True, max_iter=2000, tol=1e-3, activation='relu')

#%% TREINAMENTO DA REDE

mlp.fit(X, y) #executa treinamento - ver console

#%% TESTE

for caso in X:
    print('caso:', caso, 'previsto: ', mlp.predict([caso]))

#%% ALGUNS PARAMETROS DA REDE

print("Classes: ", mlp.classes_) #classes
print("Erro: ", mlp.loss_) #erro
print("Amostras visitadas:", mlp.t_) #N amostras de treinamento
print("Atributos de entrada:", mlp.n_features_in_) #N atributos de entrada
print("N ciclos: ", mlp.n_iter_) #N iterações de treinamento
print("N de camadas: ", mlp.n_layers_) #N camadas da rede
print("Tamanho das camadas ocultas: ", mlp.hidden_layer_sizes) 
print("N de neuros de saida: ", mlp.n_outputs_) #N neuros de saida
print("F de ativação: ", mlp.out_activation) #função de ativação


