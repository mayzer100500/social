import { useContext, useRef, useState } from 'react'
import { AuthContext } from '../../context/authContext'
import './login.scss'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
    const [state, setState] = useState({
        error: "",
        status: ""
    })
    const { login, currentUser } = useContext(AuthContext)
    const username = useRef(null)
    const password = useRef(null)
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        setState({ status: "pending", error: "" })
        try {
            const response = await login({ username: username.current.value, password: password.current.value })
            setState({ status: "fullfilled", error: "" })
            navigate("/")
        } catch (err) {
            setState({ status: "fullfilled", error: err.message })
        }
    }

    return (
        <div className='login'>
            <div className="card">
                <div className="left">
                    <h1>Hello World!</h1>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam optio corrupti quisquam cupiditate voluptatum esse minima eum aliquam laboriosam quod suscipit, repudiandae nisi architecto officiis iste explicabo porro nihil velit.</p>
                    <span>Don't you have an account?</span>
                    <Link to='/register'>
                        <button>Register</button>
                    </Link>
                </div>
                <div className="right">
                    <h1>Login</h1>
                    <form>
                        <input ref={username} type="text" placeholder='Username' />
                        <input ref={password} type="password" placeholder='Password' />
                        {state.error && <span style={{ color: "red" }}>{state.error}</span>}
                        <button onClick={handleLogin} disabled={state.status === "pending" ? true : false}>{state.status === "pending" ? "Loading..." : "Login"}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login