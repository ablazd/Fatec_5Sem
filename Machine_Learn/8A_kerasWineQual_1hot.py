# Importar bibliotecas necessárias
import numpy as np

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

from keras.models import Sequential
from keras.layers import Input, Dense

from sklearn.metrics import confusion_matrix
from sklearn.metrics import ConfusionMatrixDisplay
import matplotlib.pyplot as plt

from keras.utils import to_categorical   # OneHotEncoder


#%% Carregar a base de dados Wine Quality da UCI
url = 'https://archive.ics.uci.edu/ml/machine-learning-databases/wine-quality/winequality-red.csv'
df = pd.read_csv(url, sep=';')

# Definir a variável de saída (qualidade do vinho)
y1 = df['quality']
    ## separa a coluna Qualidade como 'meta' de classificação

# one-hot encoding
y = to_categorical(y1, num_classes=11)

# Definir as variáveis de entrada (características do vinho)
X = df.drop('quality', axis=1)
    ## drop descarta a coluna quality, preservando as demais

#%% Separar em conjunto de treinamento e teste
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Normalizar as variáveis de entrada para a escala 0 a 1
escala = StandardScaler()
X_train = escala.fit_transform(X_train)
X_test = escala.transform(X_test)

#%% Construir a rede neural densa com uma camada oculta
mlp = Sequential()
mlp.add(Input(shape=(11,)))   # camada de entrada com 11 neurons
mlp.add(Dense(64, activation='relu'))
    ## camada oculta com 64 neurons
mlp.add(Dense(11, activation='softmax'))
    ## camada de saída com 7 neurons, para a faixa de qualidade 3 a 9
    ## retificada para notas de 0 a 10, mesmo que algumas não existam

# Compilar o modelo
mlp.compile(loss = 'categorical_crossentropy',
                optimizer = 'adam', metrics = ['accuracy'])
    ## loss para One Hot Enc

#%% Treinar o modelo
mlp.fit(X_train, y_train, epochs=200, batch_size=32,
            validation_data=(X_test, y_test), verbose=1)


#%% Avaliar o modelo
loss, accuracy = mlp.evaluate(X_test, y_test)
print(f'\nACURACIA: {accuracy:.2f}')

#%% Prever para um vinho desconhecido
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
# vinho desconhecido com as medições: 1    2    3    4    5     6     7      8     9    10    11
x_desc = np.array([[ 7.0, 0.5, 0.2, 2.0, 0.07, 10.0, 50.0, 0.991, 3.3, 0.55, 10.0 ]])
y_desc = mlp.predict(x_desc)
print('\nQualidade prevista: ', y_desc )  # dá a probabilidade em cada classe
classe_desc = np.argmax(y_desc)
print('\nClasse prevista: ', classe_desc, 
        ' com probabilidade ', y_desc[:,classe_desc])
input('Aperte [enter]:')


# Prever as classes para o conjunto de teste
y_prev = mlp.predict(X_test)
y_prev_class = np.argmax(y_prev, axis=1)
# y_test está 'encoder', logo é matriz, extrair o vetor:
y_test_class = np.argmax(y_test, axis=1)

# Calcular a matriz de confusão
'''
conf_mat = confusion_matrix(y_test_class, y_prev_class)
print('Matriz de confusao:')
print(conf_mat)
'''
class_names = np.unique(y1)  # usar o 'não-encoder'
print('\nNomes das classes: ', class_names)
input('Aperte [enter]')
cm = confusion_matrix(y_test_class, y_prev_class, labels=class_names)

display = ConfusionMatrixDisplay(confusion_matrix=cm,
                              display_labels=class_names)
display.plot()
plt.show()
