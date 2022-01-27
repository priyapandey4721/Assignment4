import React, { useState, useEffect } from 'react'
import {Form} from 'react-bootstrap';
import axios from 'axios'
import {Container,Button,Typography,TextField,Grid,Avatar,Paper} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link, useNavigate } from 'react-router-dom'
var mailformat = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
var passformat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const bcrypt = require('bcryptjs')
const URL = "http://localhost:3001/calci"
export const Register = () => {
    const paperStyle={padding:20,height:'115vh',width:320,margin:"20px auto"}
    const avatarStyle={backgroundColor:"blue"}
    const navigate = useNavigate()
    const [values, setValues] = useState({
        fname: "",
        lname: "",
        username: "",
        email: "",
        password: "",
        confpassword: ''
    })
    const [errors, setErrors] = useState({})
    const [isSubmit, setisSubmit] = useState(false)
    const handler = (event) => {
        const { name, value } = event.target
        setValues({ ...values, [name]: value })
    }
    const submit = (event) => {
        event.preventDefault();
        setErrors(null)
        //setErrors(validate(values))
        let tempe=validate(values)
        console.log(errors)
        console.log(tempe.length)
        //alert("Regsitered Successfully")
        if(tempe.length===0){
            console.log("hii")
            alert("Regsitered Successfully")
       // setisSubmit(true)
        const hashPass = bcrypt.hashSync(values.password, bcrypt.genSaltSync());
           // if (isSubmit) {           
                let formData = { password: hashPass, email: values.email, fname: values.fname, lname: values.lname, username: values.username,balance:0,totalbudget:0,budget: [] };
                axios.post(URL,formData)
                alert("Regsitered Successfully")
                axios.get(URL)
                .then(res=>console.log(res.data))
                navigate('/')
            }
        }
    const validate = (values) => {
        const e =[];
        const err={};
       // console.log(errors)
        if (!values.fname) {
            e.push({fname:"first name required"})
            err.fname = "first name required";
        }
        if (!values.lname) {
            e.push({lname:"Last name require"})
             err.lname = "Last name required";
        }
        if (!values.username) {
            e.push({name:"Last name require"})
           err.username = "username  required";
        }
        if (!values.email) {
            e.push({email:"Last name require"})
            err.email = "Email required";
        }
        else if (!mailformat.test(values.email)) {
            e.push({email:"Last name require"})
            err.email = "invalid email";
        }
        if (!values.password) {
            e.push({password:"Last name require"})
            err.password = "password required";
        }
        else if (!passformat.test(values.password)) {
            e.push({password:"Last name require"})
            err.password = "invalid password";
        }
        if (!values.confpassword) {
            e.push({confpassword:"Last name require"})
            err.confpassword = "confpassword required";
        }
        else if (values.password !== values.confpassword) {
            e.push({confpassword:"Last name require"})
            err.confpassword = "password and confpassword must be the same"
        }
        setErrors(err)
        console.log(err)
        return e;
    }
    useEffect(() => {
        if (Object.keys(errors).length === 0 && isSubmit) {
            console.log(values)
        }
    }, [errors])
    return (
        <Container>
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align="center">
                <Avatar style={avatarStyle}><LockOutlinedIcon/></Avatar>
        <h2>Register</h2>
        </Grid>
            <Form onSubmit={submit}>
                <TextField type="text" fullWidth placeholder="First Name" name="fname" id="fname" className="form-control" value={values.fname} onChange={handler}></TextField>
                    {errors.fname && <p style={{ color: 'red' }}>{errors.fname}</p>}
                    <br/><br/>
                <TextField type="text" fullWidth placeholder="Last Name" name="lname" id="lname" className="form-control" value={values.lname} onChange={handler}></TextField>
                    {errors.lname && <p style={{ color: 'red' }}>{errors.lname}</p>}
                    <br/><br/>
                <TextField type="text" fullWidth placeholder="UserName " name="username" className="form-control" id="username" value={values.username} onChange={handler}></TextField>
                    {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
                    <br/><br/>
                <TextField type="email" fullWidth placeholder="Email " name="email" className="form-control" id="email" value={values.email} onChange={handler}></TextField>
                    {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                    <br/><br/>
                <TextField type="password" fullWidth placeholder="Password " name="password" id="password" className="form-control" value={values.password} onChange={handler}></TextField>
                    {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                    <br/><br/>
                <TextField type="password" fullWidth placeholder="Confirm password " className="form-control" name="confpassword" id="confpassword" value={values.confpassword} onChange={handler}></TextField>
                    {errors.confpassword && <p style={{ color: 'red' }}>{errors.confpassword}</p>}
                    <br/><br/>
                <div className="remember">
                    <input className="form-check-input" type="checkbox" id="gridCheck" />
                    <span htmlFor="gridCheck">I agree with all Terms and Conditions.</span>
                </div><br/>
                <Link to='/' style={{ textDecoration: 'none', color: 'black' }} ><Button variant="contained" type="submit" value="submit" id="submit" fullWidth       className='btn'  sx={{
                    color:'primary',
                    borderRadius:'20px'
                    }} onClick={submit}>
                    <Typography variant="h6" component="div" >
                        Submit
                    </Typography>
                    </Button></Link>
                    <br></br><br/>
                    <Typography>Already Have an Account ?
                        <Link to='/' style={{ color: '#c91e63' }} ><b><h3>Log in</h3></b></Link></Typography>
                    </Form>
                </Paper>
            </Grid>
        </Container>
    )
}