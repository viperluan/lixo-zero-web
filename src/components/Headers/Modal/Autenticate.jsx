
const Authenticate = ({ email, password, onSuccess, onError }) => {
  const loginUser = async () => {
    try {
      const response = await fetch("/usuarios/autenticar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha: password }),
      });

      if (!response.ok) {
        throw new Error("Falha ao autenticar. Verifique suas credenciais.");
      }

      const userData = await response.json();
      onSuccess(userData);
    } catch (error) {
      console.error("Erro ao autenticar:", error.message);
      onError(error.message);
    }
  };
  loginUser();
  return null;
};

export default Authenticate;
