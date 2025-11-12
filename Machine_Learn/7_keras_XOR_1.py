# Bibliotecas
import numpy as np
from keras.layers import Input, Dense
from keras.models import Sequential

# Tabela verdade XOR
X = np.array( [ [0, 0], [0, 1], [1, 0], [1, 1] ] )

# Saídas correspondentes
y = np.array( [ [0], [1], [1], [0] ] )

# Modelo da rede neural
model = Sequential()
model.add(Input(shape=(2,)))   # camada de entrada com 2 neurons
model.add(Dense(10, activation='relu'))  # camada oculta com 10 neurons
model.add(Dense(1, activation='sigmoid'))  # camada de saída com 1 neuron

# Compilar o modelo
model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])

# Treinar o modelo
model.fit(X, y, epochs=1000, verbose=1)

# Avaliar o modelo
loss, accuracy = model.evaluate(X, y)
print(f'Erro: {loss:.3f}, Acuracia: {accuracy:.3f}')

# Previsões com o modelo
for caso in X :
    print('caso: ', caso, ' previsto: ', model.predict(caso.reshape(1,-1)) )

    ## reshape(1,-1) torna para 1 linha e -1 colunas automáticas para acomodar
    ## veja 'caso.shape' e 'caso.reshape(1,-1).shape'

# ou pode fazer isso direto:
'''
previs = model.predict(X)
print(previs)
'''
