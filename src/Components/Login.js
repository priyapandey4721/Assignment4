import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'
import SocialButton from './SocialButton'
import {Container,Button,TextField,Typography,Grid,Paper,Avatar} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Form } from 'react-bootstrap';
const URL = "http://localhost:3001/calci"
var mailformat = /^\w+([.-]?\w+)@\w+([.-]?\w+)(.\w{2,3})+$/;
var passformat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const bcrypt = require('bcryptjs')
export const Login = () => {
    const paperStyle={padding:20,height:'90vh',width:320,margin:"20px auto"}
    const avatarStyle={backgroundColor:"blue",height:50,width:50}
    const navigate = useNavigate()
    const [values, setValues] = useState({
        email: "",
        password: ""
    })
    const [login, setlogin] = useState([])
    const [flag, setflag] = useState(false)
    const [errors, setErrors] = useState({})
    const [isSubmit, setisSubmit] = useState(false)
    const handler = (event) => {
        const { name, value } = event.target
        setValues({ ...values, [name]: value })
    }
    const handleSocialLogin = (user) => {
        console.log(user);
        refresh()
        let userlogin= login.find(x=>x.email===user._profile.email)
        let userIndex = login.indexOf(userlogin)
        console.log(userlogin)
        console.log(userIndex)
        if(userIndex +1){
            localStorage.setItem('mycart',JSON.stringify(login[userIndex]));
            // setflag(1);navigate to home
            setflag(true)
        }
        else{
            let formData = {
                fname: user._profile.firstName,
                lname: user._profile.lastName,
                uername: user._profile.id,
                email: user._profile.email,
                password: 'socialLogin',
                totalbudget:0,
                balance:0,
                budget:[]
              };
            axios.post(URL,formData)
            localStorage.setItem('mycart',JSON.stringify(formData));
            //   setflag(1);navigate
            setflag(true)
        }
};
const handleSocialLoginFailure = (err) => {
    console.error(err);
  };
  const refresh = () => {
        axios.get(URL)
            .then(res => {
            console.log(res.data)
            setlogin(res.data)
            })
    }
    const submit = (event) => {
        event.preventDefault();
        setErrors(validate(values))
        setisSubmit(true)
        var data = false;
        refresh()
        login.forEach(user => {
            const doesPasswordMatch = bcrypt.compareSync(values.password, user.password)
            console.log(values.password, doesPasswordMatch);
            console.log(values.email,values.password)
            if (user.email === values.email && doesPasswordMatch) {
                let arr = user
                if (localStorage.getItem('mycart') !== undefined) {
                    localStorage.setItem('mycart', JSON.stringify(arr))
                }
                alert('login succesfully');
                setflag(true)
                data = true;
                return
            }
        });
        if (data !== true) {
            alert('Email id or password is incorrect');
            setflag(false)
        }
    }
    const validate = (values) => {
        const errors = {}
        if (!values.email) {
            errors.email = "Email required";
        }
        else if (!mailformat.test(values.email)) {
            errors.email = "invalid email";
        }
        if (!values.password) {
            errors.password = "password required"; 
        }
        else if (!passformat.test(values.password)) {
            errors.password = "invalid password";
        }
        return errors;
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
                <h2>Login</h2>
                </Grid>
            <Form>
            <Grid>
                <TextField type="email" fullWidth placeholder="Email " className="form-control" name="email" id="email" value={values.email} onChange={handler}></TextField>
                    {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                    <br/><br/>
                <TextField type="password" fullWidth placeholder="password " className="form-control" name="password" id="password" value={values.password} onChange={handler}></TextField>
                    {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                    <br/><br/>
                <Link to='/home' style={{ textDecoration: 'none', color: 'black' }} >
                <Button variant="contained" type="submit" value="submit" id="submit" onClick={submit}  fullWidth className='btn'  sx={{
                    color:'primary',
                    borderRadius:'20px'
                    }} >
                <Typography variant="h6" component="div" >
                    Submit
                </Typography>
                </Button>
                </Link><br/><br/>
                <Typography>Don't Have an Account ?<br/>
                    <Link to='/register' style={{ color: '#c91e63' }} ><b><h3>Sign up</h3></b></Link>
                </Typography>
            </Grid>
            </Form>
            <h3 className="heading12">Login with Social Media</h3>
            <Grid align="center" display="inline-flex">
            <SocialButton
                provider="facebook"
                appId="580744276481816"
                onLoginSuccess={handleSocialLogin}
                onLoginFailure={handleSocialLoginFailure}>
            <Avatar style={avatarStyle}><FacebookIcon/></Avatar>&nbsp;&nbsp;
            </SocialButton>&nbsp;&nbsp;&nbsp;
            <SocialButton 
                provider="google"
                appId="965834070463-nlt50hm305brepc4p3rj2l58687kpq97.apps.googleusercontent.com"
                onLoginSuccess={handleSocialLogin}
                onLoginFailure={handleSocialLoginFailure}>
            <Avatar style={avatarStyle}><GoogleIcon/></Avatar>&nbsp;&nbsp;
            </SocialButton>
            </Grid>
            </Paper>
            </Grid>
            {flag ? navigate('/home') : null}
        </Container>
    )
}