import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, TextInput } from "react-native";

const SOSApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "ADMIN" && password === "PASSWORD") {
      setLoginSuccess(true);
      setTimeout(() => {
        setIsLoggedIn(true);
        setLoginSuccess(false);
      }, 2000); // Show success message for 2 seconds
    } else {
      alert("Invalid Username or Password");
    }
  };

  const sendSOS = async () => {
    try {
      const contacts = [
        "+917972444100", // SMS only
        "9028191439"
        // "+919699897449", // SMS only
      ];

      const response = await fetch("http://10.0.2.2:3000/send-sos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "🚨 HIGH ALERT 🚨 Kunal  is in danger! 📍 Location: Bharati Vidyapeeth Campus, Pune. Act immediately!",
          to: contacts, // Only SMS contacts
        }),
      });

      const data = await response.json();
      if (data.success) {
        setModalVisible(true);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Request Failed: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      {!isLoggedIn ? (
        loginSuccess ? (
          <View style={styles.successContainer}>
            <Text style={styles.successText}>✅ Account Linked Successful</Text>
            <Text style={styles.loadingText}>Redirecting...</Text>
          </View>
        ) : (
          <View style={styles.loginContainer}>
            <Text style={styles.title}>Login</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        )
      ) : (
        <View style={styles.sosContainer}>
          <Image source={require("./assests/req.png")} style={styles.resqImage} />
          <TouchableOpacity style={styles.sosButton} onPress={sendSOS}>
            <Text style={styles.sosText}>SOS</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Custom Modal for Centered Alert */}
      <Modal transparent={true} animationType="slide" visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>🚨 SOS Sent</Text>
            <Text style={styles.modalSubText}>Your SOS message was sent successfully.</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 20,
  },

  loginContainer: {
    alignItems: "center",
    width: "80%",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },

  input: {
    width: "90%",
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
  },

  loginButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  sosContainer: {
    alignItems: "center",
  },

  sosButton: {
    backgroundColor: "red",
    padding: 25,
    borderRadius: 100,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  sosText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },

  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  modalButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },

  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default SOSApp;
