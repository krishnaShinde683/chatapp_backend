import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { Radio, RadioGroup, HStack } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";

const Signup = ({handleButtonClick}) => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState(""); // Updated state for gender
  const [confirmpassword, setConfirmpassword] = useState("");
  const [password, setPassword] = useState("");
  const [picLoading, setPicLoading] = useState(false);
  const [registerErrorStatus, setRegisterErrorStatus] = useState(false);
  const [registerError, setRegisterError] = useState([]);

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

  function isValidPhone(phone) {
    if (phone !== undefined) {
        if (phone?.length > 10) {
            return false;
        }
        if (!(phone?.match('[0-9]{10}'))) {
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}

  const submitHandler = async () => {

    const errors = [];

    // Validate Name
    if (!name?.trim()) {
      errors.push({ field: 'name', message: 'Please enter your name' });
    }

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

    // Validate Confirm Password
    if (!confirmpassword.trim()) {
      errors.push({ field: 'confirmpassword', message: 'Please confirm your password' });
    } else if (confirmpassword !== password) {
      errors.push({ field: 'confirmpassword', message: 'Passwords do not match' });
    }

    // Validate Mobile Number
    if (!mobile.trim()) {
      errors.push({ field: 'mobile', message: 'Please enter phone number' });
  } else if (!isValidPhone(mobile)) {
      errors.push({ field: 'mobile', message: 'Phone number is not valid!' });
  }

    // Validate Gender
    if (!gender) {
      errors.push({ field: 'gender', message: 'Please select your gender' });
    }

    // Check if there are any errors
    if (errors.length > 0) {
      setRegisterErrorStatus(true);
      setRegisterError(errors);
      return false;
    } else {
      setRegisterErrorStatus(false)
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          mobile,
          gender
        },
        config
      );
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      handleButtonClick()
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value || "")}
        />
        <div>
          {registerErrorStatus && registerError.map(error => (
            <>
              {error.field === "name" && <p key={error.field} style={{ color: "red" }}>{error.message}</p>}
            </>
          ))}
        </div>
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value || "")}
        />
        <div>
          {registerErrorStatus && registerError.map(error => (
            <>
              {error.field === "email" && <p key={error.field} style={{ color: "red" }}>{error.message}</p>}
            </>
          ))}
        </div>
      </FormControl>
      <FormControl id="mobile" isRequired>
        <FormLabel>Mobile Number</FormLabel>
        <Input
          type="tel"
          placeholder="Enter Your Mobile Number"
          onChange={(e) => setMobile(e.target.value || "")}
        />
        <div>
          {registerErrorStatus && registerError.map(error => (
            <>
              {error.field === "mobile" && <p key={error.field} style={{ color: "red" }}>{error.message}</p>}
            </>
          ))}
        </div>
      </FormControl>
      <FormControl id="gender" isRequired>
        <FormLabel>Gender</FormLabel>
        <VStack align="start" spacing="1">
          <RadioGroup onChange={setGender} value={gender}>
            <HStack spacing="24px">
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="other">Other</Radio>
            </HStack>
          </RadioGroup>
        </VStack>
        <div>
          {registerErrorStatus && registerError.map(error => (
            <>
              {error.field === "gender" && <p key={error.field} style={{ color: "red" }}>{error.message}</p>}
            </>
          ))}
        </div>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value || "")}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
          <div>
            {registerErrorStatus && registerError.map(error => (
              <>
                {error.field === "password" && <p key={error.field} style={{ color: "red" }}>{error.message}</p>}
              </>
            ))}
          </div>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmpassword(e.target.value || "")}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
          <div>
            {registerErrorStatus && registerError.map(error => (
              <>
                {error.field === "confirmpassword" && <p key={error.field} style={{ color: "red" }}>{error.message}</p>}
              </>
            ))}
          </div>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={picLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
