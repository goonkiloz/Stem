import { useState } from "react";
import { thunkLogin } from "../../../redux/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import "./LoginForm.css";
import { getCurrentUserThunk } from "../../../redux/users";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors('')
    await dispatch(thunkLogin({email, password}))
    .then(() => {
      dispatch(getCurrentUserThunk())
      closeModal();
    })
    .catch(async (res) => {
      const data = await res.json()
      setErrors(data.errors)
    })
  };

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit} className="formContainer">
      {errors.credential && <p>{errors.credential}</p>}
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Log In</button>
        <button type='submit' className='demoUser' onClick={() => {
            setEmail('demo@user.io')
            setPassword('password')
          }}>
            Demo User
          </button>
      </form>
    </>
  );
}

export default LoginFormModal;
