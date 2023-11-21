import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Login = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginErrorStatus, setLoginErrorStatus] = useState(false);
  const [loginError, setLoginError] = useState([]);


  const history = useHistory();
  const { setUser } = ChatState();

  function isValidEmail(email) {
    if (email !== undefined) {
      if (!/\S+@\S+\.\S+/.test(email)) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  }

  const submitHandler = async () => {
    const errors = []
    // Validate Email
    if (!email.trim()) {
      errors.push({ field: 'email', message: 'Please enter your email' });
    } else if (!isValidEmail(email)) {
      errors.push({ field: 'email', message: 'Email ID is not valid' });
    }

    // Validate Password
    if (!password.trim()) {
      errors.push({ field: 'password', message: 'Please enter your password' });
    } else if (password.length < 6) {
      errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
    }

        // Check if there are any errors
        if (errors.length > 0) {
          setLoginErrorStatus(true);
          setLoginError(errors);
          return false;
        } else {
          setLoginErrorStatus(false)
        }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.push("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="10px">
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          value={email}
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
                <div>
          {loginErrorStatus && loginError.map(error => (
            <>
              {error.field === "email" && <p key={error.field} style={{ color: "red" }}>{error.message}</p>}
            </>
          ))}
        </div>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
        <div>
            {loginErrorStatus && loginError.map(error => (
              <>
                {error.field === "password" && <p key={error.field} style={{ color: "red" }}>{error.message}</p>}
              </>
            ))}
          </div>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("kunal123@gmail.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
