import { Link } from 'react-router-dom';
import React from 'react';
import axios from 'axios';
import Alert from '@mui/material/Alert';
import './register.scss';

const Register = () => {
    const [inputs, setInputs] = React.useState({
        username: '',
        email: '',
        password: '',
        name: '',
    });
    const [err, setErr] = React.useState(null);

    const handleChange = (e) => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErr(null);
    };

    const handleClick = async (e) => {
        e.preventDefault();

        try {
            let res = await axios.post(
                'http://localhost:8080/api/auth/register',
                inputs
            );
            setErr(res.data);
        } catch (err) {
            setErr(err.response.data);
        }
    };
    return (
        <div className="register">
            <div className="card">
                <div className="left">
                    <h1>Lama Social.</h1>
                    <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Libero cum, alias totam numquam ipsa exercitationem
                        dignissimos, error nam, consequatur.
                    </p>
                    <span>Do you have an account?</span>
                    <Link to="/login">
                        <button>Login</button>
                    </Link>
                </div>
                <div className="right">
                    <h1>Register</h1>
                    <form>
                        <input
                            type="text"
                            placeholder="Username"
                            name="username"
                            onChange={handleChange}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            name="email"
                            onChange={handleChange}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            placeholder="Name"
                            name="name"
                            onChange={handleChange}
                        />
                        {err === 'User already exists' ? (
                            <Alert severity="error">{err}</Alert>
                        ) : err === 'User created' ? (
                            <Alert severity="success">{err}</Alert>
                        ) : null}
                        <button onClick={handleClick}>Register</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
