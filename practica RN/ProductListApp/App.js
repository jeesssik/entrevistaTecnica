import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const storedProducts = await AsyncStorage.getItem('products');
        if (storedProducts) {
          setProducts(JSON.parse(storedProducts));
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const saveProducts = async () => {
      try {
        await AsyncStorage.setItem('products', JSON.stringify(products));
      } catch (error) {
        console.error(error);
      }
    };

    saveProducts();
  }, [products]);

  const addProduct = () => {
    if (productName.trim() !== '' && productPrice.trim() !== '') {
      const newProduct = {
        id: Math.random().toString(),
        name: productName,
        price: productPrice,
      };
      setProducts([...products, newProduct]);
      setProductName('');
      setProductPrice('');
    }
  };

  const removeProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre del producto"
        value={productName}
        onChangeText={setProductName}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio del producto"
        value={productPrice}
        onChangeText={setProductPrice}
        keyboardType="numeric"
      />
      <Button title="Agregar Producto" onPress={addProduct} />
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.product}>
            <Text>{item.name} - ${item.price}</Text>
            <TouchableOpacity onPress={() => removeProduct(item.id)}>
              <Text style={styles.deleteButton}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
  product: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  deleteButton: {
    color: 'red',
  },
});

export default App;




//npx expo start

//npx expo install react-dom react-native-web @expo/metro-runtime