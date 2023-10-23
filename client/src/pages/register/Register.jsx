import './register.scss'
import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Register = () => {
    const [state, setState] = useState({
        error: "",
        status: ""
    })
    const userNameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const nameRef = useRef()
    const navigate = useNavigate()

    const handleClick = async e => {
        e.preventDefault()
        const regData = {
            username: userNameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            name: nameRef.current.value
        }

        setState({ error: "", status: "pending" })
        if (!regData.username || !regData.email || !regData.password || !regData.name) return setState({ error: "You must feel all data!!", status: "fullfilled" })
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/register`, regData)
            setState(prev => { return { ...prev, status: "fullfilled" } })
            navigate("/")
        } catch (err) {
            setState({ status: "fullfilled", error: err.response.data })
        }
    }
    return (
        <div className='register'>
            <div className="card">
                <div className="left">
                    <h1>Hello World Social</h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam optio corrupti quisquam cupiditate voluptatum esse minima eum aliquam laboriosam quod suscipit, repudiandae nisi architecto officiis iste explicabo porro nihil velit.</p>
                    <span>Do you have an account?</span>
                    <Link to='/login'>
                        <button>Login</button>
                    </Link>
                </div>
                <div className="right">
                    <h1>Register</h1>
                    <form>
                        <input type="text" ref={userNameRef} placeholder='Username' />
                        <input type="email" ref={emailRef} placeholder='Email' />
                        <input type="password" ref={passwordRef} placeholder='Password' />
                        <input type="text" ref={nameRef} placeholder='Name' />
                        {state.error && <span style={{ color: "red" }}>{state.error}</span>}
                        <button onClick={handleClick} disabled={state.status === "pending" ? true : false}>{state.status === "pending" ? "Loading..." : "Register"}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register